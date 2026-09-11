import * as React from 'react';
import { SectionType, SectionDefinition } from './types';
import { SECTION_DEFINITIONS } from './defaults';

// Section Component imports
import { Navbar } from '@/components/site/Navbar';
import { HeroSection } from '@/components/site/HeroSection';
import { TrustBar } from '@/components/site/TrustBar';
import { WorkSection } from '@/components/site/WorkSection';
import { ServicesSection } from '@/components/site/ServicesSection';
import { TestimonialsSection } from '@/components/site/TestimonialsSection';
import { AboutSection } from '@/components/site/AboutSection';
import { FAQSection } from '@/components/site/FAQSection';
import { ContactSection } from '@/components/site/ContactSection';
import { Footer } from '@/components/site/Footer';
import { ExitIntentModal } from '@/components/site/ExitIntentModal';
import { CtaSection } from '@/components/site/CtaSection';
import { SpacerSection } from '@/components/site/SpacerSection';
import { CustomSection } from '@/components/site/CustomSection';

export interface SectionComponentProps {
  sectionKey: string;
  settings: Record<string, any>;
  data?: {
    projects?: any[];
    services?: any[];
    testimonials?: any[];
    faqs?: any[];
    siteSettings?: any;
  };
}

export interface RegisteredSectionItem {
  definition: SectionDefinition;
  component: React.ComponentType<any>;
}

export const SECTION_REGISTRY: Record<SectionType, RegisteredSectionItem> = {
  navigation: {
    definition: SECTION_DEFINITIONS.navigation,
    component: (props: SectionComponentProps) => (
      <Navbar
        siteName={props.data?.siteSettings?.site_name}
        ctaLabel={props.data?.siteSettings?.nav_cta_label}
        sectionSettings={props.settings}
      />
    ),
  },
  hero: {
    definition: SECTION_DEFINITIONS.hero,
    component: (props: SectionComponentProps) => (
      <HeroSection
        settings={props.data?.siteSettings || {}}
        sectionSettings={props.settings}
      />
    ),
  },
  trust_bar: {
    definition: SECTION_DEFINITIONS.trust_bar,
    component: (props: SectionComponentProps) => (
      <TrustBar
        stats={props.data?.siteSettings?.trust_stats}
        sectionSettings={props.settings}
      />
    ),
  },
  work: {
    definition: SECTION_DEFINITIONS.work,
    component: (props: SectionComponentProps) => (
      <WorkSection
        projects={props.data?.projects || []}
        sectionSettings={props.settings}
      />
    ),
  },
  services: {
    definition: SECTION_DEFINITIONS.services,
    component: (props: SectionComponentProps) => (
      <ServicesSection
        services={props.data?.services || []}
        sectionSettings={props.settings}
      />
    ),
  },
  testimonials: {
    definition: SECTION_DEFINITIONS.testimonials,
    component: (props: SectionComponentProps) => (
      <TestimonialsSection
        testimonials={props.data?.testimonials || []}
        sectionSettings={props.settings}
      />
    ),
  },
  about: {
    definition: SECTION_DEFINITIONS.about,
    component: (props: SectionComponentProps) => (
      <AboutSection
        settings={props.data?.siteSettings || {}}
        sectionSettings={props.settings}
      />
    ),
  },
  faq: {
    definition: SECTION_DEFINITIONS.faq,
    component: (props: SectionComponentProps) => (
      <FAQSection
        faqs={props.data?.faqs || []}
        sectionSettings={props.settings}
      />
    ),
  },
  contact: {
    definition: SECTION_DEFINITIONS.contact,
    component: (props: SectionComponentProps) => (
      <ContactSection
        settings={props.data?.siteSettings || {}}
        sectionSettings={props.settings}
      />
    ),
  },
  footer: {
    definition: SECTION_DEFINITIONS.footer,
    component: (props: SectionComponentProps) => (
      <Footer
        siteName={props.data?.siteSettings?.site_name}
        developerName={props.data?.siteSettings?.developer_name}
        socialLinks={props.data?.siteSettings?.social_links}
        sectionSettings={props.settings}
      />
    ),
  },
  exit_popup: {
    definition: SECTION_DEFINITIONS.exit_popup,
    component: (props: SectionComponentProps) => (
      <ExitIntentModal
        settings={props.settings}
        whatsappNumber={props.data?.siteSettings?.whatsapp_number}
        whatsappMessage={props.data?.siteSettings?.whatsapp_message}
      />
    ),
  },
  cta: {
    definition: SECTION_DEFINITIONS.cta,
    component: (props: SectionComponentProps) => (
      <CtaSection settings={props.settings} />
    ),
  },
  text_image: {
    definition: SECTION_DEFINITIONS.text_image,
    component: (props: SectionComponentProps) => (
      <CustomSection settings={props.settings} />
    ),
  },
  stats: {
    definition: SECTION_DEFINITIONS.stats,
    component: (props: SectionComponentProps) => (
      <CustomSection settings={props.settings} />
    ),
  },
  logo_strip: {
    definition: SECTION_DEFINITIONS.logo_strip,
    component: (props: SectionComponentProps) => (
      <CustomSection settings={props.settings} />
    ),
  },
  gallery: {
    definition: SECTION_DEFINITIONS.gallery,
    component: (props: SectionComponentProps) => (
      <CustomSection settings={props.settings} />
    ),
  },
  video: {
    definition: SECTION_DEFINITIONS.video,
    component: (props: SectionComponentProps) => (
      <CustomSection settings={props.settings} />
    ),
  },
  spacer: {
    definition: SECTION_DEFINITIONS.spacer,
    component: (props: SectionComponentProps) => (
      <SpacerSection settings={props.settings} />
    ),
  },
  custom: {
    definition: SECTION_DEFINITIONS.custom,
    component: (props: SectionComponentProps) => (
      <CustomSection settings={props.settings} />
    ),
  },
};

export function getSectionDefinition(type: string): SectionDefinition {
  if (type in SECTION_REGISTRY) {
    return SECTION_REGISTRY[type as SectionType].definition;
  }
  return {
    ...SECTION_DEFINITIONS.custom,
    title: `Section (${type})`,
  };
}

export function getSectionComponent(type: string): React.ComponentType<any> {
  if (type in SECTION_REGISTRY) {
    return SECTION_REGISTRY[type as SectionType].component;
  }
  // Graceful fallback: render CustomSection rather than crashing
  return SECTION_REGISTRY.custom.component;
}
