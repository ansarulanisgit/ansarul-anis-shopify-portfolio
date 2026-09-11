'use client';

import * as React from 'react';
import Image from 'next/image';
import { Quote, Star, MessageSquareQuote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '@/types/database.types';
import { SectionSettings } from '@/lib/sections/types';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  sectionSettings?: SectionSettings;
}

export function TestimonialsSection({ testimonials = [], sectionSettings }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [dragStartX, setDragStartX] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const eyebrow = sectionSettings?.eyebrow || 'Client Results';
  const heading = sectionSettings?.heading || 'Trusted by Ecommerce Brands Worldwide';
  const subheading =
    sectionSettings?.subheading ||
    'See how expert Shopify website design and development transformed conversion rates and revenue for DTC brands.';

  const autoplaySpeed = sectionSettings?.carousel_speed || 6000;
  const autoplayEnabled = sectionSettings?.carousel_autoplay !== false;
  const pauseOnHover = sectionSettings?.pause_on_hover !== false;

  const totalItems = testimonials.length;

  // Responsive: 1 card on mobile (<768px), 2 on md+
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const visibleCards = isMobile ? 1 : 2;
  const maxIndex = Math.max(0, totalItems - visibleCards);
  const totalDots = maxIndex + 1;
  const slidePercent = isMobile ? 100 : 50;
  const hasMultipleSlides = totalItems > visibleCards;

  // Auto-play interval
  React.useEffect(() => {
    if (isPaused || !hasMultipleSlides || !autoplayEnabled) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [isPaused, hasMultipleSlides, maxIndex, autoplaySpeed, autoplayEnabled]);

  if (!testimonials || testimonials.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleDragStart = (clientX: number) => {
    setDragStartX(clientX);
    setIsDragging(true);
  };

  const handleDragEnd = (clientX: number) => {
    if (dragStartX === null) return;
    const diff = dragStartX - clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setDragStartX(null);
    setIsDragging(false);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    handleDragEnd(e.clientX);
  };

  const onMouseLeave = (e: React.MouseEvent) => {
    if (isDragging) handleDragEnd(e.clientX);
    if (pauseOnHover) setIsPaused(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
    if (pauseOnHover) setIsPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    handleDragEnd(e.changedTouches[0].clientX);
    if (pauseOnHover) setIsPaused(false);
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
          className="relative max-w-6xl mx-auto select-none px-0 sm:px-14"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseEnter={() => { if (pauseOnHover) setIsPaused(true); }}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Sliding Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * slidePercent}%)` }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="w-full md:w-1/2 flex-shrink-0 px-2 sm:px-4"
                >
                  <div className="group relative flex flex-col justify-between p-5 sm:p-8 rounded-[14px] bg-card border border-border/80 hover:border-primary/50 shadow-md hover:shadow-xl transition-[border,shadow] duration-300 overflow-hidden h-full">
                    {/* Top accent line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 group-hover:h-1.5 transition-all duration-300" />

                    <div>
                      {/* Top Bar: Stars + Verified Badge on left, Quote icon on right */}
                      <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex gap-0.5 sm:gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] sm:text-[11px] font-bold border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Client
                          </span>
                        </div>
                        <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/30 fill-primary/10 group-hover:text-primary/60 group-hover:scale-110 transition-all duration-300 shrink-0" aria-hidden="true" />
                      </div>

                      {/* Testimonial Quote */}
                      <p className="text-sm sm:text-base font-medium text-foreground/90 italic leading-relaxed mb-4 relative z-10">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    {/* Client Info Footer */}
                    <div className="flex items-center gap-3 sm:gap-4 pt-3.5 border-t border-border/60 relative z-10 mt-auto">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-primary/40 shrink-0 shadow-xs">
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
                </div>
              ))}
            </div>
          </div>

          {/* Center Side Arrow Buttons - Hidden on Mobile */}
          {hasMultipleSlides && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous slide"
                className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-110 transition-all active:scale-95 items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next slide"
                className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-110 transition-all active:scale-95 items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots */}
          {hasMultipleSlides && (
            <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
              {Array.from({ length: totalDots }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === i
                      ? 'w-6 sm:w-8 bg-primary shadow-xs'
                      : 'w-2 sm:w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
