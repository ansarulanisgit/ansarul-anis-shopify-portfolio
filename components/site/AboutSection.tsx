'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, CheckCircle2 } from 'lucide-react';
import { SiteSettingsMap } from '@/types/database.types';
import { SectionSettings } from '@/lib/sections/types';

interface AboutSectionProps {
  settings?: Partial<SiteSettingsMap>;
  sectionSettings?: SectionSettings;
}

export function AboutSection({ settings = {}, sectionSettings }: AboutSectionProps) {
  const developerName = settings.developer_name || 'Ansarul Anis';
  const photoUrl =
    sectionSettings?.image_url ||
    settings.about_photo_url ||
    '/images/ansarul-anis.jpg';

  const eyebrow = sectionSettings?.eyebrow || `Meet ${developerName}`;
  const heading = sectionSettings?.heading || 'Engineering High-Performance Shopify Stores That Sell';

  const paragraphs = sectionSettings?.description
    ? sectionSettings.description.split('\n\n').map((s) => s.trim()).filter(Boolean)
    : settings.about_text || [
        `Hey, I'm ${developerName}! I'm an energetic freelance Shopify store & high-converting landing page developer dedicated to crafting modern, revenue-driving e-commerce experiences for forward-thinking DTC brands.`,
        'Unlike traditional agencies that ship bloated, slow themes, I combine direct-response conversion rate optimization (CRO) principles with clean, modular Liquid, Hydrogen, and Next.js engineering to drive measurable sales growth.',
        'From achieving lightning-fast Core Web Vitals (90+ mobile PageSpeed) to custom theme sections, bundle builders, and frictionless checkout flows, my mission is making your Shopify store convert like crazy.',
      ];

  const availabilityLine = sectionSettings?.availability_line || settings.availability_line || 'Currently booking for this month';
  const tools = (sectionSettings?.tools && sectionSettings.tools.length > 0)
    ? sectionSettings.tools
    : (settings.about_tools && settings.about_tools.length > 0)
      ? settings.about_tools
      : [
          'Shopify 2.0',
          'Liquid',
          'React / Next.js',
          'Tailwind CSS',
          'Storefront API',
          'Figma',
          'Klaviyo',
          'Recharge',
        ];

  const isImageRight = sectionSettings?.image_position === 'right';

  return (
    <section id="about" className="py-24 sm:py-32 bg-gradient-to-br from-primary/[0.10] via-accent/[0.07] to-secondary/25 relative scroll-mt-16 overflow-hidden border-t border-border/40">
      {/* Ambient 3-color background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-accent/15 to-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Store Device Mockup & Floating Badges Column (Hero Section Graphic Style) */}
          <motion.div
            initial={{ opacity: 0, x: isImageRight ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`lg:col-span-5 relative w-full flex items-center justify-center ${isImageRight ? 'lg:order-last' : ''}`}
          >
            {/* Top-Right Floating Badge */}
            <motion.div
              initial={{ y: -15, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
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

            {/* Bottom-Left Floating Stat Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute -bottom-4 -left-2 sm:-left-4 z-30 px-4 py-2.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border/80 shadow-xl flex items-center gap-3 pointer-events-none"
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

            {/* Browser Mockup Container Frame with Shopify Dashboard */}
            <div className="relative w-full max-w-[540px] rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md shadow-2xl shadow-primary/15 overflow-hidden group">
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/80 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-background/80 border border-border/60 text-[11px] text-muted-foreground font-medium max-w-[220px] truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">admin.shopify.com/store/ansarul-anis</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Shopify Dashboard Image Display - 100% full view uncropped */}
              <div className="relative w-full aspect-[764/503] bg-[#F8F9FA] p-1 sm:p-1.5">
                <Image
                  src={sectionSettings?.image_url || '/images/shopify-dashboard.png'}
                  alt={sectionSettings?.image_alt || 'Shopify Store Dashboard & Analytics'}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                  className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: isImageRight ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`lg:col-span-7 flex flex-col items-start text-left ${isImageRight ? 'lg:order-first' : ''}`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
              <User className="w-3.5 h-3.5" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              {heading}
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Core Tech Stack Badges */}
            <div className="w-full pt-6 border-t border-border/60">
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                  Full-Stack Shopify Capabilities &amp; Tech Stack
                </h4>
                <span className="text-[11px] font-semibold text-primary">
                  {tools.length} Specializations
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {tools.map((tool: string) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border/80 hover:border-primary/50 hover:bg-card/90 text-foreground shadow-xs transition-all duration-200 hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
