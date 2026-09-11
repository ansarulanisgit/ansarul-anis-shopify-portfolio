'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send, CheckCircle2, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { SiteSettingsMap } from '@/types/database.types';
import { SectionSettings } from '@/lib/sections/types';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(2, 'Please enter a subject'),
  budget_range: z.string().min(1, 'Please select your budget range'),
  project_type: z.string().min(1, 'Please select a project type'),
  message: z.string().min(10, 'Please enter your message (minimum 10 characters)'),
  honeypot: z.string().max(0, 'Spam detected').optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactSectionProps {
  settings?: Partial<SiteSettingsMap>;
  sectionSettings?: SectionSettings;
}

export function ContactSection({ settings = {}, sectionSettings }: ContactSectionProps) {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: '',
      budget_range: '',
      project_type: '',
      honeypot: '',
    },
  });

  const whatsappNumber = sectionSettings?.whatsapp_number || settings.whatsapp_number || '+8801709260934';
  const whatsappMessage = encodeURIComponent(
    sectionSettings?.whatsapp_prefill ||
      settings.whatsapp_message ||
      'Hi! I visited your portfolio and I would like to discuss a Shopify project.'
  );

  const eyebrow = sectionSettings?.eyebrow || 'Start Your Project';
  const heading = sectionSettings?.heading || "Let's Build Something High-Converting";
  const subheading =
    sectionSettings?.subheading ||
    'Fill out the project scope form below or reach out directly on WhatsApp for an immediate reply.';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit form');
      }

      setIsSubmitted(true);
      reset();
    } catch (err: any) {
      setServerError(err.message || 'Something went wrong. Please try again or WhatsApp me.');
    }
  };

  const handleWhatsAppClick = async () => {
    try {
      await fetch('/api/cta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'whatsapp_click', source_section: 'contact_sidebar' }),
      });
    } catch {
      // Non-blocking
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-gradient-to-br from-primary/[0.10] via-accent/[0.07] to-secondary/25 relative scroll-mt-16 overflow-hidden border-t border-border/40">
      {/* Ambient theme-color background glows */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-accent/15 to-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/15 via-primary/15 to-secondary/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
            <Mail className="w-3.5 h-3.5" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Direct WhatsApp & Guarantee Sidebar */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="p-8 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Fastest Response (under 20 minutes)
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Prefer to Chat Directly?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Skip the form and message me directly on WhatsApp to discuss your store ideas, audit your current theme, or ask for a quick quote.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-[12px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition-all active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Commitments & Guarantees */}
            <div className="p-6 rounded-[14px] bg-card border border-border/80 shadow-sm space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                What You Can Expect
              </h4>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-foreground">24-Hour Proposal Turnaround</div>
                  <div className="text-xs text-muted-foreground">Detailed scope, timeline, and fixed-price quote.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-foreground">30-Day Post-Launch Warranty</div>
                  <div className="text-xs text-muted-foreground">Comprehensive bug fixes and code guarantee included.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-foreground">100% Native Shopify 2.0</div>
                  <div className="text-xs text-muted-foreground">Clean, modular architecture without third-party app bloat.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="relative p-8 sm:p-10 rounded-[14px] bg-card border border-border/80 shadow-xl overflow-hidden">
              {/* Top decorative gradient bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Message Received!</h3>
                  <p className="text-muted-foreground max-w-md text-sm sm:text-base leading-relaxed">
                    Thank you for reaching out. I&apos;ve received your message. I will reply you back as soon as possible. Thanks for your patience.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-6 py-2 rounded-[10px] text-sm font-semibold text-primary border border-border hover:bg-muted"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Honeypot anti-spam field */}
                  <div className="hidden" aria-hidden="true">
                    <input type="text" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
                  </div>

                  {serverError && (
                    <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                      {serverError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Your Name *</label>
                      <Input placeholder="Sarah Jenkins" {...register('name')} />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Your Email *</label>
                      <Input type="email" placeholder="sarah@brand.com" {...register('email')} />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Project Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Project Type</label>
                      <Select {...register('project_type')}>
                        <option value="">Select one..</option>
                        <option value="New store">New Custom Shopify Store</option>
                        <option value="Landing page">High-Converting Landing Page</option>
                        <option value="Redesign">Existing Store Redesign / Migration</option>
                        <option value="Speed optimization">Speed & CRO Optimization</option>
                        <option value="Headless">Headless Shopify Architecture</option>
                        <option value="Other">Other / Custom App</option>
                      </Select>
                      {errors.project_type && (
                        <p className="text-xs text-destructive">{errors.project_type.message}</p>
                      )}
                    </div>

                    {/* Budget Range */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Estimated Budget</label>
                      <Select {...register('budget_range')}>
                        <option value="">Select one..</option>
                        <option value="<$500">&lt; $500 (Small tweaks)</option>
                        <option value="$500-$2000">$500 - $2,000 (Landing page)</option>
                        <option value="$2000-$5000">$2,000 - $5,000 (Custom theme build)</option>
                        <option value="$5000+">$5,000+ (Headless / Enterprise Plus)</option>
                      </Select>
                      {errors.budget_range && (
                        <p className="text-xs text-destructive">{errors.budget_range.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Subject *</label>
                    <Input placeholder="Shopify Store Redesign / New Project Inquiry" {...register('subject')} />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Your message *</label>
                    <Textarea
                      placeholder="Tell me about your project, requirements, timeline, or any questions..."
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    data-track-cta="Contact Form Submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-[12px] bg-primary text-primary-foreground font-bold shadow-md transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
