'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';
import { TrustStat } from '@/types/database.types';
import { SectionSettings } from '@/lib/sections/types';

interface TrustBarProps {
  stats?: TrustStat[];
  sectionSettings?: SectionSettings;
}

interface ParsedStat {
  prefix: string;
  number: number | null;
  decimals: number;
  suffix: string;
}

function parseStatValue(raw: string): ParsedStat {
  const trimmed = raw.trim();
  // Match: optional non-digit prefix, then digits (with optional decimal), then optional suffix
  const match = trimmed.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: '', number: null, decimals: 0, suffix: trimmed };
  }
  const prefix = match[1] || '';
  const numStr = match[2].replace(/,/g, '');
  const suffix = match[3] || '';
  const num = parseFloat(numStr);
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

  return {
    prefix,
    number: isNaN(num) ? null : num,
    decimals,
    suffix,
  };
}

function StatItem({ item, shouldStart, delay }: { item: TrustStat; shouldStart: boolean; delay: number }) {
  const shouldReduceMotion = useReducedMotion();
  const parsed = React.useMemo(() => parseStatValue(item.value), [item.value]);

  const zeroStr = parsed.number !== null ? (0).toFixed(parsed.decimals) : item.value;
  const [displayValue, setDisplayValue] = React.useState(zeroStr);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    if (!shouldStart || hasAnimated) return;
    if (parsed.number === null) return;

    if (shouldReduceMotion) {
      setDisplayValue(parsed.number.toFixed(parsed.decimals));
      setHasAnimated(true);
      return;
    }

    const timer = setTimeout(() => {
      setHasAnimated(true);
      const target = parsed.number!;
      const duration = 2000;
      let startTime: number | null = null;
      let rafId: number;

      const tick = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Quartic ease-out
        const ease = 1 - Math.pow(1 - progress, 4);
        setDisplayValue((ease * target).toFixed(parsed.decimals));

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setDisplayValue(target.toFixed(parsed.decimals));
        }
      };
      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }, delay);

    return () => clearTimeout(timer);
  }, [shouldStart, hasAnimated, parsed, delay, shouldReduceMotion]);

  if (parsed.number === null) {
    return (
      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">
        <span className="tabular-nums">{item.value}</span>
      </div>
    );
  }

  return (
    <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">
      <span className="tabular-nums inline-block" suppressHydrationWarning>
        {parsed.prefix && <span className="text-primary font-bold mr-0.5">{parsed.prefix}</span>}
        <span className="text-foreground tracking-tight font-black">{displayValue}</span>
        {parsed.suffix && <span className="text-primary font-black ml-0.5">{parsed.suffix}</span>}
      </span>
    </div>
  );
}

export function TrustBar({ stats, sectionSettings }: TrustBarProps) {
  const defaultStats: TrustStat[] = [
    { value: '4+', label: 'Years Freelancing' },
    { value: '270+', label: 'Shopify Stores Built' },
    { value: '99.8%', label: 'Client Satisfaction' },
    { value: '3.4x', label: 'Avg. Conversion Lift' },
  ];

  // Priority: sectionSettings blocks → props.stats → hardcoded defaults
  const blockStats: TrustStat[] | undefined = sectionSettings?.blocks
    ?.filter((b) => b.type === 'stat' && b.stat_value && b.stat_label)
    .map((b) => ({ value: b.stat_value!, label: b.stat_label! }));

  const displayStats =
    blockStats && blockStats.length > 0
      ? blockStats
      : stats && stats.length > 0
      ? stats
      : defaultStats;

  // Use IntersectionObserver on the wrapper — reliable regardless of parent animations
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = React.useState(false);

  React.useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full relative py-10 sm:py-12 bg-card/40 backdrop-blur-xs border-y border-border/60 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-border/50 text-center">
          {displayStats.slice(0, 4).map((item, idx) => (
            <div
              key={item.label + idx}
              className="flex flex-col items-center justify-center p-4 sm:p-6 hover:scale-[1.03] transition-transform cursor-default"
            >
              <StatItem
                item={item}
                shouldStart={hasEntered}
                delay={idx * 200}
              />
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
