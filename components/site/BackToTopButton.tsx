'use client';

import * as React from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
    >
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-0.5 transition-transform duration-200" />
      <span className="hidden md:group-hover:inline-block absolute right-16 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold whitespace-nowrap shadow-lg transition-opacity duration-200">
        Back to top
      </span>
    </button>
  );
}
