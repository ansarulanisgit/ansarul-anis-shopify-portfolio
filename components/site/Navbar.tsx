'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { SectionSettings } from '@/lib/sections/types';

interface NavbarProps {
  siteName?: string;
  ctaLabel?: string;
  sectionSettings?: SectionSettings;
}

const defaultNavLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({ siteName = 'AnisShopify', ctaLabel = "Let's Talk", sectionSettings }: NavbarProps) {
  const displaySiteName = sectionSettings?.heading || siteName;
  const displayCtaLabel = sectionSettings?.primary_cta_label || ctaLabel;
  const displayCtaUrl = sectionSettings?.primary_cta_url || '#contact';
  const showThemeToggle = sectionSettings?.show_theme_toggle !== false;
  const isSticky = sectionSettings?.sticky_nav !== false;
  const navLinks = (sectionSettings?.nav_links && sectionSettings.nav_links.length > 0)
    ? sectionSettings.nav_links
    : defaultNavLinks;

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Scroll detection for transparent to solid transition
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section highlighting
  React.useEffect(() => {
    const sections = ['home', 'work', 'services', 'about', 'faq', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-30% 0px -60% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        isSticky ? 'fixed top-0 left-0 right-0 z-40' : 'relative z-40',
        'transition-all duration-300 w-full',
        isScrolled
          ? 'h-16 sm:h-[72px] glass-nav border-b border-border/60 shadow-sm'
          : 'h-20 sm:h-[80px] bg-transparent border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <Link
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('#home');
          }}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-85"
        >
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-base shadow-sm">
            A
          </div>
          <span className="font-extrabold tracking-tight">
            {displaySiteName}
            <span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Anchor Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                className={cn(
                  'relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-lg hover:text-foreground',
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right CTA + Theme Toggle */}
        <div className="flex items-center gap-3">
          {showThemeToggle && <ThemeToggle />}

          <button
            onClick={() => {
              if (displayCtaUrl.startsWith('#')) {
                scrollTo(displayCtaUrl);
              } else {
                window.location.href = displayCtaUrl;
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <span>{displayCtaLabel}</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-muted/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-b border-border/80 bg-background/95 backdrop-blur-xl px-4 py-6 shadow-xl"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className={cn(
                      'px-4 py-2.5 rounded-lg text-base font-medium transition-colors',
                      isActive
                        ? 'bg-muted text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (displayCtaUrl.startsWith('#')) {
                      scrollTo(displayCtaUrl);
                    } else {
                      window.location.href = displayCtaUrl;
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:opacity-90 transition-opacity"
                >
                  <span>{displayCtaLabel}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
