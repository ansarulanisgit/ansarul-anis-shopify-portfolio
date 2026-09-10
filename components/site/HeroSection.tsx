'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles, CheckCircle2, ShoppingBag, Mail } from 'lucide-react';
import { SiteSettingsMap } from '@/types/database.types';
import { SectionSettings } from '@/lib/sections/types';
import { defaultHeroTrustChips } from '@/lib/data/seed-data';

interface HeroSectionProps {
  settings?: Partial<SiteSettingsMap>;
  sectionSettings?: SectionSettings;
}

const defaultRotatingWords = [
  'Drives Growth',
  'Boosts Sales',
  'Elevates Brands',
  'Generates Results',
];

export function HeroSection({ settings = {}, sectionSettings }: HeroSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms: Graphic moves slower/differently than text
  const yGraphic = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const eyebrow = sectionSettings?.eyebrow || settings.hero_eyebrow || 'Shopify Developer & Landing Page Specialist';

  const rotatingWords = React.useMemo(() => {
    if (sectionSettings?.rotating_words && sectionSettings.rotating_words.length > 0) {
      return sectionSettings.rotating_words;
    }
    if (settings.hero_rotating_words && settings.hero_rotating_words.length > 0) {
      return settings.hero_rotating_words;
    }
    return defaultRotatingWords;
  }, [sectionSettings?.rotating_words, settings.hero_rotating_words]);

  const headlinePrefix = React.useMemo(() => {
    if (sectionSettings?.heading_prefix) return sectionSettings.heading_prefix.trim();
    if (settings.hero_headline_prefix) return settings.hero_headline_prefix.trim();
    const raw = sectionSettings?.heading || settings.hero_headline || 'Shopify Website Design That';
    if (raw.includes('That Converts')) {
      return 'Shopify Website Design That';
    }
    if (raw.includes('That')) {
      return raw.split('That')[0].trim() + ' That';
    }
    return raw.trim();
  }, [sectionSettings?.heading_prefix, sectionSettings?.heading, settings.hero_headline_prefix, settings.hero_headline]);

  const subheadline =
    sectionSettings?.subheading ||
    settings.hero_subheadline ||
    "Hey, I’m Ansarul Anis — a Shopify Expert with 5+ years of experience building high-converting ecommerce websites. I specialize in Shopify website design, custom Shopify store development, dropshipping stores, high-performance themes, landing pages, and Shopify store redesigns—creating fast, polished experiences designed to turn traffic into revenue.";

  const primaryCta = sectionSettings?.primary_cta_label || settings.hero_primary_cta_label || 'View My Work';
  const secondaryCta = sectionSettings?.secondary_cta_label || settings.hero_secondary_cta_label || 'Contact Me';
  const secondaryUrl = sectionSettings?.secondary_cta_url || settings.hero_secondary_cta_url || '#contact';

  const trustChips = React.useMemo(() => {
    if (Array.isArray(sectionSettings?.hero_trust_chips)) {
      return sectionSettings.hero_trust_chips;
    }
    if (Array.isArray(settings.hero_trust_chips)) {
      return settings.hero_trust_chips;
    }
    return defaultHeroTrustChips;
  }, [sectionSettings?.hero_trust_chips, settings.hero_trust_chips]);

  // Typewriter state
  const [currentWordIdx, setCurrentWordIdx] = React.useState(0);
  const [currentText, setCurrentText] = React.useState(
    rotatingWords[0] || 'Drives Growth'
  );
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!rotatingWords || rotatingWords.length === 0) return;

    const fullWord = rotatingWords[currentWordIdx % rotatingWords.length];
    const typingSpeed = isDeleting ? 45 : 85;

    // If currently showing the full word and not deleting yet, pause before deleting
    if (!isDeleting && currentText === fullWord) {
      const pauseTimer = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(pauseTimer);
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < fullWord.length) {
          setCurrentText(fullWord.slice(0, currentText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(fullWord.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % rotatingWords.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx, rotatingWords]);
  const whatsappNumber = sectionSettings?.whatsapp_number || settings.whatsapp_number || '+8801709260934';
  const whatsappMessage = encodeURIComponent(
    sectionSettings?.whatsapp_prefill || settings.whatsapp_message || 'Hi! I visited your portfolio and I would like to discuss a Shopify project.'
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  const scrollToWork = () => {
    if (sectionSettings?.primary_cta_url && sectionSettings.primary_cta_url.startsWith('#')) {
      const el = document.getElementById(sectionSettings.primary_cta_url.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsAppClick = async () => {
    try {
      await fetch('/api/cta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'whatsapp_click', source_section: 'hero_cta' }),
      });
    } catch {
      // Non-blocking tracking
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-[126px] sm:pt-[130px] pb-16 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.18),transparent_70%)] bg-gradient-to-b from-primary/[0.05] via-background to-background"
    >
      {/* Ambient theme-color background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-primary/20 via-accent/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-gradient-to-bl from-accent/15 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            style={{ y: shouldReduceMotion ? 0 : yText }}
            className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6"
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{eyebrow}</span>
              </div>
            </motion.div>

            {/* Main Headline H1 with Typewriter Effect */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="text-3xl sm:text-4xl lg:text-[55px] font-extrabold tracking-tight text-foreground leading-[1.14] lg:leading-[64px] mb-6 mx-[20px] lg:mx-0"
            >
              <span>{headlinePrefix} </span>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {currentText || '\u00A0'}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="text-base lg:text-[18px] text-muted-foreground leading-relaxed mb-8 max-w-2xl"
            >
              {subheadline}
            </motion.p>

            {/* CTA Buttons - Same row on mobile & desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto mb-8"
            >
              <button
                onClick={scrollToWork}
                data-track-cta="View My Work (Hero)"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-2.5 h-12 px-4 sm:px-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm md:text-base whitespace-nowrap shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{primaryCta}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>

              <a
                href={secondaryUrl}
                data-track-cta="Contact Me (Hero)"
                onClick={(e) => {
                  if (secondaryUrl.startsWith('#')) {
                    e.preventDefault();
                    const targetId = secondaryUrl.replace('#', '');
                    const el = document.getElementById(targetId);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 h-12 px-4 sm:px-8 rounded-xl border border-border bg-card/80 backdrop-blur-md text-foreground hover:bg-muted/80 font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap transition-all hover:border-primary/40 active:scale-[0.98] shadow-xs"
              >
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>{secondaryCta}</span>
              </a>
            </motion.div>

            {/* Feature trust chips */}
            {trustChips && trustChips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2.5 gap-x-4 text-xs sm:text-sm text-foreground/80 font-medium max-w-2xl"
              >
                {trustChips.map((skill) => (
                  <span key={skill} className="flex items-center gap-1.5 bg-card/60 px-2.5 py-1 rounded-lg border border-border/40 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{skill}</span>
                  </span>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right Hero Graphic / Mockup Column */}
          <motion.div
            style={{ y: shouldReduceMotion ? 0 : yGraphic }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative w-full flex items-center justify-center"
          >
            {/* Top-Right Floating Badge (Inspired by screenshot award badge) */}
            <motion.div
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="absolute -top-3 -right-2 sm:-right-4 z-30 px-3.5 py-2 rounded-2xl bg-card/95 backdrop-blur-md border border-border/80 shadow-xl flex items-center gap-2.5 pointer-events-none"
            >
              <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xs font-black shadow-xs">
                🏆
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-extrabold text-foreground leading-none">
                  {sectionSettings?.badge_top_title || 'Top Rated'}
                </span>
                <span className="text-[9px] text-muted-foreground font-semibold mt-0.5">
                  {sectionSettings?.badge_top_subtitle || 'Shopify Developer'}
                </span>
              </div>
            </motion.div>

            {/* Left Floating Stat Badge */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="absolute top-[calc(33.333%+100px)] -left-3 sm:-left-6 z-30 px-4 py-2.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border/80 shadow-xl flex items-center gap-3 pointer-events-none"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                ⚡
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-black text-foreground leading-none">
                  {sectionSettings?.badge_bottom_title || '270+ Stores'}
                </span>
                <span className="text-[10px] text-emerald-500 font-bold mt-0.5">
                  {sectionSettings?.badge_bottom_subtitle || 'Developed Successfully'}
                </span>
              </div>
            </motion.div>

            {/* Transparent Profile Image (Without container frame) */}
            <div className="relative w-full max-w-[460px] aspect-square group flex items-center justify-center">
              {/* Soft ambient background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-gradient-to-tr from-primary/30 via-red-500/20 to-accent/30 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition duration-700 -z-10" />

              <Image
                src={sectionSettings?.image_url || settings.hero_graphic_url || '/images/ansarul-anis.png'}
                alt={sectionSettings?.image_alt || 'Ansarul Anis - Shopify Expert'}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                priority
                className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />

              {/* Floating Developer Badge Overlay */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.4 }}
                className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-card/95 backdrop-blur-md p-2.5 px-3.5 rounded-2xl border border-border/80 shadow-xl flex items-center gap-2.5 z-20"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-primary shrink-0 shadow-xs">
                  <Image src="/images/ansarul-anis.jpg" alt="Ansarul Anis" fill className="object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Ansarul Anis</div>
                  <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Shopify Expert
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
