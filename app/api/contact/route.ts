import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { sendLeadEmail } from '@/lib/email/sender';
import { getSiteSettings } from '@/lib/data/queries';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  budget_range: z.string().optional(),
  project_type: z.string().optional(),
  message: z.string().min(10),
  honeypot: z.string().max(0).optional(),
});

// In-memory rate limiting map (IP -> last timestamp)
const rateLimitMap = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip);

    // Block rapid spam requests within 4 seconds from same IP
    if (lastRequest && now - lastRequest < 4000) {
      return NextResponse.json(
        { error: 'Please wait a moment before submitting again.' },
        { status: 429 }
      );
    }
    rateLimitMap.set(ip, now);

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data provided. Please check all fields.' },
        { status: 400 }
      );
    }

    const { name, email, subject, budget_range, project_type, message, honeypot } = parsed.data;

    // Honeypot spam protection
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ error: 'Spam detected.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseLive = supabaseUrl && !supabaseUrl.includes('placeholder');

    // 1. Store in Dashboard Leads (Supabase)
    if (isSupabaseLive) {
      try {
        const supabase = createAdminSupabaseClient();

        // Format message with clear subject header
        const formattedLeadMessage = `[Subject: ${subject}]\n\n${message}`;

        const { error: leadError } = await supabase.from('leads').insert({
          name,
          email,
          budget_range: budget_range || null,
          project_type: project_type || null,
          message: formattedLeadMessage,
          source: 'email_form',
          status: 'new',
        });

        if (leadError) {
          console.error('Supabase lead insert error:', leadError);
        }

        // Log CTA event
        await supabase.from('cta_events').insert({
          event_type: 'form_submit',
          source_section: 'contact_form',
        });
      } catch (dbErr) {
        console.error('Error saving lead to database:', dbErr);
      }
    }

    // 2. Send email notification (awaited so serverless execution context stays active until sent)
    try {
      const siteSettings = await getSiteSettings();
      const emailResult = await sendLeadEmail(
        {
          name,
          email,
          subject,
          message,
          project_type,
          budget_range,
        },
        siteSettings
      );

      if (!emailResult.success) {
        console.error('Lead email notification delivery failed:', emailResult.error);
      } else {
        console.log(`✅ Lead email notification successfully sent via ${emailResult.method}`);
      }
    } catch (emailErr) {
      console.error('Lead email notification background delivery error:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been received! I will contact you shortly.',
    });
  } catch (error: any) {
    console.error('Contact API handler error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}

