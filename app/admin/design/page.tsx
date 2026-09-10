'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Palette,
  Type,
  Maximize2,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  Check,
  Eye,
  Layers,
  ExternalLink,
  Sliders,
  ShieldCheck,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import {
  ThemePreset,
  FontPreset,
  FontSizeScale,
  StylePreset,
  AppearanceSettings,
  SiteSettingsMap,
} from '@/types/database.types';
import { defaultSiteSettings } from '@/lib/data/seed-data';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';
import { useAppearance } from '@/components/appearance-provider';

interface DesignSystemState extends AppearanceSettings {
  max_width: '6xl' | '7xl' | 'full';
  default_spacing: 'compact' | 'normal' | 'spacious';
  card_style: 'bordered' | 'elevated' | 'flat';
  button_radius: '10px' | '12px' | '16px' | '20px' | 'pill';
  card_radius: '12px' | '16px' | '20px' | '24px';
  global_animations: boolean;
  default_animation: 'fade-up' | 'fade' | 'scale' | 'fade-left' | 'fade-right';
  animation_speed: 'fast' | 'normal' | 'slow';
}

const defaultDesignState: DesignSystemState = {
  theme_preset: 'crimson',
  font_preset: 'jakarta',
  font_size: 'md',
  style_preset: 'rounded',
  custom_accent: '#FF2A51',
  max_width: '7xl',
  default_spacing: 'spacious',
  card_style: 'bordered',
  button_radius: '16px',
  card_radius: '20px',
  global_animations: true,
  default_animation: 'fade-up',
  animation_speed: 'normal',
};

const THEME_PRESETS: {
  id: ThemePreset;
  name: string;
  description: string;
  primary: string;
  accent: string;
  bgDark: string;
  cardDark: string;
}[] = [
  {
    id: 'crimson',
    name: 'Crimson Obsidian (Signature)',
    description: 'Electric crimson (#FF2A51) with deep obsidian glass cards.',
    primary: '#FF2A51',
    accent: '#E11D48',
    bgDark: '#0A0A0E',
    cardDark: '#141218',
  },
  {
    id: 'navy',
    name: 'Midnight Azure',
    description: 'Bespoke navy inspired by Ansarul’s signature photo aesthetic.',
    primary: '#1E3A8A',
    accent: '#3B82F6',
    bgDark: '#0B132B',
    cardDark: '#1C2541',
  },
  {
    id: 'emerald',
    name: 'Emerald Growth',
    description: 'Vibrant e-commerce green signaling conversion & high ROI.',
    primary: '#10B981',
    accent: '#059669',
    bgDark: '#061A14',
    cardDark: '#0B2920',
  },
  {
    id: 'indigo',
    name: 'Indigo Matrix',
    description: 'Modern SaaS tech palette with deep violet and sharp indigo.',
    primary: '#6366F1',
    accent: '#4F46E5',
    bgDark: '#0A0B1E',
    cardDark: '#141738',
  },
  {
    id: 'amber',
    name: 'Amber Gold',
    description: 'Warm, high-ticket luxury aesthetic with golden highlights.',
    primary: '#F59E0B',
    accent: '#D97706',
    bgDark: '#140E05',
    cardDark: '#241B0D',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'High-contrast neon pink & cyan for cutting-edge DTC drops.',
    primary: '#EC4899',
    accent: '#06B6D4',
    bgDark: '#0B0014',
    cardDark: '#19022B',
  },
  {
    id: 'rose',
    name: 'Rose Velvet',
    description: 'Soft, sophisticated lifestyle and beauty brand tones.',
    primary: '#F43F5E',
    accent: '#BE123C',
    bgDark: '#140508',
    cardDark: '#260B12',
  },
  {
    id: 'monochrome',
    name: 'Minimal Monochrome',
    description: 'Pure editorial high-fashion black, white, and zinc.',
    primary: '#27272A',
    accent: '#71717A',
    bgDark: '#09090B',
    cardDark: '#18181B',
  },
];

const FONT_PRESETS: {
  id: FontPreset;
  name: string;
  category: string;
  sample: string;
}[] = [
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    category: 'Modern Geometric Grotesque (Recommended)',
    sample: 'Shopify Website Design That Converts',
  },
  {
    id: 'outfit',
    name: 'Outfit',
    category: 'High-Tech Display Sans',
    sample: 'Direct-Response DTC Landing Pages',
  },
  {
    id: 'inter',
    name: 'Inter',
    category: 'Ultra-Legible Clean Sans',
    sample: 'Sub-Second Liquid Theme Engineering',
  },
  {
    id: 'space_grotesk',
    name: 'Space Grotesk',
    category: 'Tech & Headless Specialized',
    sample: 'Next.js + Shopify Storefront API',
  },
  {
    id: 'syne',
    name: 'Syne',
    category: 'Editorial Luxury & High Brand Expression',
    sample: 'Bespoke E-Commerce Architecture',
  },
];

export default function DesignSystemPage() {
  const [design, setDesign] = React.useState<DesignSystemState>(defaultDesignState);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { updateAppearance } = useAppearance();

  // 1. Fetch current appearance settings
  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.appearance) {
            const app = json.data.appearance;
            setDesign((prev) => ({ ...prev, ...app }));
            updateAppearance(app);
            return;
          }
        }
      } catch {}

      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('site_settings').select('key, value');
        if (!error && data && data.length > 0) {
          const appSetting = data.find((d) => d.key === 'appearance');
          if (appSetting && typeof appSetting.value === 'object') {
            setDesign((prev) => ({
              ...prev,
              ...(appSetting.value as any),
            }));
            updateAppearance(appSetting.value as any);
            return;
          }
        }
      } catch {
        // Fallback to local storage
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('anisshopify_design_system');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setDesign(parsed);
              updateAppearance(parsed);
            } catch {
              // Ignore
            }
          }
        }
      }
    }
    loadSettings();
  }, []);

  // 2. Real-time DOM attribute updates
  const updateDesign = (partial: Partial<DesignSystemState>) => {
    const next = { ...design, ...partial };
    setDesign(next);

    // Sync to AppearanceProvider context and broadcast
    updateAppearance(partial);

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (next.theme_preset) root.setAttribute('data-theme', next.theme_preset);
      if (next.font_preset) root.setAttribute('data-font', next.font_preset);
      if (next.font_size) root.setAttribute('data-font-size', next.font_size);
      if (next.style_preset) root.setAttribute('data-style', next.style_preset);

      // Apply button and card radius
      const btnRadius =
        next.button_radius === 'pill' || next.style_preset === 'pill'
          ? '9999px'
          : next.button_radius;
      root.style.setProperty('--radius-button', btnRadius);
      root.style.setProperty('--radius-card', next.card_radius);
      root.style.setProperty('--radius', '14px');

      if (next.custom_accent) {
        root.style.setProperty('--custom-accent', next.custom_accent);
      } else {
        root.style.removeProperty('--custom-accent');
      }
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const persistDesign = async (newDesign: DesignSystemState, notifyMsg?: string) => {
    setIsSaving(true);
    try {
      // 1. Save locally for instant tab sync
      if (typeof window !== 'undefined') {
        localStorage.setItem('anisshopify_design_system', JSON.stringify(newDesign));
        window.dispatchEvent(new CustomEvent('anisshopify_appearance_changed'));
      }

      // 2. Save via persistent server API
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appearance: newDesign }),
      }).catch(() => {});

      // 3. Upsert directly to Supabase
      try {
        const supabase = createClient();
        await (supabase.from('site_settings') as any).upsert(
          {
            key: 'appearance',
            value: newDesign,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );
      } catch (err) {
        console.warn('Supabase sync warning:', err);
      }

      // 4. Trigger on-demand ISR revalidation for the live site
      try {
        await fetch('/api/revalidate?path=/&secret=dev_secret_token_123', {
          method: 'POST',
        });
      } catch {
        // Non-blocking
      }

      showNotification(notifyMsg || 'Design System published! Live site & dashboard updated.');
    } catch (err: any) {
      showNotification('Error saving: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectTheme = (preset: (typeof THEME_PRESETS)[0]) => {
    const next: DesignSystemState = {
      ...design,
      theme_preset: preset.id,
      custom_accent: preset.primary,
    };
    updateDesign(next);
    persistDesign(next, `✓ ${preset.name} applied & live on frontend!`);
  };

  const handleSelectFont = (fontId: FontPreset, fontName: string) => {
    const next: DesignSystemState = {
      ...design,
      font_preset: fontId,
    };
    updateDesign(next);
    persistDesign(next, `✓ Font "${fontName}" published to live website!`);
  };

  const handleSelectScale = (scale: FontSizeScale) => {
    const next: DesignSystemState = {
      ...design,
      font_size: scale,
    };
    updateDesign(next);
    persistDesign(next, `✓ Font scale "${scale.toUpperCase()}" published to live website!`);
  };

  const handleSelectStyle = (style: StylePreset) => {
    const next: DesignSystemState = {
      ...design,
      style_preset: style,
    };
    updateDesign(next);
    persistDesign(next, `✓ UI style "${style}" published to live website!`);
  };

  const handleSave = async () => {
    await persistDesign(design, 'Design System published! Live site & dashboard updated.');
  };

  const handleReset = () => {
    if (confirm('Reset all design tokens, fonts, and colors to default?')) {
      updateDesign(defaultDesignState);
      showNotification('Reset to default AnisShopify theme.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-sm shadow-xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold text-primary tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Global Styling & Tokens
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Design System Studio
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Configure global brand colors, Google typography, 10px–20px rounded design system tokens, and motion transitions across the entire site and admin studio.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <Link
            href="/admin/builder"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Layers className="w-4 h-4 text-primary" />
            <span>Open Builder</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : 'Publish Tokens'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Design Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Color Palette & Themes */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-foreground">Brand Color Themes</h2>
                  <p className="text-xs text-muted-foreground">Select a curated multi-tone palette</p>
                </div>
              </div>

              {/* Quick Light/Dark Toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted border border-border/60">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                    theme === 'light' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Force Light Mode Preview"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                    theme === 'dark' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Force Dark Mode Preview"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_PRESETS.map((p) => {
                const isSelected = design.theme_preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectTheme(p)}
                    className={`p-4 text-left rounded-2xl border transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                        : 'border-border/80 bg-muted/20 hover:border-border hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: p.primary }}
                        />
                        <span className="font-bold text-sm text-foreground">{p.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <div className="h-2 flex-1 rounded-full" style={{ backgroundColor: p.primary }} />
                      <div className="h-2 flex-1 rounded-full" style={{ backgroundColor: p.accent }} />
                      <div className="h-2 w-4 rounded-full" style={{ backgroundColor: p.bgDark }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Accent Override */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-foreground">Custom Primary Accent Color</label>
                <p className="text-[11px] text-muted-foreground">Override theme accent with your client&apos;s brand hex code</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={design.custom_accent || '#FF2A51'}
                  onChange={(e) => updateDesign({ custom_accent: e.target.value })}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-border bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={design.custom_accent || ''}
                  onChange={(e) => updateDesign({ custom_accent: e.target.value })}
                  placeholder="#FF2A51"
                  className="w-28 px-3 py-1.5 rounded-xl border border-border bg-muted/40 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {design.custom_accent && (
                  <button
                    type="button"
                    onClick={() => updateDesign({ custom_accent: undefined })}
                    className="text-[11px] text-muted-foreground hover:text-destructive underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Typography System */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-foreground">Google Typography System</h2>
                <p className="text-xs text-muted-foreground">Fonts engineered for conversion and high legibility</p>
              </div>
            </div>

            {/* Font Selector Cards */}
            <div className="space-y-3">
              {FONT_PRESETS.map((f) => {
                const isSelected = design.font_preset === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelectFont(f.id, f.name)}
                    className={`w-full p-4 text-left rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                        : 'border-border/80 bg-muted/20 hover:border-border hover:bg-muted/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{f.name}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 italic">&ldquo;{f.sample}&rdquo;</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Font Scale Selector */}
            <div className="pt-4 border-t border-border space-y-2">
              <label className="text-xs font-bold text-foreground">Base Font Scale</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'sm', label: 'Compact', desc: '15px base (High information density)' },
                  { id: 'md', label: 'Balanced', desc: '16px base (Standard web reading)' },
                  { id: 'lg', label: 'Prominent', desc: '17.5px base (Editorial DTC focus)' },
                ].map((s) => {
                  const isSelected = design.font_size === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectScale(s.id as FontSizeScale)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-border/70 bg-muted/30 text-muted-foreground hover:bg-muted/60'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Component Geometry & Rounded Design (10px - 20px) */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-foreground">Corner Radius & Geometry</h2>
                <p className="text-xs text-muted-foreground">Enforces the modern 10px–20px rounded design system across all elements</p>
              </div>
            </div>

            {/* Overall Style Preset */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Design Language Preset</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'rounded', label: 'Modern Smooth', desc: '14px base, 16px button, 20px card' },
                  { id: 'pill', label: 'Pill CTA Style', desc: 'Pill buttons, 20px cards' },
                  { id: 'sharp', label: 'Subtle Rounded', desc: '10px base, 12px button, 16px card' },
                ].map((st) => {
                  const isSelected = design.style_preset === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSelectStyle(st.id as StylePreset)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-border/70 bg-muted/30 text-muted-foreground hover:bg-muted/60'
                      }`}
                    >
                      <div className="text-xs font-bold">{st.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{st.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Button Radius */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground">Button Border Radius</label>
                <span className="text-xs font-mono font-bold text-primary">{design.button_radius}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {(['10px', '12px', '16px', '20px', 'pill'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => updateDesign({ button_radius: r })}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      design.button_radius === r
                        ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                        : 'border-border/70 bg-muted/30 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Card Radius */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground">Card & Container Radius</label>
                <span className="text-xs font-mono font-bold text-primary">{design.card_radius}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['12px', '16px', '20px', '24px'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => updateDesign({ card_radius: r })}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      design.card_radius === r
                        ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                        : 'border-border/70 bg-muted/30 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Spacing & Motion */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-foreground">Spacing & Animation Engine</h2>
                <p className="text-xs text-muted-foreground">Default rhythm and Framer Motion transitions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Default Section Vertical Rhythm</label>
                <select
                  value={design.default_spacing}
                  onChange={(e) => updateDesign({ default_spacing: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="compact">Compact (py-12 / 48px)</option>
                  <option value="normal">Standard (py-20 / 80px)</option>
                  <option value="spacious">Spacious DTC (py-28 / 112px)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Content Container Max Width</label>
                <select
                  value={design.max_width}
                  onChange={(e) => updateDesign({ max_width: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="6xl">6xl (1152px - Focused)</option>
                  <option value="7xl">7xl (1280px - High-Impact)</option>
                  <option value="full">Full Width (Edge-to-Edge)</option>
                </select>
              </div>
            </div>

            {/* Animation Controls */}
            <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Default Entrance Animation</label>
                <select
                  value={design.default_animation}
                  onChange={(e) => updateDesign({ default_animation: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="fade-up">Fade Up (Smooth Reveal)</option>
                  <option value="fade-down">Fade Down</option>
                  <option value="scale">Subtle Scale Pop</option>
                  <option value="fade-left">Slide from Left</option>
                  <option value="fade-right">Slide from Right</option>
                  <option value="fade">Pure Opacity Fade</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Animation Speed</label>
                <select
                  value={design.animation_speed}
                  onChange={(e) => updateDesign({ animation_speed: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="fast">Fast (0.25s)</option>
                  <option value="normal">Smooth (0.45s)</option>
                  <option value="slow">Dramatic (0.70s)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Design Token Preview Canvas (5 Cols Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-sm text-foreground">Live Interactive Canvas</h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-lg bg-muted text-muted-foreground font-semibold">
                Real-Time
              </span>
            </div>

            {/* Typography Hierarchy Sample */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Typography Sample
              </span>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                  High-Converting Shopify Stores That Scale
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Crafting bespoke Liquid themes, sub-second headless architectures, and direct-response product funnels for ambitious brands.
                </p>
              </div>
            </div>

            {/* Interactive Button Preview */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Button Styles ({design.button_radius})
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  style={{
                    borderRadius: design.button_radius === 'pill' ? '9999px' : design.button_radius,
                  }}
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
                >
                  Primary Action
                </button>
                <button
                  type="button"
                  style={{
                    borderRadius: design.button_radius === 'pill' ? '9999px' : design.button_radius,
                  }}
                  className="px-5 py-2.5 bg-secondary text-secondary-foreground font-bold text-xs hover:bg-secondary/80 transition-colors"
                >
                  Secondary
                </button>
                <button
                  type="button"
                  style={{
                    borderRadius: design.button_radius === 'pill' ? '9999px' : design.button_radius,
                  }}
                  className="px-5 py-2.5 border border-border bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors"
                >
                  Outline
                </button>
              </div>
            </div>

            {/* Sample Card Component */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Card Component ({design.card_radius})
              </span>
              <div
                style={{ borderRadius: design.card_radius }}
                className="p-5 border border-border bg-muted/20 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-foreground">Speed Optimization</h4>
                      <p className="text-[10px] text-muted-foreground">Mobile Lighthouse: 98/100</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    +171% CVR
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Engineered custom Liquid snippets to replace 12 redundant third-party apps, slashing mobile load time from 8.2s to 1.1s.
                </p>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-primary">Read Case Study →</span>
                  <span className="text-[10px] text-muted-foreground font-mono">3-Week Sprint</span>
                </div>
              </div>
            </div>

            {/* Form Input Sample */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Input Form Element
              </span>
              <input
                type="text"
                readOnly
                value="Ansarul Anis - Shopify Developer"
                style={{
                  borderRadius: design.button_radius === 'pill' ? '14px' : design.button_radius,
                }}
                className="w-full px-3.5 py-2 border border-border bg-muted/30 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-foreground">Synchronized Design System</p>
              <p className="text-muted-foreground leading-relaxed">
                Changes made here propagate to both the public store and the admin studio, keeping typography, border-radius (10px–20px), and themes unified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
