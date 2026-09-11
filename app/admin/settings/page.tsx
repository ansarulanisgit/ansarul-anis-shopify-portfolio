'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Settings,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  User,
  MessageCircle,
  Award,
  Layers,
  Palette,
  Type,
  Sliders,
  Check,
  Eye,
  RotateCcw,
  Monitor,
  ShoppingBag,
  Shapes,
  X,
  Mail,
  Send,
} from 'lucide-react';
import {
  SiteSettingsMap,
  TrustStat,
  SocialLink,
  ThemePreset,
  FontPreset,
  FontSizeScale,
  StylePreset,
  AppearanceSettings,
} from '@/types/database.types';
import { defaultSiteSettings, defaultHeroTrustChips } from '@/lib/data/seed-data';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { useAppearance } from '@/components/appearance-provider';

type TabKey = 'general' | 'appearance' | 'hero' | 'trust_bar' | 'about' | 'contact';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<TabKey>('general');
  const [settings, setSettings] = React.useState<SiteSettingsMap>(defaultSiteSettings);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);
  const { updateAppearance } = useAppearance();

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setSettings((prev) => ({ ...prev, ...json.data }));
            if (json.data.appearance) {
              updateAppearance(json.data.appearance);
            }
            return;
          }
        }
      } catch {}

      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('site_settings').select('key, value');
        if (!error && data && data.length > 0) {
          const merged = { ...defaultSiteSettings };
          for (const item of data) {
            if (typeof item.value === 'object' && item.value !== null) {
              if (item.key === 'appearance') {
                merged.appearance = { ...merged.appearance, ...(item.value as any) };
              } else {
                Object.assign(merged, item.value);
              }
            }
          }
          setSettings(merged);
        }
      } catch {
        // Fallback
      }
    }
    loadSettings();
  }, []);

  const [newChipText, setNewChipText] = React.useState('');

  const handleAddTrustChip = () => {
    if (!newChipText.trim()) return;
    const current = settings.hero_trust_chips && settings.hero_trust_chips.length > 0
      ? settings.hero_trust_chips
      : defaultHeroTrustChips;
    const trimmed = newChipText.trim();
    if (!current.includes(trimmed)) {
      setSettings((prev) => ({
        ...prev,
        hero_trust_chips: [...current, trimmed],
      }));
    }
    setNewChipText('');
  };

  const handleRemoveTrustChip = (chipToRemove: string) => {
    const current = settings.hero_trust_chips && settings.hero_trust_chips.length > 0
      ? settings.hero_trust_chips
      : defaultHeroTrustChips;
    setSettings((prev) => ({
      ...prev,
      hero_trust_chips: current.filter((c) => c !== chipToRemove),
    }));
  };

  const handleResetTrustChips = () => {
    setSettings((prev) => ({
      ...prev,
      hero_trust_chips: [...defaultHeroTrustChips],
    }));
    showNotification('Restored default 11 trust chips.');
  };

  const handleUpdateAppearance = (partial: Partial<AppearanceSettings>) => {
    const updated: AppearanceSettings = {
      theme_preset: settings.appearance?.theme_preset || 'crimson',
      font_preset: settings.appearance?.font_preset || 'jakarta',
      font_size: settings.appearance?.font_size || 'md',
      style_preset: settings.appearance?.style_preset || 'rounded',
      custom_accent: settings.appearance?.custom_accent,
      ...partial,
    };
    setSettings((prev) => ({ ...prev, appearance: updated }));
    updateAppearance(partial);

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (updated.theme_preset) root.setAttribute('data-theme', updated.theme_preset);
      if (updated.font_preset) root.setAttribute('data-font', updated.font_preset);
      if (updated.font_size) root.setAttribute('data-font-size', updated.font_size);
      if (updated.style_preset) root.setAttribute('data-style', updated.style_preset);
      root.style.setProperty('--radius', '14px');
      root.style.setProperty(
        '--radius-button',
        updated.style_preset === 'pill'
          ? '9999px'
          : updated.style_preset === 'sharp'
          ? '10px'
          : '12px'
      );
      root.style.setProperty(
        '--radius-card',
        updated.style_preset === 'sharp' ? '12px' : '14px'
      );
      if (updated.custom_accent) {
        root.style.setProperty('--custom-accent', updated.custom_accent);
      } else {
        root.style.removeProperty('--custom-accent');
      }
    }
  };

  const handleSelectThemePreset = async (
    presetId: ThemePreset,
    presetPrimaryColor: string,
    presetName: string
  ) => {
    const updated: AppearanceSettings = {
      theme_preset: presetId,
      font_preset: settings.appearance?.font_preset || 'jakarta',
      font_size: settings.appearance?.font_size || 'md',
      style_preset: settings.appearance?.style_preset || 'rounded',
      custom_accent: presetPrimaryColor,
    };
    handleUpdateAppearance(updated);
    await saveTabSettings('appearance', updated);
    showNotification(`✓ ${presetName} applied & live on website!`);
  };

  const handleSelectFontPreset = async (fontId: FontPreset, fontName: string) => {
    const updated: AppearanceSettings = {
      theme_preset: settings.appearance?.theme_preset || 'crimson',
      font_preset: fontId,
      font_size: settings.appearance?.font_size || 'md',
      style_preset: settings.appearance?.style_preset || 'rounded',
      custom_accent: settings.appearance?.custom_accent,
    };
    handleUpdateAppearance(updated);
    await saveTabSettings('appearance', updated);
    showNotification(`✓ Font "${fontName}" applied & live on website!`);
  };

  const handleSelectStylePreset = async (styleId: StylePreset, styleLabel: string) => {
    const updated: AppearanceSettings = {
      theme_preset: settings.appearance?.theme_preset || 'crimson',
      font_preset: settings.appearance?.font_preset || 'jakarta',
      font_size: settings.appearance?.font_size || 'md',
      style_preset: styleId,
      custom_accent: settings.appearance?.custom_accent,
    };
    handleUpdateAppearance(updated);
    await saveTabSettings('appearance', updated);
    showNotification(`✓ Style "${styleLabel}" applied & live on website!`);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const saveTabSettings = async (tabKey: TabKey, payload: any) => {
    setIsSaving(true);
    try {
      // 1. Save via persistent local API
      const apiBody =
        tabKey === 'appearance'
          ? { appearance: payload }
          : typeof payload === 'object' && payload !== null && !Array.isArray(payload)
          ? payload
          : { [tabKey]: payload };

      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody),
      });

      // If updating appearance, write to localStorage & dispatch tab sync event
      if (tabKey === 'appearance' && typeof window !== 'undefined') {
        localStorage.setItem('anisshopify_design_system', JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent('anisshopify_appearance_changed'));
      }

      // 2. Also sync to Supabase if configured
      try {
        const supabase = createClient();
        await (supabase.from('site_settings') as any).upsert(
          { key: tabKey, value: payload, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      } catch {
        // Fallback
      }

      // Trigger ISR Revalidation
      try {
        await fetch('/api/revalidate?path=/&secret=dev_secret_token_123', {
          method: 'POST',
        });
      } catch {
        // Non-blocking
      }

      showNotification(
        `${tabKey.replace('_', ' ').toUpperCase()} settings saved and live site revalidated!`
      );
    } catch (err: any) {
      alert(err.message || 'Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for Trust Stats array
  const handleAddTrustStat = () => {
    if (settings.trust_stats.length >= 4) {
      alert('Maximum of 4 trust stats recommended for layout stability.');
      return;
    }
    setSettings({
      ...settings,
      trust_stats: [...settings.trust_stats, { value: '99%', label: 'Metric Label' }],
    });
  };

  const handleUpdateTrustStat = (index: number, field: 'value' | 'label', val: string) => {
    const updated = [...settings.trust_stats];
    updated[index][field] = val;
    setSettings({ ...settings, trust_stats: updated });
  };

  const handleRemoveTrustStat = (index: number) => {
    setSettings({
      ...settings,
      trust_stats: settings.trust_stats.filter((_, i) => i !== index),
    });
  };

  // Handlers for Social Links array
  const handleAddSocialLink = () => {
    setSettings({
      ...settings,
      social_links: [...settings.social_links, { platform: 'LinkedIn', url: 'https://' }],
    });
  };

  const handleUpdateSocialLink = (index: number, field: 'platform' | 'url', val: string) => {
    const updated = [...settings.social_links];
    updated[index][field] = val;
    setSettings({ ...settings, social_links: updated });
  };

  const handleRemoveSocialLink = (index: number) => {
    setSettings({
      ...settings,
      social_links: settings.social_links.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Site Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Customize your brand identity, hero section copy, availability, and contact integration.
        </p>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-border/80 gap-2 overflow-x-auto pb-px">
        {[
          { key: 'general', label: 'General & Identity', icon: Layers },
          { key: 'appearance', label: 'Theme & Typography', icon: Palette },
          { key: 'hero', label: 'Hero Section', icon: Sparkles },
          { key: 'trust_bar', label: 'Trust Bar (Stats)', icon: Award },
          { key: 'about', label: 'About & Bio', icon: User },
          { key: 'contact', label: 'WhatsApp & Contact', icon: MessageCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary dark:text-sky-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: General */}
      {activeTab === 'general' && (
        <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-foreground">General Site Identity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Site / Brand Name *</label>
              <Input
                value={settings.site_name}
                maxLength={40}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                placeholder="AnisShopify"
              />
              <p className="text-[11px] text-muted-foreground">Brand displayed in navbar, footer, and page titles.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Developer Full Name *</label>
              <Input
                value={settings.developer_name || ''}
                maxLength={40}
                onChange={(e) => setSettings({ ...settings, developer_name: e.target.value })}
                placeholder="Ansarul Anis"
              />
              <p className="text-[11px] text-muted-foreground">Used for SEO Schema, About section &amp; bio.</p>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-semibold text-foreground">Nav CTA Button Label</label>
              <Input
                value={settings.nav_cta_label}
                onChange={(e) => setSettings({ ...settings, nav_cta_label: e.target.value })}
                placeholder="Let's Talk"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Footer Social Links</label>
              <button
                type="button"
                onClick={handleAddSocialLink}
                className="inline-flex items-center gap-1 text-xs text-primary dark:text-sky-400 font-semibold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>

            <div className="space-y-2">
              {settings.social_links.map((link, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <Input
                    value={link.platform}
                    onChange={(e) => handleUpdateSocialLink(idx, 'platform', e.target.value)}
                    placeholder="Platform (e.g. LinkedIn)"
                    className="w-36 text-xs"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => handleUpdateSocialLink(idx, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSocialLink(idx)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={() =>
                saveTabSettings('general', {
                  site_name: settings.site_name,
                  developer_name: settings.developer_name,
                  nav_cta_label: settings.nav_cta_label,
                  social_links: settings.social_links,
                })
              }
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground text-xs font-semibold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save General Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Theme & Appearance */}
      {activeTab === 'appearance' && (
        <div className="space-y-8">
          {/* Theme Presets */}
          <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary dark:text-sky-400" />
                <h2 className="text-base font-bold text-foreground">Color Theme Presets</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Select a cohesive color palette for your entire portfolio storefront. Includes light &amp; dark mode tunings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'crimson' as ThemePreset,
                  name: 'Crimson Obsidian',
                  badge: 'Photo & Reference Inspired',
                  description: 'Dark obsidian background with fiery scarlet crimson CTA glow. Direct translation of the reference aesthetic.',
                  colors: ['#0A0A0E', '#16141C', '#FF2A51', '#E11D48'],
                },
                {
                  id: 'navy' as ThemePreset,
                  name: 'Midnight Azure',
                  badge: 'Signature Polo',
                  description: 'Deep midnight navy paired with vibrant sky blue accents. Directly inspired by your photo polo & sky.',
                  colors: ['#0B132B', '#1B2A4A', '#0284C7', '#38BDF8'],
                },
                {
                  id: 'emerald' as ThemePreset,
                  name: 'High-Converting Emerald',
                  badge: 'High CRO',
                  description: 'Forest deep green paired with vibrant mint conversion accents. The trusted e-commerce standard.',
                  colors: ['#064E3B', '#047857', '#10B981', '#6EE7B7'],
                },
                {
                  id: 'indigo' as ThemePreset,
                  name: 'Royal DTC Indigo',
                  badge: 'Tech & Luxury',
                  description: 'Deep midnight indigo paired with sharp digital violet. Modern tech DTC brand aesthetic.',
                  colors: ['#1E1B4B', '#312E81', '#6366F1', '#A5B4FC'],
                },
                {
                  id: 'amber' as ThemePreset,
                  name: 'Sunset Amber',
                  badge: 'High Energy',
                  description: 'Warm obsidian bronze paired with vibrant golden amber. High-urgency direct-response vibe.',
                  colors: ['#451A03', '#78350F', '#F59E0B', '#FDE68A'],
                },
                {
                  id: 'cyberpunk' as ThemePreset,
                  name: 'Cyberpunk Neon',
                  badge: 'Futuristic Glow',
                  description: 'Deep midnight violet with electric cyan and neon magenta. Bold creative storefronts.',
                  colors: ['#090514', '#150E28', '#06B6D4', '#A855F7'],
                },
                {
                  id: 'rose' as ThemePreset,
                  name: 'Rose Quartz & Wine',
                  badge: 'Beauty & Fashion',
                  description: 'Velvet espresso noir with soft rose gold and blush tones. High-end cosmetics & boutique apparel.',
                  colors: ['#140B10', '#25131C', '#FB7185', '#FDA4AF'],
                },
                {
                  id: 'monochrome' as ThemePreset,
                  name: 'Swiss Monolith',
                  badge: 'Minimalist Studio',
                  description: 'Apple & Swiss design studio luxury minimalism. High-contrast pure jet blacks and platinum silvers.',
                  colors: ['#09090B', '#18181B', '#71717A', '#F4F4F5'],
                },
              ].map((preset) => {
                const isSelected = settings.appearance?.theme_preset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectThemePreset(preset.id, preset.colors[2] || preset.colors[0], preset.name)}
                    className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm'
                        : 'border-border/80 hover:border-border hover:bg-muted/30'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">{preset.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            preset.id === 'crimson'
                              ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                              : preset.id === 'navy'
                              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50">
                      <div className="flex items-center gap-1.5">
                        {preset.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10 shadow-xs"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground/30'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Typography Settings */}
          <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Typography (Google Fonts)</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Choose the font family that best captures your personality and brand voice. Automatically loads across the entire app.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'jakarta' as FontPreset,
                  name: 'Plus Jakarta Sans',
                  category: 'Geometric Neo-Grotesque',
                  sample: 'High-converting Shopify stores crafted with precision.',
                  fontVar: 'var(--font-jakarta)',
                },
                {
                  id: 'outfit' as FontPreset,
                  name: 'Outfit',
                  category: 'Contemporary & Trendsetting',
                  sample: 'Direct-response landing pages that maximize ROAS.',
                  fontVar: 'var(--font-outfit)',
                },
                {
                  id: 'inter' as FontPreset,
                  name: 'Inter',
                  category: 'Modern Digital Standard',
                  sample: 'Ultra-clean typography optimized for mobile readability.',
                  fontVar: 'var(--font-inter)',
                },
                {
                  id: 'space_grotesk' as FontPreset,
                  name: 'Space Grotesk',
                  category: 'Technical Developer Aesthetic',
                  sample: 'Sub-second speed and modular Liquid engineering.',
                  fontVar: 'var(--font-space)',
                },
                {
                  id: 'syne' as FontPreset,
                  name: 'Syne',
                  category: 'Avant-Garde & High-Fashion DTC',
                  sample: 'Bold luxury typography that commands instant attention.',
                  fontVar: 'var(--font-syne)',
                },
              ].map((font) => {
                const isSelected = settings.appearance?.font_preset === font.id;
                return (
                  <div
                    key={font.id}
                    onClick={() => handleSelectFontPreset(font.id, font.name)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-border/80 hover:border-border hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-foreground" style={{ fontFamily: font.fontVar }}>
                        {font.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                        {font.category.split(' ')[0]}
                      </span>
                    </div>
                    <p
                      className="text-xs text-muted-foreground mt-2 leading-relaxed"
                      style={{ fontFamily: font.fontVar }}
                    >
                      &ldquo;{font.sample}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Corner & Button Style Presets */}
            <div className="pt-6 border-t border-border/60">
              <div className="flex items-center gap-2 mb-3">
                <Shapes className="w-4 h-4 text-primary" />
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Button &amp; Corner Shape Style
                </label>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Controls the border radius of buttons, chips, cards, and floating badges across the storefront and dashboard.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'rounded' as StylePreset,
                    label: 'Rounded Modern (14px - 20px)',
                    badge: 'Recommended',
                    desc: 'Smooth 16px rounded buttons and 20px cards. Modern, inviting, and friendly aesthetics.',
                    previewClass: 'rounded-xl',
                  },
                  {
                    id: 'pill' as StylePreset,
                    label: 'Full Pill (Pill Buttons)',
                    badge: 'Screenshot Inspired',
                    desc: 'Full pill-capsule buttons and 20px rounded cards matching reference design.',
                    previewClass: 'rounded-full',
                  },
                  {
                    id: 'sharp' as StylePreset,
                    label: 'Subtle Rounded (10px - 16px)',
                    badge: 'Architectural',
                    desc: 'Clean 12px buttons & 16px cards without harsh 0px/4px square edges.',
                    previewClass: 'rounded-md',
                  },
                ].map((style) => {
                  const isSelected = (settings.appearance?.style_preset || 'rounded') === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleSelectStylePreset(style.id, style.label)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-xs'
                          : 'border-border/80 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-foreground">{style.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-medium text-muted-foreground">
                          {style.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 my-2.5">
                        <span className={`px-3 py-1 text-[10px] font-bold bg-primary text-primary-foreground ${style.previewClass}`}>
                          Primary Button
                        </span>
                        <span className={`px-2.5 py-1 text-[10px] font-semibold bg-secondary text-secondary-foreground border border-border ${style.previewClass}`}>
                          Badge
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                        {style.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Base Font Size Scale */}
            <div className="pt-6 border-t border-border/60">
              <div className="flex items-center gap-2 mb-3">
                <Sliders className="w-4 h-4 text-primary" />
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Base Font Size Scaling
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'sm' as FontSizeScale, label: 'Compact', desc: '15px base scale' },
                  { id: 'md' as FontSizeScale, label: 'Standard', desc: '16px (Recommended)' },
                  { id: 'lg' as FontSizeScale, label: 'Large', desc: '17.5px bold scale' },
                ].map((scale) => {
                  const isSelected = settings.appearance?.font_size === scale.id;
                  return (
                    <button
                      key={scale.id}
                      type="button"
                      onClick={() => handleUpdateAppearance({ font_size: scale.id })}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-border/80 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="font-bold text-xs text-foreground">{scale.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{scale.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Accent Color Override */}
            <div className="pt-6 border-t border-border/60">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Custom Accent Color Override
                </label>
                {settings.appearance?.custom_accent && (
                  <button
                    type="button"
                    onClick={() => handleUpdateAppearance({ custom_accent: undefined })}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Preset Default</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-1.5 bg-background">
                  <input
                    type="color"
                    value={settings.appearance?.custom_accent || '#FF2A51'}
                    onChange={(e) => handleUpdateAppearance({ custom_accent: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border-none bg-transparent"
                  />
                  <Input
                    value={settings.appearance?.custom_accent || ''}
                    placeholder="Hex code (e.g. #FF2A51)"
                    onChange={(e) => handleUpdateAppearance({ custom_accent: e.target.value })}
                    className="w-32 h-8 text-xs font-mono uppercase border-none focus-visible:ring-0 p-0"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  {[
                    '#FF2A51',
                    '#0284C7',
                    '#10B981',
                    '#6366F1',
                    '#F59E0B',
                    '#06B6D4',
                    '#FB7185',
                    '#18181B',
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleUpdateAppearance({ custom_accent: color })}
                      className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 transition-transform hover:scale-110 shadow-xs"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Preview Box */}
          <div className="bg-card p-6 sm:p-8 rounded-2xl border-2 border-primary/30 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Live Portfolio Element Preview (Synced Real-Time)
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <span className="font-semibold text-primary">{settings.appearance?.theme_preset}</span>
                <span>&bull;</span>
                <span>{settings.appearance?.font_preset}</span>
                <span>&bull;</span>
                <span>{settings.appearance?.style_preset || 'pill'}</span>
                <span>&bull;</span>
                <span>{settings.appearance?.font_size}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-border/80 space-y-6">
              {/* Mock Developer Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-primary/30 shadow-xs">
                    <Image
                      src={settings.about_photo_url || '/images/ansarul-anis.jpg'}
                      alt={settings.developer_name || 'Ansarul Anis'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {settings.developer_name || 'Ansarul Anis'}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Expert Freelance Shopify &amp; Landing Page Developer
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available for Projects
                </span>
              </div>

              {/* Floating Badges inspired by screenshot */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border text-xs font-semibold shadow-xs">
                  <span className="text-amber-400">🏆</span>
                  <span className="text-foreground">Top Rated Shopify Developer</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border text-xs font-semibold shadow-xs">
                  <span className="text-primary font-bold">⚡</span>
                  <span className="text-foreground">35+ Stores Built &bull; 3.4x CRO Lift</span>
                </div>
              </div>

              {/* Mock Headline and Description */}
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                  Shopify Website Design That Converts Visitors Into Buyers
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                  Bespoke Liquid theme development, sub-second load times, and direct-response bundle funnels engineered for modern DTC brands.
                </p>
              </div>

              {/* Mock Buttons & Stat Metric */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-(--radius-button) bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
                >
                  View My Work
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-(--radius-button) bg-secondary text-secondary-foreground font-semibold text-xs border border-border hover:bg-muted/50 transition-colors"
                >
                  Chat on WhatsApp
                </button>
                <div className="ml-auto px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span>+171% Mobile CRO Lift</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 bg-card rounded-2xl border border-border">
            <p className="text-xs text-muted-foreground">
              Clicking save immediately persists your theme preset, font family, sizing scale, and button style to the database and syncs both the storefront and admin panel.
            </p>
            <button
              type="button"
              onClick={() =>
                saveTabSettings('appearance', {
                  theme_preset: settings.appearance?.theme_preset || 'crimson',
                  font_preset: settings.appearance?.font_preset || 'jakarta',
                  font_size: settings.appearance?.font_size || 'md',
                  style_preset: settings.appearance?.style_preset || 'pill',
                  custom_accent: settings.appearance?.custom_accent,
                })
              }
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground text-xs font-bold shadow-sm shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Theme & Appearance'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Hero */}
      {activeTab === 'hero' && (
        <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-foreground">Hero Section Presentation</h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Eyebrow Badge Text</label>
              <Input
                value={settings.hero_eyebrow}
                onChange={(e) => setSettings({ ...settings, hero_eyebrow: e.target.value })}
                placeholder="Shopify Developer & Landing Page Specialist"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Headline Prefix *</label>
              <Input
                value={settings.hero_headline_prefix || settings.hero_headline || 'Shopify Website Design That'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero_headline_prefix: e.target.value,
                    hero_headline: e.target.value,
                  })
                }
                placeholder="Shopify Website Design That"
              />
              <p className="text-[11px] text-muted-foreground">The static leading text in the H1 headline.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Animated Rotating Words (Typewriter Effect) *
              </label>
              <Textarea
                value={
                  settings.hero_rotating_words && settings.hero_rotating_words.length > 0
                    ? settings.hero_rotating_words.join('\n')
                    : 'Drives Growth\nBoosts Sales\nElevates Brands\nGenerates Results'
                }
                onChange={(e) => {
                  const words = e.target.value
                    .split('\n')
                    .map((w) => w.trim())
                    .filter(Boolean);
                  setSettings({ ...settings, hero_rotating_words: words });
                }}
                placeholder="Drives Growth&#10;Boosts Sales&#10;Elevates Brands&#10;Generates Results"
                className="min-h-[90px] font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Enter one phrase per line. These phrases are dynamically typed and erased one after another with the theme gradient color.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Subheadline Value Proposition</label>
              <Textarea
                value={settings.hero_subheadline}
                onChange={(e) => setSettings({ ...settings, hero_subheadline: e.target.value })}
                placeholder="I build high-converting Shopify stores..."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Primary Button Text</label>
                <Input
                  value={settings.hero_primary_cta_label}
                  onChange={(e) =>
                    setSettings({ ...settings, hero_primary_cta_label: e.target.value })
                  }
                  placeholder="View My Work"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Secondary Button Text</label>
                <Input
                  value={settings.hero_secondary_cta_label || 'Contact Me'}
                  onChange={(e) =>
                    setSettings({ ...settings, hero_secondary_cta_label: e.target.value })
                  }
                  placeholder="Contact Me"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Secondary Button Destination URL</label>
              <Input
                value={settings.hero_secondary_cta_url || '#contact'}
                onChange={(e) =>
                  setSettings({ ...settings, hero_secondary_cta_url: e.target.value })
                }
                placeholder="#contact"
              />
              <p className="text-[11px] text-muted-foreground">Use &ldquo;#contact&rdquo; to smoothly scroll to the contact form, or enter an external URL.</p>
            </div>

            <ImageUploader
              label="Hero Graphic / Storefront Illustration"
              value={settings.hero_graphic_url || ''}
              onChange={(url) => setSettings({ ...settings, hero_graphic_url: url })}
              helperText="Optional. If left blank, the modern interactive device mockup will display."
            />

            {/* Skills & Trust Badges Manager */}
            <div className="space-y-3 pt-5 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="font-bold text-sm text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Hero Skill &amp; Trust Badges (Chips)</span>
                  </label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    These badges appear directly under your Hero CTA buttons. Add, reorder, or remove any core skill or achievement.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetTrustChips}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground self-start sm:self-auto px-2.5 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              {/* Current Chips Badges */}
              <div className="flex flex-wrap gap-2 p-3.5 rounded-xl border border-border/80 bg-muted/20 min-h-[52px] items-center">
                {(settings.hero_trust_chips && settings.hero_trust_chips.length > 0
                  ? settings.hero_trust_chips
                  : defaultHeroTrustChips
                ).map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card text-foreground border border-border shadow-2xs text-xs font-medium group transition-all hover:border-destructive/40"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{chip}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrustChip(chip)}
                      className="ml-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-0.5 rounded-md transition-colors"
                      title={`Remove "${chip}"`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add New Chip Input */}
              <div className="flex items-center gap-2 pt-1">
                <Input
                  value={newChipText}
                  onChange={(e) => setNewChipText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTrustChip();
                    }
                  }}
                  placeholder="e.g. Klaviyo, Headless, Hydrogen, Speed CRO..."
                  className="flex-1 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTrustChip}
                  disabled={!newChipText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all disabled:opacity-50 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Badge</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={() =>
                saveTabSettings('hero', {
                  hero_eyebrow: settings.hero_eyebrow,
                  hero_headline: settings.hero_headline_prefix || settings.hero_headline,
                  hero_headline_prefix: settings.hero_headline_prefix || settings.hero_headline,
                  hero_rotating_words:
                    settings.hero_rotating_words || [
                      'Drives Growth',
                      'Boosts Sales',
                      'Elevates Brands',
                      'Generates Results',
                    ],
                  hero_trust_chips:
                    settings.hero_trust_chips && settings.hero_trust_chips.length > 0
                      ? settings.hero_trust_chips
                      : defaultHeroTrustChips,
                  hero_subheadline: settings.hero_subheadline,
                  hero_primary_cta_label: settings.hero_primary_cta_label,
                  hero_secondary_cta_label: settings.hero_secondary_cta_label || 'Contact Me',
                  hero_secondary_cta_url: settings.hero_secondary_cta_url || '#contact',
                  hero_graphic_url: settings.hero_graphic_url,
                })
              }
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground text-xs font-semibold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Hero Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Trust Bar */}
      {activeTab === 'trust_bar' && (
        <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Trust Bar Stats</h2>
              <p className="text-xs text-muted-foreground">Up to 4 quick credibility metrics.</p>
            </div>
            <button
              type="button"
              onClick={handleAddTrustStat}
              className="inline-flex items-center gap-1 text-xs text-primary dark:text-sky-400 font-semibold hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {settings.trust_stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Input
                  value={stat.value}
                  onChange={(e) => handleUpdateTrustStat(idx, 'value', e.target.value)}
                  placeholder="e.g. 4+"
                  className="w-28 text-xs font-mono font-bold"
                />
                <Input
                  value={stat.label}
                  onChange={(e) => handleUpdateTrustStat(idx, 'label', e.target.value)}
                  placeholder="e.g. Years Freelancing"
                  className="flex-1 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTrustStat(idx)}
                  className="p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={() => saveTabSettings('trust_bar', { trust_stats: settings.trust_stats })}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground text-xs font-semibold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Trust Stats'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: About */}
      {activeTab === 'about' && (
        <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-foreground">About &amp; Experience</h2>

          <div className="space-y-4 text-xs">
            <ImageUploader
              label="Personal Photo"
              value={settings.about_photo_url || ''}
              onChange={(url) => setSettings({ ...settings, about_photo_url: url })}
            />

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Availability Status Line (Frequently Updated)
              </label>
              <Input
                value={settings.availability_line}
                maxLength={50}
                onChange={(e) => setSettings({ ...settings, availability_line: e.target.value })}
                placeholder="Currently booking for October"
              />
              <p className="text-[11px] text-muted-foreground">Appears in the floating green badge on your photo.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">About Bio Paragraphs</label>
              {settings.about_text.map((paragraph, idx) => (
                <Textarea
                  key={idx}
                  value={paragraph}
                  onChange={(e) => {
                    const updated = [...settings.about_text];
                    updated[idx] = e.target.value;
                    setSettings({ ...settings, about_text: updated });
                  }}
                  className="min-h-[70px] mb-2"
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={() =>
                saveTabSettings('about', {
                  about_photo_url: settings.about_photo_url,
                  about_text: settings.about_text,
                  availability_line: settings.availability_line,
                  about_tools: settings.about_tools,
                })
              }
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground text-xs font-semibold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save About Section'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Contact */}
      {activeTab === 'contact' && (
        <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-foreground">WhatsApp &amp; Direct Chat Settings</h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                WhatsApp Phone Number (International format with country code) *
              </label>
              <Input
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Default Prefilled WhatsApp Message</label>
              <Textarea
                value={settings.whatsapp_message}
                onChange={(e) => setSettings({ ...settings, whatsapp_message: e.target.value })}
                placeholder="Hi! I visited your portfolio and I would like to discuss a Shopify project."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={() =>
                saveTabSettings('contact', {
                  whatsapp_number: settings.whatsapp_number,
                  whatsapp_message: settings.whatsapp_message,
                })
              }
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground text-xs font-semibold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save WhatsApp Settings'}</span>
            </button>
          </div>

          {/* Email Notification Settings & Test */}
          <div className="pt-6 border-t border-border space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>Lead Email Notification &amp; Delivery Test</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When clients submit inquiries through the contact form, notifications are saved to your Leads Inbox and dispatched to <span className="font-semibold text-foreground">ansarul.contact@gmail.com</span>.
            </p>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-foreground">Test Email Dispatch</div>
                  <div className="text-[11px] text-muted-foreground">Sends a live test notification to ansarul.contact@gmail.com</div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setIsSaving(true);
                    try {
                      const res = await fetch('/api/test-email', { method: 'POST' });
                      const json = await res.json();
                      if (json.success) {
                        showNotification(`✅ ${json.message}`);
                      } else {
                        showNotification(`❌ ${json.error}`);
                      }
                    } catch (err: any) {
                      showNotification(`❌ Error: ${err.message}`);
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Testing...' : 'Send Test Email'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
