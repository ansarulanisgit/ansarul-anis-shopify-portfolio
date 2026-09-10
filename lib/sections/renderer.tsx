'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PageSection } from '@/types/database.types';
import { getSectionComponent } from './registry';
import { motion, useReducedMotion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

interface PageSectionRendererProps {
  sections: PageSection[];
  data: {
    projects?: any[];
    services?: any[];
    testimonials?: any[];
    faqs?: any[];
    siteSettings?: any;
  };
  isDraftPreview?: boolean;
}

class SectionErrorBoundary extends React.Component<
  { sectionTitle: string; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(`Error rendering section "${this.props.sectionTitle}":`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-4 max-w-4xl mx-auto rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-center">
          <p className="text-sm font-semibold">
            Unable to render section: &ldquo;{this.props.sectionTitle}&rdquo;
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This section experienced a runtime error. Check its configuration in the Front-End Builder.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function PageSectionRenderer({
  sections,
  data,
  isDraftPreview = false,
}: PageSectionRendererProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // Real-time synchronization: Refresh page whenever any table changes in Supabase or local events trigger
  React.useEffect(() => {
    const handleLocalSync = () => {
      router.refresh();
    };

    window.addEventListener('storage', handleLocalSync);
    window.addEventListener('anisshopify_sections_changed', handleLocalSync);
    window.addEventListener('anisshopify_appearance_changed', handleLocalSync);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let channel: any;
    if (url && !url.includes('placeholder')) {
      try {
        const supabase = createClient();
        channel = supabase
          .channel('homepage_realtime_sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public' },
            () => {
              router.refresh();
            }
          )
          .subscribe();
      } catch {}
    }

    return () => {
      window.removeEventListener('storage', handleLocalSync);
      window.removeEventListener('anisshopify_sections_changed', handleLocalSync);
      window.removeEventListener('anisshopify_appearance_changed', handleLocalSync);
      if (channel) {
        try {
          const supabase = createClient();
          supabase.removeChannel(channel);
        } catch {}
      }
    };
  }, [router]);

  // 1. Sort by order_index
  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);

  // 2. Filter out disabled sections unless specifically previewing
  const activeSections = sortedSections.filter((section) => {
    if (!isDraftPreview && section.is_enabled === false) return false;
    if (!isDraftPreview && section.is_visible === false) return false;
    return true;
  });

  return (
    <div className="flex flex-col w-full relative">
      {activeSections.map((section) => {
        const settings =
          isDraftPreview && section.draft_settings
            ? section.draft_settings
            : section.settings || {};

        const Component = getSectionComponent(section.section_type);

        // Responsive visibility classes
        const visibilityClasses = [
          section.mobile_visible === false ? 'hidden sm:block' : '',
          section.tablet_visible === false ? 'sm:hidden lg:block' : '',
          section.desktop_visible === false ? 'lg:hidden' : '',
        ]
          .filter(Boolean)
          .join(' ');

        // Background styling
        const bgMap: Record<string, string> = {
          default: '',
          white: 'bg-white text-gray-900',
          light: 'bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100',
          dark: 'bg-gray-950 text-white',
          accent: 'bg-primary text-primary-foreground',
          muted: 'bg-muted/30',
          'gradient-subtle': 'bg-gradient-to-br from-primary/[0.08] via-accent/[0.05] to-secondary/20 text-foreground',
          'gradient-card': 'bg-gradient-to-br from-primary/[0.10] via-card to-accent/[0.08] text-foreground',
          'gradient-radial': 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.22),hsl(var(--accent)/0.15),transparent_75%)] bg-background text-foreground',
          'gradient-accent': 'bg-gradient-to-br from-primary/[0.12] via-accent/[0.08] to-secondary/30 text-foreground',
          'gradient-vibrant': 'bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground',
          custom: '',
        };
        const bgClasses = bgMap[String(settings.background || 'default')] || '';

        const customStyle: React.CSSProperties = {};
        if (settings.background === 'custom' && settings.custom_bg) {
          customStyle.backgroundColor = settings.custom_bg;
        }
        if (settings.text_color === 'custom' && settings.custom_text_color) {
          customStyle.color = settings.custom_text_color;
        }

        // Animation wrapper configuration
        const animationType = settings.animation || 'none';
        const isAnimated = animationType !== 'none' && !shouldReduceMotion;

        const getAnimationVariants = () => {
          if (!isAnimated) return undefined;
          switch (animationType) {
            case 'fade-up':
              return { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } };
            case 'fade-down':
              return { initial: { opacity: 0, y: -24 }, whileInView: { opacity: 1, y: 0 } };
            case 'fade-left':
              return { initial: { opacity: 0, x: -24 }, whileInView: { opacity: 1, x: 0 } };
            case 'fade-right':
              return { initial: { opacity: 0, x: 24 }, whileInView: { opacity: 1, x: 0 } };
            case 'scale':
              return { initial: { opacity: 0, scale: 0.95 }, whileInView: { opacity: 1, scale: 1 } };
            case 'fade':
            default:
              return { initial: { opacity: 0 }, whileInView: { opacity: 1 } };
          }
        };

        const duration =
          settings.animation_speed === 'slow' ? 0.7 : settings.animation_speed === 'fast' ? 0.25 : 0.45;

        const animVariants = getAnimationVariants();

        return (
          <SectionErrorBoundary key={section.id || section.section_key} sectionTitle={section.title}>
            <div
              id={settings.custom_id || section.section_key}
              className={`w-full relative transition-colors ${visibilityClasses} ${bgClasses} ${
                settings.custom_class || ''
              }`}
              style={customStyle}
            >
              {isAnimated && animVariants ? (
                <motion.div
                  initial={animVariants.initial}
                  whileInView={animVariants.whileInView}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration }}
                >
                  <Component sectionKey={section.section_key} settings={settings} data={data} />
                </motion.div>
              ) : (
                <Component sectionKey={section.section_key} settings={settings} data={data} />
              )}
            </div>
          </SectionErrorBoundary>
        );
      })}
    </div>
  );
}
