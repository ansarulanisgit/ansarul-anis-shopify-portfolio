'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { SectionSettings } from '@/lib/sections/types';

interface CtaSectionProps {
  settings?: SectionSettings;
}

export function CtaSection({ settings = {} }: CtaSectionProps) {
  const {
    eyebrow = 'Fast-Track Your Launch',
    heading = 'Have a Store That Needs High-Converting Architecture?',
    subheading = 'Book a free 20-minute store audit or discuss your upcoming theme overhaul directly with me.',
    primary_cta_label = 'Get a Free Scope Estimate',
    primary_cta_url = '#contact',
    secondary_cta_label = 'WhatsApp Quick Chat',
    secondary_cta_url = '#contact',
  } = settings;

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl p-8 sm:p-14 lg:p-16 bg-gradient-to-br from-primary via-primary/95 to-accent text-primary-foreground shadow-2xl overflow-hidden text-center flex flex-col items-center justify-center border border-white/10"
        >
          {/* Subtle decorative glow orbs */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-accent/20 rounded-full blur-2xl pointer-events-none" />

          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{eyebrow}</span>
            </div>
          )}

          {heading && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mb-6 leading-tight">
              {heading}
            </h2>
          )}

          {subheading && (
            <p className="text-base sm:text-lg text-primary-foreground/85 max-w-2xl mb-10 leading-relaxed font-medium">
              {subheading}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {primary_cta_label && (
              <a
                href={primary_cta_url}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[12px] bg-white text-gray-900 hover:bg-white/90 font-bold text-sm shadow-lg transition-all active:scale-[0.98]"
              >
                <span>{primary_cta_label}</span>
                <ArrowRight className="w-4 h-4 text-gray-900" />
              </a>
            )}

            {secondary_cta_label && (
              <a
                href={secondary_cta_url}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[12px] bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-sm border border-white/25 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{secondary_cta_label}</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
