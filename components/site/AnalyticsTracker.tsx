'use client';

import * as React from 'react';

declare global {
  interface Window {
    trackCtaClick?: (ctaName: string) => void;
  }
}

export function AnalyticsTracker() {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Session ID Management
    let sessionId = sessionStorage.getItem('_sf_analytics_sid');
    if (!sessionId) {
      sessionId = 'sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      sessionStorage.setItem('_sf_analytics_sid', sessionId);
    }

    // 2. Client Device & Environment Detection
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
    const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    let browser = 'Other';
    if (/Edg/i.test(ua)) browser = 'Edge';
    else if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';

    let os = 'Other';
    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Macintosh|Mac OS/i.test(ua)) os = 'macOS';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/Linux/i.test(ua)) os = 'Linux';

    // 3. Dispatch Helper
    const sendEvent = (eventType: string, extra: Record<string, any> = {}) => {
      const payload = {
        event_type: eventType,
        session_id: sessionId,
        device,
        browser,
        os,
        path: window.location.pathname,
        referrer: document.referrer || '',
        ...extra,
      };

      try {
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/track', blob);
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Non-blocking
      }
    };

    // 4. Initial Page View Tracking
    sendEvent('page_view');

    // 5. Global helper for manual CTA tracking
    window.trackCtaClick = (ctaName: string) => {
      sendEvent('cta_click', { cta_name: ctaName });
    };

    // 6. Automatic CTA Click Delegation
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const ctaElement = target.closest('[data-track-cta]') as HTMLElement | null;
      if (ctaElement) {
        const ctaName = ctaElement.getAttribute('data-track-cta') || ctaElement.innerText?.trim();
        if (ctaName) sendEvent('cta_click', { cta_name: ctaName });
        return;
      }

      // Fallback heuristics for common CTA buttons
      const buttonOrLink = target.closest('a, button');
      if (buttonOrLink) {
        const text = (buttonOrLink.textContent || '').trim();
        const href = buttonOrLink.getAttribute('href') || '';

        if (href.includes('wa.me') || href.includes('whatsapp') || text.toLowerCase().includes('whatsapp')) {
          sendEvent('whatsapp_click', { cta_name: 'WhatsApp Inquiry' });
        } else if (text.includes('View My Work')) {
          sendEvent('cta_click', { cta_name: 'View My Work (Hero)' });
        } else if (text.includes('Contact Me')) {
          sendEvent('cta_click', { cta_name: 'Contact Me (Hero)' });
        } else if (text.includes("Let's Talk")) {
          sendEvent('cta_click', { cta_name: "Let's Talk (Nav)" });
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });

    // 7. Active Page Duration & Heartbeat
    let startTime = Date.now();
    let totalEngagedSeconds = 0;

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        totalEngagedSeconds += 25;
        sendEvent('heartbeat', { duration: totalEngagedSeconds });
      }
    }, 25000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        sendEvent('session_duration', { duration: Math.max(totalEngagedSeconds, elapsed) });
      } else {
        startTime = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      sendEvent('session_duration', { duration: Math.max(totalEngagedSeconds, elapsed) });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}
