import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getSiteSettings,
  getSeoMeta,
  getProjects,
  getServices,
  getTestimonials,
  getFaqs,
  getPageSections,
} from '@/lib/data/queries';
import { PageSectionRenderer } from '@/lib/sections/renderer';
import { Eye, ArrowLeft, ExternalLink } from 'lucide-react';

// Incremental Static Regeneration (ISR) with 3600 second safety net
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta('home');
  const settings = await getSiteSettings();

  const siteTitle = seo?.meta_title || `${settings.site_name} | Shopify Website Design & Store Development`;
  const siteDescription =
    seo?.meta_description ||
    'Freelance Shopify developer specializing in high-converting Shopify store design, custom Liquid development, landing pages, and speed optimization.';
  const ogImage =
    seo?.og_image_url ||
    '/images/ansarul-anis.jpg';

  return {
    title: siteTitle,
    description: siteDescription,
    keywords: [
      'shopify website design',
      'shopify store design',
      'shopify website development',
      'build shopify store',
      'create shopify store',
      'shopify store',
      'shopify website',
      'shopify',
      'shopify plus developer',
      'freelance shopify developer',
      'shopify landing page developer',
    ],
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: settings.site_name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${settings.site_name} Shopify Website Design & Store Development`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  };
}

interface HomePageProps {
  searchParams?: Promise<{ preview?: string }> | { preview?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const isDraftPreview = resolvedSearchParams?.preview === 'draft';

  const [settings, projects, services, testimonials, faqs, sections] = await Promise.all([
    getSiteSettings(),
    getProjects(true),
    getServices(),
    getTestimonials(true),
    getFaqs(),
    getPageSections('home', isDraftPreview),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Schema.org JSON-LD Structured Data
  const developerName = settings.developer_name || 'Ansarul Anis';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: developerName,
        jobTitle: 'Freelance Shopify Developer & CRO Specialist',
        description:
          'Specialist in high-converting Shopify store design, custom Liquid themes, headless commerce, and landing page engineering.',
        url: siteUrl,
        image: settings.about_photo_url || `${siteUrl}/images/ansarul-anis.jpg`,
        sameAs: settings.social_links.map((s) => s.url),
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${siteUrl}/#service`,
        name: `${settings.site_name} | ${developerName} - Shopify Development Services`,
        url: siteUrl,
        priceRange: '$$$',
        description:
          'Bespoke Shopify store design, theme customization, headless storefronts, and conversion rate optimization.',
        areaServed: 'Worldwide',
        provider: {
          '@id': `${siteUrl}/#person`,
        },
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Floating Draft Banner if previewing drafts */}
      {isDraftPreview && (
        <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Draft Preview Mode: Viewing unpublished section draft settings.</span>
          </div>
          <Link
            href="/admin/builder"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950 text-amber-100 hover:bg-amber-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Builder</span>
          </Link>
        </div>
      )}

      {/* Dynamic Front-End Section Engine */}
      <PageSectionRenderer
        sections={sections}
        data={{
          siteSettings: settings,
          projects,
          services,
          testimonials,
          faqs,
        }}
        isDraftPreview={isDraftPreview}
      />
    </>
  );
}
