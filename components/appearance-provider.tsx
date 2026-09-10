'use client';

import * as React from 'react';
import { AppearanceSettings } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';

interface AppearanceContextType {
  appearance: AppearanceSettings;
  updateAppearance: (newSettings: Partial<AppearanceSettings>) => void;
}

const defaultAppearance: AppearanceSettings = {
  theme_preset: 'crimson',
  font_preset: 'jakarta',
  font_size: 'md',
  style_preset: 'rounded',
  custom_accent: '#FF2A51',
};

const AppearanceContext = React.createContext<AppearanceContextType>({
  appearance: defaultAppearance,
  updateAppearance: () => {},
});

export function useAppearance() {
  return React.useContext(AppearanceContext);
}

export function AppearanceProvider({
  initialAppearance,
  children,
}: {
  initialAppearance?: AppearanceSettings;
  children: React.ReactNode;
}) {
  const [appearance, setAppearance] = React.useState<AppearanceSettings>(
    initialAppearance || defaultAppearance
  );

  const applyAppearanceToDOM = (settings: AppearanceSettings) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.setAttribute('data-theme', settings.theme_preset || 'crimson');
    root.setAttribute('data-font', settings.font_preset || 'jakarta');
    root.setAttribute('data-font-size', settings.font_size || 'md');
    root.setAttribute('data-style', settings.style_preset || 'rounded');

    const btnRadius =
      (settings as any).button_radius === 'pill' || settings.style_preset === 'pill'
        ? '9999px'
        : settings.style_preset === 'sharp'
        ? '10px'
        : (settings as any).button_radius || '12px';
    const cardRadius =
      settings.style_preset === 'sharp'
        ? '12px'
        : (settings as any).card_radius || '14px';

    root.style.setProperty('--radius', '14px');
    root.style.setProperty('--radius-button', btnRadius);
    root.style.setProperty('--radius-card', cardRadius);

    if (settings.custom_accent) {
      root.style.setProperty('--custom-accent', settings.custom_accent);
    } else {
      root.style.removeProperty('--custom-accent');
    }
  };

  React.useEffect(() => {
    applyAppearanceToDOM(appearance);
  }, [appearance]);

  React.useEffect(() => {
    if (initialAppearance) {
      setAppearance(initialAppearance);
      applyAppearanceToDOM(initialAppearance);
    }
  }, [initialAppearance]);

  React.useEffect(() => {
    const handleSync = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('anisshopify_design_system');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setAppearance((prev) => ({ ...prev, ...parsed }));
            applyAppearanceToDOM(parsed);
          } catch {}
        }
      }
    };

    // Immediate sync on mount
    handleSync();

    window.addEventListener('storage', handleSync);
    window.addEventListener('anisshopify_appearance_changed', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('anisshopify_appearance_changed', handleSync);
    };
  }, []);

  // Supabase Realtime Subscription for site_settings
  React.useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('placeholder')) return;

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('site_settings_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'site_settings' },
          (payload: any) => {
            if (
              payload.new &&
              payload.new.key === 'appearance' &&
              typeof payload.new.value === 'object'
            ) {
              setAppearance((prev) => {
                const merged = { ...prev, ...payload.new.value };
                applyAppearanceToDOM(merged);
                return merged;
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {}
  }, []);

  const updateAppearance = (newSettings: Partial<AppearanceSettings>) => {
    setAppearance((prev) => {
      const merged = { ...prev, ...newSettings };
      applyAppearanceToDOM(merged);
      if (typeof window !== 'undefined') {
        localStorage.setItem('anisshopify_design_system', JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('anisshopify_appearance_changed'));
      }
      return merged;
    });
  };

  return (
    <AppearanceContext.Provider value={{ appearance, updateAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}
