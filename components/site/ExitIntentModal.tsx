'use client';

import * as React from 'react';
import { X, MessageCircle, Send, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SiteSettingsMap } from '@/types/database.types';

interface ExitIntentModalProps {
  settings?: Record<string, any>;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export function ExitIntentModal({
  settings = {},
  whatsappNumber = '+8801709260934',
  whatsappMessage = "Hi Anis! I was about to leave your site and I'd like a free 15-minute Shopify audit & project quote.",
}: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isEnabled = settings.exit_popup_enabled !== false;
  const eyebrow = settings.exit_popup_eyebrow ?? settings.eyebrow ?? 'WAIT! BEFORE YOU GO';
  const title = settings.exit_popup_title ?? settings.heading ?? settings.title ?? "Let's Build Your Dream Shopify Store";
  const subheading =
    settings.exit_popup_subheading ??
    settings.subheading ??
    'Get a Free 15-Minute Shopify Audit & Fixed Quote for your project. Reach out on WhatsApp or drop a quick line below!';
  const whatsappLabel = settings.exit_popup_whatsapp_label ?? settings.whatsapp_label ?? 'Chat on WhatsApp';
  const whatsappTag = settings.exit_popup_whatsapp_tag ?? settings.whatsapp_tag ?? '';
  const submitLabel = settings.exit_popup_submit_label ?? settings.submit_label ?? 'Get Free Audit & Quote';
  const num = settings.whatsapp_number || whatsappNumber;
  const msg = settings.whatsapp_message || whatsappMessage;

  const triggerExitIntent = settings.exit_popup_trigger_exit_intent !== false;
  const triggerScrollEnabled = settings.exit_popup_trigger_scroll_enabled !== false;
  const scrollPx = Number(settings.exit_popup_scroll_px ?? 600);
  const triggerDelayEnabled = Boolean(settings.exit_popup_trigger_delay_enabled);
  const delaySec = Number(settings.exit_popup_delay_sec ?? 30);
  const triggerBottomEnabled = Boolean(settings.exit_popup_trigger_bottom_enabled);
  const bottomPercent = Number(settings.exit_popup_bottom_percent ?? 85);
  const showOncePerSession = settings.exit_popup_show_once_per_session !== false;
  const isPreviewOpen = Boolean(settings.exit_popup_preview_open);

  const cleanNumber = num.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(msg);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;

  React.useEffect(() => {
    // If builder preview mode is toggled, force modal open state
    if (isPreviewOpen) {
      setIsOpen(true);
      return;
    }

    if (typeof window === 'undefined' || !isEnabled) return;

    const storageKey = showOncePerSession
      ? 'anisshopify_exit_modal_dismissed_session'
      : 'anisshopify_exit_modal_dismissed_page';

    const hasContacted = sessionStorage.getItem('anisshopify_user_contacted') === 'true';
    const isDismissed = sessionStorage.getItem(storageKey) === 'true';

    if (hasContacted || isDismissed) return;

    let hasTriggered = false;

    const triggerModal = () => {
      if (!hasTriggered) {
        hasTriggered = true;
        setIsOpen(true);
      }
    };

    // 1. Exit Intent (Mouseleave Top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (triggerExitIntent && e.clientY <= 15) {
        triggerModal();
      }
    };

    // 2. Scroll Depth & Near Bottom / Mobile Back-Scroll
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Scroll Depth Threshold (px)
      if (triggerScrollEnabled && scrollPx > 0 && currentScroll >= scrollPx) {
        triggerModal();
      }

      // Scroll Near Bottom / Footer (%)
      if (triggerBottomEnabled && docHeight > 0) {
        const scrolledPct = (currentScroll / docHeight) * 100;
        if (scrolledPct >= bottomPercent) {
          triggerModal();
        }
      }

      // Exit Intent Fallback for back-scroll on mobile
      if (triggerExitIntent && docHeight > 0 && currentScroll / docHeight > 0.45 && lastScrollY - currentScroll > 150) {
        triggerModal();
      }

      lastScrollY = currentScroll;
    };

    // 3. Time Delay Timer (delay_sec)
    let delayTimer: NodeJS.Timeout | null = null;
    if (triggerDelayEnabled && delaySec > 0) {
      delayTimer = setTimeout(() => {
        triggerModal();
      }, delaySec * 1000);
    }

    if (triggerExitIntent) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }
    if (triggerExitIntent || triggerBottomEnabled || (triggerScrollEnabled && scrollPx > 0)) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (triggerExitIntent) {
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('scroll', handleScroll);
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [
    isEnabled,
    triggerExitIntent,
    triggerScrollEnabled,
    scrollPx,
    triggerDelayEnabled,
    delaySec,
    triggerBottomEnabled,
    bottomPercent,
    showOncePerSession,
    isPreviewOpen,
  ]);

  const handleClose = () => {
    setIsOpen(false);
    const storageKey = showOncePerSession
      ? 'anisshopify_exit_modal_dismissed_session'
      : 'anisshopify_exit_modal_dismissed_page';
    sessionStorage.setItem(storageKey, 'true');
  };

  const handleWhatsAppClick = async () => {
    sessionStorage.setItem('anisshopify_user_contacted', 'true');
    try {
      await fetch('/api/cta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'whatsapp_click',
          source_section: 'exit_modal',
        }),
      });
    } catch {}
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: 'Exit Intent Inquiry',
          message: message.trim(),
          project_type: 'Exit Intent Lead',
          budget_range: '$500-$2000',
        }),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || 'Failed to submit form');
      }

      sessionStorage.setItem('anisshopify_user_contacted', 'true');
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please chat on WhatsApp instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !isEnabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg sm:max-w-[640px] bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Accent Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary shrink-0" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-7 overflow-y-auto space-y-4">
          {/* Header Hook */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{eyebrow}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-snug">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              {subheading}
            </p>
          </div>

          {/* Shorter, sleek WhatsApp button */}
          <div className="flex justify-center pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] group"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{whatsappLabel}</span>
            </a>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-border/80" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">
              Or Send Quick Message
            </span>
            <div className="flex-grow border-t border-border/80" />
          </div>

          {/* Form Content / Success */}
          {isSubmitted ? (
            <div className="py-4 flex flex-col items-center text-center space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Message Sent Successfully!</h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Thank you! I will review your request and reply to your email within 2 hours.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left pb-1">
              {error && (
                <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Your Name</label>
                  <Input
                    type="text"
                    placeholder="Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Your Email</label>
                  <Input
                    type="email"
                    placeholder="sarah@brand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">Project Details / Question</label>
                <Textarea
                  placeholder="Tell me briefly about your Shopify store idea, redesign, or questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="min-h-[70px] text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting request...</span>
                ) : (
                  <>
                    <span>{submitLabel}</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
