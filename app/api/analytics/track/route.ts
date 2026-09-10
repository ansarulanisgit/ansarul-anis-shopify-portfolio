import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    let body: any = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = {};
      }
    }

    const {
      event_type = 'page_view',
      session_id,
      cta_name,
      device = 'desktop',
      browser = 'Chrome',
      os = 'Windows',
      duration = 0,
      path = '/',
      referrer = '',
      user_country,
      user_city,
    } = body;

    // Detect Country & City from Request Headers if available
    const headerCountry =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-country-code') ||
      user_country ||
      'United States';

    const headerCity =
      request.headers.get('x-vercel-ip-city') ||
      user_city ||
      '';

    const payload = JSON.stringify({
      session_id: session_id || 'anon-' + Math.random().toString(36).substring(2, 9),
      device: ['desktop', 'mobile', 'tablet'].includes(device) ? device : 'desktop',
      browser: browser || 'Unknown',
      os: os || 'Unknown',
      country: headerCountry,
      city: headerCity,
      duration: Math.max(0, Math.round(Number(duration) || 0)),
      cta_name: cta_name || null,
      path: path || '/',
      referrer: referrer ? String(referrer).slice(0, 200) : '',
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = createAdminSupabaseClient();
      await supabase.from('cta_events').insert({
        event_type: String(event_type).slice(0, 50),
        source_section: payload,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
