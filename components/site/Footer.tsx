'use client';

import * as React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Facebook, Github, Globe, ArrowUp } from 'lucide-react';
import { SocialLink } from '@/types/database.types';
import { SectionSettings } from '@/lib/sections/types';

interface FooterProps {
  siteName?: string;
  developerName?: string;
  socialLinks?: SocialLink[];
  sectionSettings?: SectionSettings;
}

export function Footer({
  siteName = 'AnisShopify',
  developerName = 'Ansarul Anis',
  socialLinks = [],
  sectionSettings,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const displaySiteName = sectionSettings?.heading || siteName;
  const displayDesc =
    sectionSettings?.description ||
    `Crafted with passion by ${developerName} — freelance Shopify store and landing page specialist engineering custom, sub-second, direct-response e-commerce experiences.`;
  const showSocial = sectionSettings?.show_social_icons !== false;

  const navTitle = sectionSettings?.nav_title || sectionSettings?.eyebrow || 'Navigation';
  const connectTitle = sectionSettings?.connect_title || 'Connect';
  const backToTopText = sectionSettings?.back_to_top_text || 'Back to top';
  
  const defaultNavLinks = [
    { label: 'Home', href: '#home' },
    { label: 'My works', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const navLinks = sectionSettings?.nav_links && sectionSettings.nav_links.length > 0
    ? sectionSettings.nav_links
    : defaultNavLinks;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase().trim();
    if (p === 'x' || p.includes('twitter') || p.includes('x.com')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    }
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('facebook') || p.includes('fb')) return <Facebook className="w-4 h-4" />;
    if (p.includes('github')) return <Github className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <footer className="w-full border-t border-border/80 bg-card pt-12 sm:pt-16 pb-6 text-card-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="#home" className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <div className="h-8 w-8 rounded-[12px] bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shadow-xs">
                A
              </div>
              <span>{displaySiteName}</span>
            </Link>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
              {displayDesc}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[18px] font-bold uppercase tracking-wider text-foreground">{navTitle}</h4>
            <ul className="space-y-2 text-base text-muted-foreground font-medium">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Social */}
          <div className="space-y-3">
            <h4 className="text-[18px] font-bold uppercase tracking-wider text-foreground">{connectTitle}</h4>
            {showSocial && (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((item, idx) => (
                  <a
                    key={item.platform + idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.platform}
                    className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    {getSocialIcon(item.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 pb-2 border-t border-border/60 flex items-center justify-center text-center text-base text-muted-foreground font-medium">
          <div>
            {sectionSettings?.copyright_text ? (
              sectionSettings.copyright_text
            ) : (
              <>&copy; {currentYear} {displaySiteName}. All rights reserved.</>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
