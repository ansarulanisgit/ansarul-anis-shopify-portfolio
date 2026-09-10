import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import type { CtaEventType } from '@/types/database.types';

export async function POST(request: Request) {
  try {
    const { event_type, source_section } = await request.json();

    if (!event_type || !source_section) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = createAdminSupabaseClient();
      await supabase.from('cta_events').insert({
        event_type: event_type as CtaEventType,
        source_section: String(source_section).slice(0, 100),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
