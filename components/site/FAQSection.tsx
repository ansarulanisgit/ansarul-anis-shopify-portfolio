'use client';

import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import { FAQ } from '@/types/database.types';
import { SectionSettings } from '@/lib/sections/types';
import { Accordion } from '@/components/ui/accordion';

interface FAQSectionProps {
  faqs?: FAQ[];
  sectionSettings?: SectionSettings;
}

export function FAQSection({ faqs = [], sectionSettings }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  const eyebrow = sectionSettings?.eyebrow || 'Common Questions';
  const heading = sectionSettings?.heading || 'Shopify Website Design & Development FAQ';
  const subheading =
    sectionSettings?.subheading ||
    'Everything you need to know about working with a Shopify expert — timelines, pricing, process, and support.';

  return (
    <section id="faq" className="py-24 sm:py-32 relative scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* Accordion */}
        <div className="bg-card p-6 sm:p-10 rounded-[14px] border border-border/80 shadow-sm relative overflow-hidden">
          {/* Gradient accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/80 via-primary to-primary/80 rounded-t-[14px]" />
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
