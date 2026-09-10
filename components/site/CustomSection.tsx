'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Code2, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SectionSettings, ContentBlock } from '@/lib/sections/types';

interface CustomSectionProps {
  settings?: SectionSettings;
}

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Target,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
};

export function CustomSection({ settings = {} }: CustomSectionProps) {
  const {
    eyebrow = 'Why Work With Me?',
    heading = 'Direct Developer Partnership Without the Agency Overhead',
    subheading = 'Work directly with the person who codes your theme, designs your flows, and guarantees your Core Web Vitals.',
    blocks = [],
    columns = 3,
    alignment = 'center',
  } = settings;

  const getColClass = () => {
    if (columns === 1) return 'grid-cols-1 max-w-3xl mx-auto';
    if (columns === 2) return 'grid-cols-1 md:grid-cols-2';
    if (columns === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-1 md:grid-cols-3';
  };

  const renderBlock = (block: ContentBlock, idx: number) => {
    if (block.type === 'card') {
      const IconComponent = block.icon && iconMap[block.icon] ? iconMap[block.icon] : Sparkles;
      return (
        <motion.div
          key={block.id || idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="p-8 rounded-[14px] bg-card border border-border/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <IconComponent className="w-6 h-6" />
            </div>
            {block.title && (
              <h3 className="text-xl font-bold text-foreground mb-3">{block.title}</h3>
            )}
            {block.text && (
              <p className="text-sm text-muted-foreground leading-relaxed">{block.text}</p>
            )}
          </div>
          {block.button_label && (
            <div className="pt-6 mt-4 border-t border-border/50">
              <a
                href={block.button_url || '#contact'}
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
              >
                <span>{block.button_label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </motion.div>
      );
    }

    if (block.type === 'stat') {
      return (
        <motion.div
          key={block.id || idx}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="p-8 rounded-[14px] bg-card border border-border/80 text-center flex flex-col items-center justify-center shadow-xs"
        >
          <div className="text-4xl sm:text-5xl font-black text-primary font-mono tracking-tight mb-2">
            {block.stat_value || '100%'}
          </div>
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {block.stat_label || 'Metric Description'}
          </div>
        </motion.div>
      );
    }

    if (block.type === 'image') {
      return (
        <motion.div
          key={block.id || idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="rounded-[14px] overflow-hidden border border-border/80 bg-muted relative aspect-[16/10] group"
        >
          {block.image_url && (
            <Image
              src={block.image_url}
              alt={block.title || 'Portfolio Image'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {block.title && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-sm font-semibold">
              {block.title}
            </div>
          )}
        </motion.div>
      );
    }

    if (block.type === 'button') {
      return (
        <div key={block.id || idx} className="flex items-center justify-center p-4">
          <a
            href={block.button_url || '#contact'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <span>{block.button_label || 'Take Action'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      );
    }

    // Default 'text' block
    return (
      <div key={block.id || idx} className="space-y-2 p-6 rounded-[14px] bg-card/60 border border-border/60">
        {block.title && <h3 className="text-xl font-bold text-foreground">{block.title}</h3>}
        {block.text && <p className="text-sm text-muted-foreground leading-relaxed">{block.text}</p>}
      </div>
    );
  };

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(eyebrow || heading || subheading) && (
          <div
            className={`flex flex-col mb-16 sm:mb-20 ${
              alignment === 'center' ? 'items-center text-center' : 'items-start text-left'
            }`}
          >
            {eyebrow && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{eyebrow}</span>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4 max-w-3xl">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {subheading}
              </p>
            )}
          </div>
        )}

        {blocks.length > 0 && <div className={`grid gap-6 ${getColClass()}`}>{blocks.map(renderBlock)}</div>}
      </div>
    </section>
  );
}
