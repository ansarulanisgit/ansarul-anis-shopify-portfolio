'use client';

import * as React from 'react';
import { X, MessageCircle, Send, CheckCircle2, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ExitIntentModalProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export function ExitIntentModal({
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

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user has already contacted or dismissed
    const hasContacted = sessionStorage.getItem('anisshopify_user_contacted') === 'true';
    const isDismissed = sessionStorage.getItem('anisshopify_exit_modal_dismissed') === 'true';

    if (hasContacted || isDismissed) return;

    let hasTriggered = false;

    // Desktop Exit Intent: Mouse leaves top of viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15 && !hasTriggered) {
        hasTriggered = true;
        setIsOpen(true);
      }
    };

    // Mobile / Scroll Exit Intent: Mobile scroll up after deep scroll
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && currentScroll / docHeight > 0.45) {
        if (lastScrollY - currentScroll > 150 && !hasTriggered) {
          hasTriggered = true;
          setIsOpen(true);
        }
      }
      lastScrollY = currentScroll;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('anisshopify_exit_modal_dismissed', 'true');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-250 select-none">
      <div className="relative w-full max-w-lg sm:max-w-[612px] bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Top Accent Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Header Hook */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wait! Before You Go</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mb-2 leading-snug">
              Let&apos;s Build Your Dream Shopify Store
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Get a <strong className="text-foreground">Free 15-Minute Shopify Audit &amp; Fixed Quote</strong> for your project. Reach out on WhatsApp or drop a quick line below!
            </p>
          </div>

          {/* Direct WhatsApp CTA Button */}
          <div className="mb-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] group"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat Instantly on WhatsApp</span>
              <span className="text-[10px] font-normal opacity-80 bg-white/20 px-2 py-0.5 rounded-full ml-1">
                Under 20m reply
              </span>
            </a>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-border/80" />
            <span className="flex-shrink mx-3 text-[11px] uppercase font-bold text-muted-foreground/70 tracking-wider">
              Or Send Quick Message
            </span>
            <div className="flex-grow border-t border-border/80" />
          </div>

          {/* Form Content / Success */}
          {isSubmitted ? (
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Message Sent Successfully!</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                Thank you! Ansarul Anis will review your request and reply to your email within 2 hours.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Your Name</label>
                  <Input
                    type="text"
                    placeholder="Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Your Email</label>
                  <Input
                    type="email"
                    placeholder="sarah@brand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Project Details / Question</label>
                <Textarea
                  placeholder="Tell me briefly about your Shopify store idea, redesign, or questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="min-h-[80px] text-xs"
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
                    <span>Get Free Audit &amp; Quote</span>
                    <Send className="w-4 h-4" />
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
