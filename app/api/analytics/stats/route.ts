import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const COUNTRY_FLAGS: Record<string, string> = {
  'United States': '🇺🇸',
  'US': '🇺🇸',
  'United Kingdom': '🇬🇧',
  'GB': '🇬🇧',
  'Canada': '🇨🇦',
  'CA': '🇨🇦',
  'Australia': '🇦🇺',
  'AU': '🇦🇺',
  'Germany': '🇩🇪',
  'DE': '🇩🇪',
  'Bangladesh': '🇧🇩',
  'BD': '🇧🇩',
  'Netherlands': '🇳🇱',
  'NL': '🇳🇱',
  'France': '🇫🇷',
  'FR': '🇫🇷',
  'United Arab Emirates': '🇦🇪',
  'AE': '🇦🇪',
  'India': '🇮🇳',
  'IN': '🇮🇳',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '30d'; // 'today' | '7d' | '30d' | '90d'

    const now = new Date();
    let startDate = new Date();

    if (timeRange === 'today') {
      startDate.setUTCHours(0, 0, 0, 0);
    } else if (timeRange === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === '90d') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else {
      // 30d default
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const supabase = createAdminSupabaseClient();

    // Query events from Supabase cta_events within the date range
    const { data: rawEvents } = await supabase
      .from('cta_events')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    // Active now in last 3 minutes
    const threeMinAgo = new Date(now.getTime() - 3 * 60 * 1000).toISOString();
    const { data: recentActiveEvents } = await supabase
      .from('cta_events')
      .select('source_section')
      .gte('created_at', threeMinAgo);

    // Compute unique active visitors in the last 3 minutes
    const activeSessionIds = new Set<string>();
    (recentActiveEvents || []).forEach((e) => {
      try {
        const p = JSON.parse(e.source_section);
        if (p.session_id) activeSessionIds.add(p.session_id);
      } catch {}
    });

    const activeNow = activeSessionIds.size;

    // Process logged events
    const parsedEvents = (rawEvents || []).map((e) => {
      let payload: any = {};
      try {
        payload = JSON.parse(e.source_section);
      } catch {
        payload = { raw: e.source_section };
      }
      return {
        id: e.id,
        event_type: e.event_type,
        created_at: e.created_at,
        ...payload,
      };
    });

    // Group events by session
    const sessionMap = new Map<
      string,
      {
        sessionId: string;
        events: any[];
        device: 'desktop' | 'mobile' | 'tablet';
        country: string;
        city: string;
        maxDuration: number;
        pageViews: number;
        ctaClicks: number;
      }
    >();

    parsedEvents.forEach((e) => {
      const sid = e.session_id || `anon-${e.id}`;
      if (!sessionMap.has(sid)) {
        sessionMap.set(sid, {
          sessionId: sid,
          events: [],
          device: (['desktop', 'mobile', 'tablet'].includes(e.device) ? e.device : 'desktop') as any,
          country: e.country || 'Global Visitor',
          city: e.city || '',
          maxDuration: 0,
          pageViews: 0,
          ctaClicks: 0,
        });
      }
      const sess = sessionMap.get(sid)!;
      sess.events.push(e);
      if (['desktop', 'mobile', 'tablet'].includes(e.device)) sess.device = e.device;
      if (e.country) sess.country = e.country;
      if (e.city) sess.city = e.city;
      if (typeof e.duration === 'number' && e.duration > sess.maxDuration) {
        sess.maxDuration = e.duration;
      }
      if (e.event_type === 'page_view') {
        sess.pageViews++;
      }
      if (['cta_click', 'whatsapp_click', 'form_submit', 'case_study_click'].includes(e.event_type)) {
        sess.ctaClicks++;
      }
    });

    const totalVisitors = sessionMap.size;
    const totalPageViews = parsedEvents.filter((e) => e.event_type === 'page_view').length;
    const totalCtaClicks = parsedEvents.filter((e) =>
      ['cta_click', 'whatsapp_click', 'form_submit', 'case_study_click'].includes(e.event_type)
    ).length;

    // Conversion rate: visitors who completed at least one CTA conversion action
    const convertingSessions = Array.from(sessionMap.values()).filter((s) => s.ctaClicks > 0).length;
    const ctr = totalVisitors > 0 ? ((convertingSessions / totalVisitors) * 100).toFixed(1) : '0.0';

    // Average duration in seconds (from sessions with active duration recorded)
    const sessionsWithDuration = Array.from(sessionMap.values())
      .map((s) => s.maxDuration)
      .filter((d) => d > 0);
    const avgDurationSeconds =
      sessionsWithDuration.length > 0
        ? Math.round(sessionsWithDuration.reduce((a, b) => a + b, 0) / sessionsWithDuration.length)
        : 0;

    // Bounce rate: sessions with <= 1 event or under 10 seconds with 0 clicks
    const bouncedSessions = Array.from(sessionMap.values()).filter(
      (s) => s.events.length <= 1 || (s.maxDuration < 10 && s.ctaClicks === 0)
    ).length;
    const bounceRate = totalVisitors > 0 ? ((bouncedSessions / totalVisitors) * 100).toFixed(1) + '%' : '0.0%';

    // Device breakdown
    const devCounts = { desktop: 0, mobile: 0, tablet: 0 };
    sessionMap.forEach((s) => {
      if (devCounts[s.device] !== undefined) {
        devCounts[s.device]++;
      } else {
        devCounts.desktop++;
      }
    });

    const deviceBreakdown = [
      {
        name: 'Desktop',
        count: devCounts.desktop,
        percentage: totalVisitors > 0 ? Math.round((devCounts.desktop / totalVisitors) * 100) : 0,
        color: '#FF2A51',
      },
      {
        name: 'Mobile',
        count: devCounts.mobile,
        percentage: totalVisitors > 0 ? Math.round((devCounts.mobile / totalVisitors) * 100) : 0,
        color: '#3B82F6',
      },
      {
        name: 'Tablet',
        count: devCounts.tablet,
        percentage: totalVisitors > 0 ? Math.round((devCounts.tablet / totalVisitors) * 100) : 0,
        color: '#10B981',
      },
    ];

    // Location breakdown
    const countryNamesMap: Record<string, string> = {
      US: 'United States',
      BD: 'Bangladesh',
      GB: 'United Kingdom',
      CA: 'Canada',
      AU: 'Australia',
      DE: 'Germany',
      FR: 'France',
      AE: 'United Arab Emirates',
      IN: 'India',
      NL: 'Netherlands',
    };

    const countryCounts: Record<string, number> = {};
    sessionMap.forEach((s) => {
      const c = countryNamesMap[s.country] || s.country || 'Global Visitor';
      countryCounts[c] = (countryCounts[c] || 0) + 1;
    });

    const locationBreakdown = Object.entries(countryCounts)
      .map(([country, count]) => ({
        country,
        flag: COUNTRY_FLAGS[country] || '🌐',
        visitors: count,
        percentage: totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 6);

    // CTA Breakdown
    const ctaCounts: Record<string, number> = {};
    parsedEvents.forEach((e) => {
      if (['cta_click', 'whatsapp_click', 'form_submit', 'case_study_click'].includes(e.event_type)) {
        let name = e.cta_name;
        if (!name) {
          if (e.event_type === 'whatsapp_click') name = 'WhatsApp Direct Chat';
          else if (e.event_type === 'form_submit') name = 'Contact Form Inquiry';
          else if (e.event_type === 'case_study_click') name = 'Case Study Modal Views';
          else name = 'Call to Action Button';
        } else {
          if (name.toLowerCase().includes('whatsapp')) name = 'WhatsApp Direct Chat';
          else if (name.toLowerCase().includes('contact form') || e.event_type === 'form_submit') name = 'Contact Form Inquiry';
          else if (name.toLowerCase().includes('case study') || e.event_type === 'case_study_click') name = 'Case Study Modal Views';
          else if (name.toLowerCase().includes('work')) name = 'View My Work (Hero)';
          else if (name.toLowerCase().includes('contact me')) name = 'Contact Me (Hero)';
        }
        ctaCounts[name] = (ctaCounts[name] || 0) + 1;
      }
    });

    const ctaBreakdown = Object.entries(ctaCounts)
      .map(([name, clicks]) => ({
        id: name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
        name,
        clicks,
        rate: totalCtaClicks > 0 ? `${Math.round((clicks / totalCtaClicks) * 100)}%` : '0%',
      }))
      .sort((a, b) => b.clicks - a.clicks);

    // Dynamic Time Series Chart Data by Calendar Dates
    let timeSeries: Array<{ name: string; visitors: number; clicks: number }> = [];

    if (timeRange === 'today') {
      const todayKey = now.toISOString().slice(0, 10);
      const dayEvents = parsedEvents.filter((e) => e.created_at.slice(0, 10) === todayKey);

      // Hourly intervals from 00:00 up to 23:00
      for (let h = 0; h < 24; h += 2) {
        const hourStr = `${h.toString().padStart(2, '0')}:00`;
        const nextHour = h + 2;
        const bucketEvents = dayEvents.filter((e) => {
          const evtHour = new Date(e.created_at).getUTCHours();
          return evtHour >= h && evtHour < nextHour;
        });

        const sids = new Set(bucketEvents.map((e) => e.session_id || `anon-${e.id}`));
        const clicks = bucketEvents.filter((e) =>
          ['cta_click', 'whatsapp_click', 'form_submit', 'case_study_click'].includes(e.event_type)
        ).length;

        timeSeries.push({
          name: hourStr,
          visitors: sids.size,
          clicks,
        });
      }
    } else if (timeRange === '7d') {
      // 7 calendar days ending today
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const dayEvents = parsedEvents.filter((e) => e.created_at.slice(0, 10) === dateKey);
        const sids = new Set(dayEvents.map((e) => e.session_id || `anon-${e.id}`));
        const clicks = dayEvents.filter((e) =>
          ['cta_click', 'whatsapp_click', 'form_submit', 'case_study_click'].includes(e.event_type)
        ).length;

        timeSeries.push({
          name: label,
          visitors: sids.size,
          clicks,
        });
      }
    } else if (timeRange === '90d') {
      // 30 3-day intervals over 90 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 3 * 24 * 60 * 60 * 1000);
        const nextD = new Date(d.getTime() + 3 * 24 * 60 * 60 * 1000);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const intervalEvents = parsedEvents.filter((e) => {
          const t = new Date(e.created_at).getTime();
          return t >= d.getTime() && t < nextD.getTime();
        });
        const sids = new Set(intervalEvents.map((e) => e.session_id || `anon-${e.id}`));
        const clicks = intervalEvents.filter((e) =>
          ['cta_click', 'whatsapp_click', 'form_submit', 'case_study_click'].includes(e.event_type)
        ).length;

        timeSeries.push({
          name: label,
          visitors: sids.size,
          clicks,
        });
      }
    } else {
      // 30d default: 30 calendar days ending today
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const dayEvents = parsedEvents.filter((e) => e.created_at.slice(0, 10) === dateKey);
        const sids = new Set(dayEvents.map((e) => e.session_id || `anon-${e.id}`));
        const clicks = dayEvents.filter((e) =>
          ['cta_click', 'whatsapp_click', 'form_submit', 'case_study_click'].includes(e.event_type)
        ).length;

        timeSeries.push({
          name: label,
          visitors: sids.size,
          clicks,
        });
      }
    }

    // Meaningful Recent Events (excluding silent heartbeats for readability)
    const meaningfulEvents = parsedEvents.filter((e) => e.event_type !== 'heartbeat');
    const recentEvents = (meaningfulEvents.length > 0 ? meaningfulEvents : parsedEvents).slice(0, 8).map((e) => {
      const country = countryNamesMap[e.country] || e.country;
      const location = e.city ? `${e.city}, ${country || 'Global'}` : country || 'Global Visitor';

      let label = `Visited Page (${e.path || '/'})`;
      if (e.event_type === 'cta_click') {
        label = `Clicked CTA "${e.cta_name || 'Action'}"`;
      } else if (e.event_type === 'whatsapp_click') {
        label = 'Initiated WhatsApp Direct Chat';
      } else if (e.event_type === 'form_submit') {
        label = 'Submitted Contact Form Lead';
      } else if (e.event_type === 'case_study_click') {
        label = `Viewed Case Study (${e.cta_name || 'Project'})`;
      } else if (e.event_type === 'session_duration') {
        label = `Browsed Site for ${Math.floor((e.duration || 0) / 60)}m ${(e.duration || 0) % 60}s`;
      }

      return {
        id: e.id,
        event_type: e.event_type,
        label,
        location,
        device: e.device || 'desktop',
        created_at: e.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        active_now: activeNow,
        time_range: timeRange,
        summary: {
          total_visitors: totalVisitors,
          total_page_views: totalPageViews,
          total_cta_clicks: totalCtaClicks,
          ctr_percent: ctr,
          avg_duration_seconds: avgDurationSeconds,
          avg_duration_formatted: `${Math.floor(avgDurationSeconds / 60)}m ${avgDurationSeconds % 60}s`,
          bounce_rate: bounceRate,
        },
        device_breakdown: deviceBreakdown,
        location_breakdown: locationBreakdown,
        cta_breakdown: ctaBreakdown,
        time_series: timeSeries,
        recent_events: recentEvents,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
