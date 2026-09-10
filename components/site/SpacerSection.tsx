import * as React from 'react';
import { SectionSettings } from '@/lib/sections/types';

interface SpacerSectionProps {
  settings?: SectionSettings;
}

export function SpacerSection({ settings = {} }: SpacerSectionProps) {
  const { spacing_top = 'normal' } = settings;

  const heightMap = {
    none: 'h-0',
    compact: 'h-8 sm:h-12',
    normal: 'h-16 sm:h-24',
    spacious: 'h-24 sm:h-36',
    extra: 'h-36 sm:h-52',
  };

  return (
    <div
      className={`w-full ${heightMap[spacing_top] || 'h-16'} flex items-center justify-center`}
      aria-hidden="true"
    >
      <div className="w-12 h-px bg-border/40" />
    </div>
  );
}
