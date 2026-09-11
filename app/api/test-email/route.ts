import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/email/sender';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetEmail = body.email || process.env.CONTACT_NOTIFICATION_EMAIL || 'ansarul.contact@gmail.com';

    const result = await sendLeadEmail({
      name: 'Diagnostic Test',
      email: targetEmail,
      subject: 'Test Lead Notification',
      message: 'This is a test email sent from your Shopify Portfolio Admin Dashboard to verify email delivery.',
      project_type: 'System Test',
      budget_range: 'N/A',
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        method: result.method,
        message: `Test email sent successfully to ${targetEmail} via ${result.method?.toUpperCase()}! Check your inbox/spam folder.`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'No email service credentials configured in .env.local',
          details: {
            hasResendKey: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_')),
            hasSmtpCreds: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
            targetEmail,
          },
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
