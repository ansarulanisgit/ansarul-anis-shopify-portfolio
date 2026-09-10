'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, MessageSquareQuote, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Testimonial } from '@/types/database.types';
import { SectionSettings } from '@/lib/sections/types';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  sectionSettings?: SectionSettings;
}

export function TestimonialsSection({ testimonials = [], sectionSettings }: TestimonialsSectionProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const eyebrow = sectionSettings?.eyebrow || 'Client Results';
  const heading = sectionSettings?.heading || 'Trusted by Ecommerce Brands Worldwide';
  const subheading =
    sectionSettings?.subheading ||
    'See how expert Shopify website design and development transformed conversion rates and revenue for DTC brands.';

  const autoplaySpeed = sectionSettings?.carousel_speed || 6000;
  const autoplayEnabled = sectionSettings?.carousel_autoplay !== false;

  // Group testimonials into pairs of 2 for desktop/tablet
  const slidePairs = React.useMemo(() => {
    if (!testimonials || testimonials.length === 0) return [];
    const pairs: Testimonial[][] = [];
    for (let i = 0; i < testimonials.length; i += 2) {
      pairs.push(testimonials.slice(i, i + 2));
    }
    return pairs;
  }, [testimonials]);

  const totalSlides = slidePairs.length;

  // Auto-play interval
  React.useEffect(() => {
    if (isPaused || totalSlides <= 1 || !autoplayEnabled) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides, autoplaySpeed, autoplayEnabled]);

  if (!testimonials || testimonials.length === 0) return null;

  const currentPair = slidePairs[currentSlideIndex] || slidePairs[0];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section id="testimonials" className="py-24 sm:py-32 relative overflow-hidden border-t border-border/40 scroll-mt-16 bg-gradient-to-b from-background via-card/40 to-background">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Animated 2-Column Grid Slide */}
          <div className="min-h-[360px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
              >
                {currentPair.map((t) => (
                  <div
                    key={t.id}
                    className="group relative flex flex-col justify-between p-7 sm:p-9 rounded-[14px] bg-card border border-border/80 hover:border-primary/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 group-hover:h-1.5 transition-all duration-300" />

                    <div>
                      {/* Top Bar: Stars + Verified Badge on left, Quote icon on right */}
                      <div className="flex items-center justify-between gap-3 mb-5 relative z-10">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Client
                          </span>
                        </div>
                        <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-primary/30 fill-primary/10 group-hover:text-primary/60 group-hover:scale-110 transition-all duration-300 shrink-0" aria-hidden="true" />
                      </div>

                      {/* Testimonial Quote */}
                      <p className="text-sm sm:text-base font-medium text-foreground/90 italic leading-relaxed mb-6 relative z-10">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    {/* Client Info Footer */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border/60 relative z-10 mt-auto">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/40 shrink-0 shadow-xs">
                        <Image
                          src={
                            t.avatar_url ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.client_name)}`
                          }
                          alt={t.client_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-foreground text-sm sm:text-base truncate">{t.client_name}</h4>
                        <p className="text-xs text-primary font-semibold truncate">{t.client_company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls: Prev/Next Buttons + Dots */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-between mt-10 pt-4 border-t border-border/40">
              <button
                onClick={handlePrev}
                aria-label="Previous slide"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-xs sm:text-sm font-bold text-foreground hover:bg-muted hover:border-primary/40 transition-all shadow-xs active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {slidePairs.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentSlideIndex === i
                        ? 'w-8 bg-primary shadow-xs'
                        : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next slide"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-xs sm:text-sm font-bold text-foreground hover:bg-muted hover:border-primary/40 transition-all shadow-xs active:scale-95"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
