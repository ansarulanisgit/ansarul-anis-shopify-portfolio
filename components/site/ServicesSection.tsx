'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Target,
  Code2,
  ArrowRightLeft,
  Building2,
  Cpu,
  Repeat,
  Sparkles,
  Zap,
  LucideIcon,
} from 'lucide-react';
import { Service } from '@/types/database.types';
import { SectionSettings } from '@/lib/sections/types';

interface ServicesSectionProps {
  services?: Service[];
  sectionSettings?: SectionSettings;
}

const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  Target,
  Code2,
  ArrowRightLeft,
  Building2,
  Cpu,
  Repeat,
  Sparkles,
  Zap,
};

export function ServicesSection({ services = [], sectionSettings }: ServicesSectionProps) {
  const eyebrow = sectionSettings?.eyebrow || 'What I Do';
  const heading = sectionSettings?.heading || 'Complete Shopify Development Services';
  const subheading =
    sectionSettings?.subheading ||
    'From Shopify store design to headless ecommerce, every service is engineered to help you build a Shopify store that drives revenue.';

  const displayServices = services.length > 0 ? services : [];

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || ShoppingBag;
    return <IconComponent className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />;
  };

  return (
    <section id="services" className="py-24 sm:py-32 bg-gradient-to-b from-background via-card/50 to-background relative scroll-mt-16 overflow-hidden border-t border-border/40">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
            <Zap className="w-3.5 h-3.5" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* 9 Services Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
              className="relative flex flex-col p-7 sm:p-8 rounded-[14px] bg-card border border-border/80 hover:border-primary/50 shadow-sm hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 group hover:-translate-y-1.5 overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 group-hover:h-1.5 transition-all duration-300" />

              {/* Service Icon - Circular Background */}
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-xs shrink-0">
                {getIcon(service.icon)}
              </div>

              {/* Service Title */}
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mb-2.5 leading-snug group-hover:text-primary transition-colors tracking-tight">
                {service.title}
              </h3>

              {/* Italic Hook One-Liner */}
              <p className="text-xs sm:text-sm font-semibold italic text-primary/90 mb-3.5 leading-relaxed">
                &ldquo;{service.hook}&rdquo;
              </p>

              {/* Short Description */}
              <p className="text-[16px] text-muted-foreground leading-relaxed flex-1">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
