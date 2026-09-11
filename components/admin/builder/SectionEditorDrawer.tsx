'use client';

import * as React from 'react';
import {
  X,
  Check,
  Eye,
  Sliders,
  Palette,
  Type,
  Layout,
  Layers,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Move,
  Plus,
  Trash2,
  Image as ImageIcon,
  Send,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { PageSection } from '@/types/database.types';
import { SectionSettings, ContentBlock } from '@/lib/sections/types';
import { defaultHeroTrustChips } from '@/lib/data/seed-data';
import { getSectionDefinition } from '@/lib/sections/registry';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { PageSectionRenderer } from '@/lib/sections/renderer';

interface SectionEditorDrawerProps {
  section: PageSection | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSection: PageSection) => void;
  onPublish?: (updatedSection: PageSection) => void;
  previewData?: any;
}

const defaultAboutTools = [
  'Shopify 2.0',
  'Liquid',
  'React / Next.js',
  'Tailwind CSS',
  'Storefront API',
  'Figma',
  'Klaviyo',
  'Recharge',
];

const defaultNavLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const defaultTrustStats: ContentBlock[] = [
  { id: 'ts-1', type: 'stat', stat_value: '4+', stat_label: 'Years Freelancing' },
  { id: 'ts-2', type: 'stat', stat_value: '270+', stat_label: 'Shopify Stores Built' },
  { id: 'ts-3', type: 'stat', stat_value: '99.8%', stat_label: 'Client Satisfaction' },
  { id: 'ts-4', type: 'stat', stat_value: '3.4x', stat_label: 'Avg. Conversion Lift' },
];

type TabKey =
  | 'content'
  | 'layout'
  | 'style'
  | 'typography'
  | 'spacing'
  | 'animation'
  | 'visibility'
  | 'advanced';

export function SectionEditorDrawer({
  section,
  isOpen,
  onClose,
  onSave,
  onPublish,
  previewData = {},
}: SectionEditorDrawerProps) {
  const def = section ? getSectionDefinition(section.section_type) : null;
  const [activeTab, setActiveTab] = React.useState<TabKey>('content');
  const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = React.useState(true);

  // Local state for live editing before applying
  const [title, setTitle] = React.useState(section?.title || '');
  const [isEnabled, setIsEnabled] = React.useState(section?.is_enabled ?? true);
  const [desktopVisible, setDesktopVisible] = React.useState(section?.desktop_visible !== false);
  const [tabletVisible, setTabletVisible] = React.useState(section?.tablet_visible !== false);
  const [mobileVisible, setMobileVisible] = React.useState(section?.mobile_visible !== false);
  const [settings, setSettings] = React.useState<SectionSettings>({
    ...(section?.draft_settings || section?.settings || {}),
  });

  // Re-sync when section changes
  React.useEffect(() => {
    if (section) {
      setTitle(section.title);
      setIsEnabled(section.is_enabled);
      setDesktopVisible(section.desktop_visible !== false);
      setTabletVisible(section.tablet_visible !== false);
      setMobileVisible(section.mobile_visible !== false);
      setSettings({ ...(section.draft_settings || section.settings || {}) });
    }
  }, [section]);

  const [chipInput, setChipInput] = React.useState('');
  const [aboutToolInput, setAboutToolInput] = React.useState('');
  const [newNavLabel, setNewNavLabel] = React.useState('');
  const [newNavHref, setNewNavHref] = React.useState('');

  const updateSetting = (key: keyof SectionSettings, val: any) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleAddDrawerChip = () => {
    if (!chipInput.trim()) return;
    const current = settings.hero_trust_chips && settings.hero_trust_chips.length > 0
      ? settings.hero_trust_chips
      : defaultHeroTrustChips;
    const trimmed = chipInput.trim();
    if (!current.includes(trimmed)) {
      updateSetting('hero_trust_chips', [...current, trimmed]);
    }
    setChipInput('');
  };

  const handleRemoveDrawerChip = (chipToRemove: string) => {
    const current = settings.hero_trust_chips && settings.hero_trust_chips.length > 0
      ? settings.hero_trust_chips
      : defaultHeroTrustChips;
    updateSetting('hero_trust_chips', current.filter((c) => c !== chipToRemove));
  };

  const handleResetDrawerChips = () => {
    updateSetting('hero_trust_chips', [...defaultHeroTrustChips]);
  };

  const handleAddAboutTool = () => {
    if (!aboutToolInput.trim()) return;
    const current = settings.tools && settings.tools.length > 0 ? settings.tools : defaultAboutTools;
    const trimmed = aboutToolInput.trim();
    if (!current.includes(trimmed)) {
      updateSetting('tools', [...current, trimmed]);
    }
    setAboutToolInput('');
  };

  const handleRemoveAboutTool = (toolToRemove: string) => {
    const current = settings.tools && settings.tools.length > 0 ? settings.tools : defaultAboutTools;
    updateSetting('tools', current.filter((t) => t !== toolToRemove));
  };

  const handleResetAboutTools = () => {
    updateSetting('tools', [...defaultAboutTools]);
  };

  const handleAddNavLink = () => {
    if (!newNavLabel.trim() || !newNavHref.trim()) return;
    const current = settings.nav_links && settings.nav_links.length > 0 ? settings.nav_links : defaultNavLinks;
    updateSetting('nav_links', [...current, { label: newNavLabel.trim(), href: newNavHref.trim() }]);
    setNewNavLabel('');
    setNewNavHref('');
  };

  const handleRemoveNavLink = (index: number) => {
    const current = settings.nav_links && settings.nav_links.length > 0 ? settings.nav_links : defaultNavLinks;
    updateSetting('nav_links', current.filter((_, idx) => idx !== index));
  };

  const handleUpdateNavLink = (index: number, partial: { label?: string; href?: string }) => {
    const current = settings.nav_links && settings.nav_links.length > 0 ? settings.nav_links : defaultNavLinks;
    updateSetting('nav_links', current.map((item, idx) => idx === index ? { ...item, ...partial } : item));
  };

  const handleResetNavLinks = () => {
    updateSetting('nav_links', [...defaultNavLinks]);
  };

  const handleResetTrustStats = () => {
    updateSetting('blocks', [...defaultTrustStats]);
  };

  const handleApply = () => {
    if (!section) return;
    const updated: PageSection = {
      ...section,
      title,
      is_enabled: isEnabled,
      desktop_visible: desktopVisible,
      tablet_visible: tabletVisible,
      mobile_visible: mobileVisible,
      draft_settings: settings,
      updated_at: new Date().toISOString(),
    };
    onSave(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anisshopify_sections_changed'));
    }
    onClose();
  };

  const handleApplyAndPublish = () => {
    if (!section) return;
    const updated: PageSection = {
      ...section,
      title,
      is_enabled: isEnabled,
      desktop_visible: desktopVisible,
      tablet_visible: tabletVisible,
      mobile_visible: mobileVisible,
      status: 'published',
      settings,
      draft_settings: null,
      updated_at: new Date().toISOString(),
    };
    if (onPublish) {
      onPublish(updated);
    } else {
      onSave(updated);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anisshopify_sections_changed'));
    }
    onClose();
  };

  const availableCaps = def?.capabilities;

  const availableTabs = React.useMemo(() => {
    if (!availableCaps) return [];
    return [
      ...(availableCaps.supportsContent ? [{ id: 'content' as TabKey, label: 'Content', icon: Type }] : []),
      ...(availableCaps.supportsLayout ? [{ id: 'layout' as TabKey, label: 'Layout', icon: Layout }] : []),
      ...(availableCaps.supportsStyle ? [{ id: 'style' as TabKey, label: 'Style', icon: Palette }] : []),
      ...(availableCaps.supportsTypography ? [{ id: 'typography' as TabKey, label: 'Typography', icon: Type }] : []),
      ...(availableCaps.supportsSpacing ? [{ id: 'spacing' as TabKey, label: 'Spacing', icon: Move }] : []),
      ...(availableCaps.supportsAnimation ? [{ id: 'animation' as TabKey, label: 'Animation', icon: Sparkles }] : []),
      ...(availableCaps.supportsVisibility ? [{ id: 'visibility' as TabKey, label: 'Visibility', icon: Eye }] : []),
      { id: 'advanced' as TabKey, label: 'Advanced', icon: Sliders },
    ];
  }, [availableCaps]);

  // If current active tab is not supported by this section, switch to the first supported
  React.useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.some((t) => t.id === activeTab)) {
      setActiveTab(availableTabs[0].id);
    }
  }, [section?.section_type, availableTabs, activeTab]);

  if (!isOpen || !section || !def) return null;

  const caps = def.capabilities;

  // Preview mock section object
  const mockSectionForPreview: PageSection = {
    ...section,
    title,
    is_enabled: isEnabled,
    desktop_visible: desktopVisible,
    tablet_visible: tabletVisible,
    mobile_visible: mobileVisible,
    draft_settings: settings,
    settings,
  };

  // Block handlers for stats/custom blocks
  const handleAddBlock = (type: 'card' | 'stat' | 'text' | 'image') => {
    const newBlock: ContentBlock = {
      id: `b-${Date.now()}`,
      type,
      title: type === 'card' ? 'Feature Title' : undefined,
      text: type === 'card' ? 'Feature description goes here.' : undefined,
      stat_value: type === 'stat' ? '99.8%' : undefined,
      stat_label: type === 'stat' ? 'Client Satisfaction' : undefined,
    };
    updateSetting('blocks', [...(settings.blocks || []), newBlock]);
  };

  const handleRemoveBlock = (blockId: string) => {
    updateSetting(
      'blocks',
      (settings.blocks || []).filter((b) => b.id !== blockId)
    );
  };

  const handleUpdateBlock = (blockId: string, partial: Partial<ContentBlock>) => {
    updateSetting(
      'blocks',
      (settings.blocks || []).map((b) => (b.id === blockId ? { ...b, ...partial } : b))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="w-full h-full max-w-7xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden text-foreground">
        {/* Top Header */}
        <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
              {section.section_type}
            </span>
            <h2 className="text-base sm:text-lg font-bold truncate max-w-xs sm:max-w-md">
              {title}
            </h2>
          </div>

          {/* Device Preview & Action buttons */}
          <div className="flex items-center gap-3">
            {/* Viewport Toggles */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-muted rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'desktop' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'tablet' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'mobile' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editor Body: Left Controls + Right Live Preview */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Controls Column */}
          <div className="w-full md:w-[480px] lg:w-[520px] flex flex-col border-r border-border shrink-0 bg-background/50">
            {/* Tabs List */}
            <div className="flex items-center gap-1 overflow-x-auto p-2 border-b border-border text-xs font-semibold shrink-0 bg-card">
              {availableTabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              {/* CONTENT TAB */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Section Admin Title</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    <p className="text-[11px] text-muted-foreground">Internal label in builder list.</p>
                  </div>

                  {/* 1. NAVIGATION SPECIFIC */}
                  {section.section_type === 'navigation' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Site / Brand Logo Text</label>
                        <Input
                          value={settings.heading || ''}
                          onChange={(e) => updateSetting('heading', e.target.value)}
                          placeholder="AnisShopify"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">CTA Button Label</label>
                          <Input
                            value={settings.primary_cta_label || ''}
                            onChange={(e) => updateSetting('primary_cta_label', e.target.value)}
                            placeholder="Let's Talk"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">CTA Destination</label>
                          <Input
                            value={settings.primary_cta_url || ''}
                            onChange={(e) => updateSetting('primary_cta_url', e.target.value)}
                            placeholder="#contact"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border">
                          <span className="font-semibold text-xs">Sticky Navigation (Fixed on Scroll)</span>
                          <input
                            type="checkbox"
                            checked={settings.sticky_nav !== false}
                            onChange={(e) => updateSetting('sticky_nav', e.target.checked)}
                            className="w-4 h-4 rounded text-primary"
                          />
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border">
                          <span className="font-semibold text-xs">Dark / Light Theme Toggle Icon</span>
                          <input
                            type="checkbox"
                            checked={settings.show_theme_toggle !== false}
                            onChange={(e) => updateSetting('show_theme_toggle', e.target.checked)}
                            className="w-4 h-4 rounded text-primary"
                          />
                        </div>
                      </div>

                      {/* Navigation Anchor Links Manager */}
                      <div className="space-y-2.5 pt-3 border-t border-border/60">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-foreground text-xs flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-primary" />
                            <span>Navigation Links ({(settings.nav_links && settings.nav_links.length > 0 ? settings.nav_links : defaultNavLinks).length})</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleResetNavLinks}
                            className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset Defaults</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(settings.nav_links && settings.nav_links.length > 0 ? settings.nav_links : defaultNavLinks).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border">
                              <Input
                                value={item.label}
                                onChange={(e) => handleUpdateNavLink(idx, { label: e.target.value })}
                                placeholder="Label (e.g. Work)"
                                className="flex-1 text-xs h-8"
                              />
                              <Input
                                value={item.href}
                                onChange={(e) => handleUpdateNavLink(idx, { href: e.target.value })}
                                placeholder="Href (e.g. #work)"
                                className="flex-1 text-xs h-8 font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveNavLink(idx)}
                                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg"
                                title="Delete link"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <Input
                            value={newNavLabel}
                            onChange={(e) => setNewNavLabel(e.target.value)}
                            placeholder="New Link Label..."
                            className="flex-1 text-xs h-8"
                          />
                          <Input
                            value={newNavHref}
                            onChange={(e) => setNewNavHref(e.target.value)}
                            placeholder="#section or https://..."
                            className="flex-1 text-xs h-8 font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleAddNavLink}
                            disabled={!newNavLabel.trim() || !newNavHref.trim()}
                            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 disabled:opacity-50 h-8 shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 2. TRUST_BAR SPECIFIC */}
                  {section.section_type === 'trust_bar' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-foreground text-xs flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <span>Trust Statistics ({(settings.blocks && settings.blocks.length > 0 ? settings.blocks : defaultTrustStats).length})</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleResetTrustStats}
                          className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Defaults</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(settings.blocks && settings.blocks.length > 0 ? settings.blocks : defaultTrustStats).map((block) => (
                          <div key={block.id} className="p-3 rounded-xl border border-border bg-card space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold uppercase text-[10px] text-primary">Stat Metric</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBlock(block.id)}
                                className="text-muted-foreground hover:text-destructive p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground font-semibold">Value</span>
                                <Input
                                  value={block.stat_value || ''}
                                  placeholder="e.g. 4+ or 99.8%"
                                  onChange={(e) => handleUpdateBlock(block.id, { stat_value: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground font-semibold">Label</span>
                                <Input
                                  value={block.stat_label || ''}
                                  placeholder="e.g. Years Freelancing"
                                  onChange={(e) => handleUpdateBlock(block.id, { stat_label: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddBlock('stat')}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-border hover:border-primary/50 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Stat</span>
                      </button>
                    </div>
                  )}

                  {/* 3. HERO SPECIFIC */}
                  {section.section_type === 'hero' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Eyebrow / Badge Text</label>
                        <Input
                          value={settings.eyebrow || ''}
                          onChange={(e) => updateSetting('eyebrow', e.target.value)}
                          placeholder="Shopify Developer & Landing Page Specialist"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Headline Prefix (Static text)</label>
                        <Input
                          value={settings.heading_prefix || settings.heading || ''}
                          onChange={(e) => {
                            updateSetting('heading_prefix', e.target.value);
                            updateSetting('heading', e.target.value);
                          }}
                          placeholder="Shopify Website Design That"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Animated Rotating Phrases (Typewriter)</label>
                        <Textarea
                          value={
                            settings.rotating_words && settings.rotating_words.length > 0
                              ? settings.rotating_words.join('\n')
                              : 'Drives Growth\nBoosts Sales\nElevates Brands\nGenerates Results'
                          }
                          onChange={(e) => {
                            const words = e.target.value
                              .split('\n')
                              .map((w) => w.trim())
                              .filter(Boolean);
                            updateSetting('rotating_words', words);
                          }}
                          placeholder="Drives Growth&#10;Boosts Sales&#10;Elevates Brands&#10;Generates Results"
                          className="min-h-[85px] font-mono text-xs"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Enter one phrase per line. Typed and erased sequentially.
                        </p>
                      </div>

                      {/* Skill & Trust Badges (Chips) */}
                      <div className="space-y-2.5 pt-3 border-t border-border/60">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                            <span>Skill &amp; Trust Badges (Hero Chips)</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleResetDrawerChips}
                            className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl border border-border/80 bg-muted/20 min-h-[44px] items-center">
                          {(settings.hero_trust_chips && settings.hero_trust_chips.length > 0
                            ? settings.hero_trust_chips
                            : defaultHeroTrustChips
                          ).map((chip) => (
                            <span
                              key={chip}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-card text-foreground border border-border shadow-2xs text-[11px] font-medium"
                            >
                              <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                              <span>{chip}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveDrawerChip(chip)}
                                className="ml-0.5 text-muted-foreground hover:text-destructive p-0.5 rounded-sm"
                                title={`Remove "${chip}"`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Input
                            value={chipInput}
                            onChange={(e) => setChipInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddDrawerChip();
                              }
                            }}
                            placeholder="e.g. Klaviyo, Headless..."
                            className="flex-1 text-xs h-8"
                          />
                          <button
                            type="button"
                            onClick={handleAddDrawerChip}
                            disabled={!chipInput.trim()}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all disabled:opacity-50 h-8"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>

                      {/* Subheading */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Subheading</label>
                        <Textarea
                          value={settings.subheading || ''}
                          onChange={(e) => updateSetting('subheading', e.target.value)}
                          placeholder="Supporting explanatory statement..."
                        />
                      </div>

                      {/* CTA Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Primary CTA Label</label>
                          <Input
                            value={settings.primary_cta_label || ''}
                            onChange={(e) => updateSetting('primary_cta_label', e.target.value)}
                            placeholder="View My Work"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Primary CTA Destination</label>
                          <Input
                            value={settings.primary_cta_url || ''}
                            onChange={(e) => updateSetting('primary_cta_url', e.target.value)}
                            placeholder="#work"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Secondary CTA Label</label>
                          <Input
                            value={settings.secondary_cta_label || ''}
                            onChange={(e) => updateSetting('secondary_cta_label', e.target.value)}
                            placeholder="Contact Me"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Secondary CTA Destination</label>
                          <Input
                            value={settings.secondary_cta_url || ''}
                            onChange={(e) => updateSetting('secondary_cta_url', e.target.value)}
                            placeholder="#contact"
                          />
                        </div>
                      </div>

                      {/* Floating Badges */}
                      <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-3 pt-3">
                        <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                          <span>🏆</span>
                          <span>Hero Graphic Floating Badges</span>
                        </span>
                        
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground font-semibold">Top Badge Title</span>
                            <Input
                              value={settings.badge_top_title || ''}
                              placeholder="Top Rated"
                              onChange={(e) => updateSetting('badge_top_title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground font-semibold">Top Badge Subtitle</span>
                            <Input
                              value={settings.badge_top_subtitle || ''}
                              placeholder="Shopify Developer"
                              onChange={(e) => updateSetting('badge_top_subtitle', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground font-semibold">Stat Badge Title</span>
                            <Input
                              value={settings.badge_bottom_title || ''}
                              placeholder="270+ Stores"
                              onChange={(e) => updateSetting('badge_bottom_title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground font-semibold">Stat Badge Subtitle</span>
                            <Input
                              value={settings.badge_bottom_subtitle || ''}
                              placeholder="Developed Successfully"
                              onChange={(e) => updateSetting('badge_bottom_subtitle', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="pt-2">
                        <ImageUploader
                          label="Hero Developer Portrait"
                          value={settings.image_url || '/images/ansarul-anis.png'}
                          onChange={(url) => updateSetting('image_url', url)}
                        />
                      </div>
                    </>
                  )}

                  {/* 4. ABOUT ME SPECIFIC */}
                  {section.section_type === 'about' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Eyebrow / Badge Text</label>
                        <Input
                          value={settings.eyebrow || ''}
                          onChange={(e) => updateSetting('eyebrow', e.target.value)}
                          placeholder="Meet the Shopify Expert"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Main Heading</label>
                        <Input
                          value={settings.heading || ''}
                          onChange={(e) => updateSetting('heading', e.target.value)}
                          placeholder="I Build Shopify Stores That Sell"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Detailed Bio / Story (Paragraphs)</label>
                        <Textarea
                          value={settings.description || ''}
                          onChange={(e) => updateSetting('description', e.target.value)}
                          placeholder="Enter bio paragraphs. Separate paragraphs with double newlines."
                          className="min-h-[120px]"
                        />
                        <p className="text-[11px] text-muted-foreground">Separate paragraphs with blank lines.</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Availability Status Line</label>
                        <Input
                          value={settings.availability_line || ''}
                          onChange={(e) => updateSetting('availability_line', e.target.value)}
                          placeholder="Currently booking for this month"
                        />
                      </div>

                      {/* Specialized Tech Stack Chips */}
                      <div className="space-y-2.5 pt-3 border-t border-border/60">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                            <span>Tech Stack &amp; Tools Chips</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleResetAboutTools}
                            className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl border border-border/80 bg-muted/20 min-h-[44px] items-center">
                          {(settings.tools && settings.tools.length > 0 ? settings.tools : defaultAboutTools).map((tool) => (
                            <span
                              key={tool}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-card text-foreground border border-border shadow-2xs text-[11px] font-medium"
                            >
                              <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                              <span>{tool}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveAboutTool(tool)}
                                className="ml-0.5 text-muted-foreground hover:text-destructive p-0.5 rounded-sm"
                                title={`Remove "${tool}"`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Input
                            value={aboutToolInput}
                            onChange={(e) => setAboutToolInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddAboutTool();
                              }
                            }}
                            placeholder="e.g. Sanity, Headless..."
                            className="flex-1 text-xs h-8"
                          />
                          <button
                            type="button"
                            onClick={handleAddAboutTool}
                            disabled={!aboutToolInput.trim()}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all disabled:opacity-50 h-8"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>

                      {/* Floating Badges */}
                      <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-3 pt-3">
                        <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                          <span>🏆</span>
                          <span>About Mockup Floating Badges</span>
                        </span>
                        
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground font-semibold">Top Badge Title</span>
                            <Input
                              value={settings.badge_top_title || ''}
                              placeholder="Top Rated"
                              onChange={(e) => updateSetting('badge_top_title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground font-semibold">Top Badge Subtitle</span>
                            <Input
                              value={settings.badge_top_subtitle || ''}
                              placeholder="Shopify Developer"
                              onChange={(e) => updateSetting('badge_top_subtitle', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground font-semibold">Stat Badge Title</span>
                            <Input
                              value={settings.badge_bottom_title || ''}
                              placeholder="270+ Stores"
                              onChange={(e) => updateSetting('badge_bottom_title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground font-semibold">Stat Badge Subtitle</span>
                            <Input
                              value={settings.badge_bottom_subtitle || ''}
                              placeholder="Developed Successfully"
                              onChange={(e) => updateSetting('badge_bottom_subtitle', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mockup Image */}
                      <div className="pt-2">
                        <ImageUploader
                          label="Shopify Store Mockup Image"
                          value={settings.image_url || '/images/shopify-dashboard.png'}
                          onChange={(url) => updateSetting('image_url', url)}
                        />
                      </div>
                    </>
                  )}

                  {/* 5. TESTIMONIALS SPECIFIC */}
                  {section.section_type === 'testimonials' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Eyebrow / Badge Text</label>
                        <Input
                          value={settings.eyebrow || ''}
                          onChange={(e) => updateSetting('eyebrow', e.target.value)}
                          placeholder="Client Results"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Main Heading</label>
                        <Input
                          value={settings.heading || ''}
                          onChange={(e) => updateSetting('heading', e.target.value)}
                          placeholder="Trusted by Ecommerce Brands Worldwide"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Subheading</label>
                        <Textarea
                          value={settings.subheading || ''}
                          onChange={(e) => updateSetting('subheading', e.target.value)}
                          placeholder="Supporting explanatory statement..."
                        />
                      </div>

                      {/* Carousel Settings */}
                      <div className="p-4 rounded-xl border border-border bg-card space-y-3 pt-3">
                        <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-primary" />
                          <span>Interactive Carousel Controls</span>
                        </span>

                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                          <span className="font-semibold text-xs">Auto-play Slides</span>
                          <input
                            type="checkbox"
                            checked={settings.carousel_autoplay !== false}
                            onChange={(e) => updateSetting('carousel_autoplay', e.target.checked)}
                            className="w-4 h-4 rounded text-primary"
                          />
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                          <span className="font-semibold text-xs">Pause on Hover / Touch</span>
                          <input
                            type="checkbox"
                            checked={settings.pause_on_hover !== false}
                            onChange={(e) => updateSetting('pause_on_hover', e.target.checked)}
                            className="w-4 h-4 rounded text-primary"
                          />
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs">Autoplay Speed</span>
                            <span className="font-mono text-xs text-primary font-bold">
                              {settings.carousel_speed || 4500}ms ({((settings.carousel_speed || 4500) / 1000).toFixed(1)}s)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="2000"
                            max="10000"
                            step="500"
                            value={settings.carousel_speed || 4500}
                            onChange={(e) => updateSetting('carousel_speed', Number(e.target.value))}
                            className="w-full accent-primary cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                            <span>Fast (2s)</span>
                            <span>Normal (4.5s)</span>
                            <span>Slow (10s)</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 6. CONTACT SPECIFIC */}
                  {section.section_type === 'contact' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Eyebrow / Badge Text</label>
                        <Input
                          value={settings.eyebrow || ''}
                          onChange={(e) => updateSetting('eyebrow', e.target.value)}
                          placeholder="Start Your Project"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Main Heading</label>
                        <Input
                          value={settings.heading || ''}
                          onChange={(e) => updateSetting('heading', e.target.value)}
                          placeholder="Ready to Build Your Shopify Store?"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Subheading</label>
                        <Textarea
                          value={settings.subheading || ''}
                          onChange={(e) => updateSetting('subheading', e.target.value)}
                          placeholder="Supporting explanatory statement..."
                        />
                      </div>

                      {/* WhatsApp Card Settings */}
                      <div className="p-4 rounded-xl border border-border bg-card space-y-3 pt-3">
                        <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Direct WhatsApp Lead Settings</span>
                        </span>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">WhatsApp Number (with country code)</label>
                          <Input
                            value={settings.whatsapp_number || '+8801709260934'}
                            onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
                            placeholder="+8801709260934"
                            className="font-mono text-xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Default Prefilled WhatsApp Message</label>
                          <Textarea
                            value={settings.whatsapp_prefill || 'Hi Anis! I visited your portfolio and I would like to discuss a Shopify project.'}
                            onChange={(e) => updateSetting('whatsapp_prefill', e.target.value)}
                            placeholder="Hi Anis! I visited your portfolio..."
                            className="min-h-[70px]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 7. FOOTER SPECIFIC */}
                  {section.section_type === 'footer' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Brand / Logo Name</label>
                        <Input
                          value={settings.heading || 'AnisShopify'}
                          onChange={(e) => updateSetting('heading', e.target.value)}
                          placeholder="AnisShopify"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Brand Bio / Description</label>
                        <Textarea
                          value={settings.description || ''}
                          onChange={(e) => updateSetting('description', e.target.value)}
                          placeholder="Ansarul Anis — Shopify expert specializing in Shopify store design..."
                          className="min-h-[90px]"
                        />
                      </div>

                      {/* Navigation Column Controls */}
                      <div className="space-y-2.5 pt-3 border-t border-border/60">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Navigation Column Title</label>
                          <Input
                            value={settings.nav_title || 'NAVIGATION'}
                            onChange={(e) => updateSetting('nav_title', e.target.value)}
                            placeholder="NAVIGATION"
                          />
                        </div>

                        {/* Navigation Quick Links Manager */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-foreground text-xs flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-primary" />
                              <span>Footer Navigation Links</span>
                            </label>
                            <button
                              type="button"
                              onClick={handleResetNavLinks}
                              className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset Links</span>
                            </button>
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {(settings.nav_links && settings.nav_links.length > 0 ? settings.nav_links : defaultNavLinks).map((link, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border">
                                <Input
                                  value={link.label}
                                  onChange={(e) => handleUpdateNavLink(idx, { label: e.target.value })}
                                  placeholder="Link Label"
                                  className="flex-1 text-xs h-8"
                                />
                                <Input
                                  value={link.href}
                                  onChange={(e) => handleUpdateNavLink(idx, { href: e.target.value })}
                                  placeholder="#section or URL"
                                  className="flex-1 text-xs h-8 font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNavLink(idx)}
                                  className="p-1 text-muted-foreground hover:text-destructive shrink-0"
                                  title="Delete link"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <Input
                              value={newNavLabel}
                              onChange={(e) => setNewNavLabel(e.target.value)}
                              placeholder="New Link Label..."
                              className="flex-1 text-xs h-8"
                            />
                            <Input
                              value={newNavHref}
                              onChange={(e) => setNewNavHref(e.target.value)}
                              placeholder="#work or https://..."
                              className="flex-1 text-xs h-8 font-mono"
                            />
                            <button
                              type="button"
                              onClick={handleAddNavLink}
                              disabled={!newNavLabel.trim() || !newNavHref.trim()}
                              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 disabled:opacity-50 h-8 shrink-0 flex items-center justify-center"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Connect Column Controls */}
                      <div className="space-y-2.5 pt-3 border-t border-border/60">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Connect Column Title</label>
                          <Input
                            value={settings.connect_title || 'CONNECT'}
                            onChange={(e) => updateSetting('connect_title', e.target.value)}
                            placeholder="CONNECT"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                          <span className="font-semibold text-xs">Display Social Media Links</span>
                          <input
                            type="checkbox"
                            checked={settings.show_social_icons !== false}
                            onChange={(e) => updateSetting('show_social_icons', e.target.checked)}
                            className="w-4 h-4 rounded text-primary"
                          />
                        </div>
                      </div>

                      {/* Footer Bottom Bar Controls */}
                      <div className="space-y-2.5 pt-3 border-t border-border/60">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Copyright Notice Text</label>
                          <Textarea
                            value={settings.copyright_text || ''}
                            onChange={(e) => updateSetting('copyright_text', e.target.value)}
                            placeholder="© 2026 AnisShopify. All rights reserved."
                            className="min-h-[60px]"
                          />
                          <p className="text-[11px] text-muted-foreground">Leave blank to automatically use current year and brand name.</p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Back to Top Button Text</label>
                          <Input
                            value={settings.back_to_top_text || 'Back to top'}
                            onChange={(e) => updateSetting('back_to_top_text', e.target.value)}
                            placeholder="Back to top"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* EXIT POPUP SPECIFIC */}
                  {section.section_type === 'exit_popup' && (
                    <>
                      {/* Content Fields Card */}
                      <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span>Exit Intent Visitor Popup Content</span>
                          </span>
                          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-pointer">
                            <span>Enable Popup</span>
                            <input
                              type="checkbox"
                              checked={settings.exit_popup_enabled !== false}
                              onChange={(e) => updateSetting('exit_popup_enabled', e.target.checked)}
                              className="w-4 h-4 rounded text-primary"
                            />
                          </label>
                        </div>

                        {settings.exit_popup_enabled !== false && (
                          <div className="space-y-3 pt-2 border-t border-border/40">
                            <div className="space-y-1.5">
                              <label className="text-xs text-muted-foreground font-semibold">Badge Hook Text (Eyebrow)</label>
                              <Input
                                value={settings.exit_popup_eyebrow ?? settings.eyebrow ?? 'WAIT! BEFORE YOU GO'}
                                onChange={(e) => updateSetting('exit_popup_eyebrow', e.target.value)}
                                placeholder="WAIT! BEFORE YOU GO"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs text-muted-foreground font-semibold">Popup Headline</label>
                              <Input
                                value={settings.exit_popup_title ?? settings.heading ?? (settings as any).title ?? "Let's Build Your Dream Shopify Store"}
                                onChange={(e) => updateSetting('exit_popup_title', e.target.value)}
                                placeholder="Let's Build Your Dream Shopify Store"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs text-muted-foreground font-semibold">Popup Subheading</label>
                              <Textarea
                                value={
                                  settings.exit_popup_subheading ??
                                  settings.subheading ??
                                  'Get a Free 15-Minute Shopify Audit & Fixed Quote for your project. Reach out on WhatsApp or drop a quick line below!'
                                }
                                onChange={(e) => updateSetting('exit_popup_subheading', e.target.value)}
                                placeholder="Get a Free 15-Minute Shopify Audit..."
                                className="min-h-[70px]"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground font-semibold">WhatsApp Button Text</label>
                                <Input
                                  value={settings.exit_popup_whatsapp_label ?? (settings as any).whatsapp_label ?? 'Chat on WhatsApp'}
                                  onChange={(e) => updateSetting('exit_popup_whatsapp_label', e.target.value)}
                                  placeholder="Chat on WhatsApp"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground font-semibold">WhatsApp Reply Tag</label>
                                <Input
                                  value={settings.exit_popup_whatsapp_tag ?? (settings as any).whatsapp_tag ?? ''}
                                  onChange={(e) => updateSetting('exit_popup_whatsapp_tag', e.target.value)}
                                  placeholder="Optional tag (e.g. Under 20m reply)"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs text-muted-foreground font-semibold">Submit Button Text</label>
                              <Input
                                value={settings.exit_popup_submit_label ?? (settings as any).submit_label ?? 'Get Free Audit & Quote'}
                                onChange={(e) => updateSetting('exit_popup_submit_label', e.target.value)}
                                placeholder="Get Free Audit & Quote"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Display Triggers & Conditions Card */}
                      {settings.exit_popup_enabled !== false && (
                        <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                          <span className="font-bold text-foreground text-xs uppercase tracking-wider block">
                            Display Triggers & Conditions
                          </span>

                          <label className="flex items-center justify-between text-xs font-semibold text-foreground cursor-pointer">
                            <span>1. Exit Intent (Mouseleave Top / Mobile Back-Scroll)</span>
                            <input
                              type="checkbox"
                              checked={settings.exit_popup_trigger_exit_intent !== false}
                              onChange={(e) => updateSetting('exit_popup_trigger_exit_intent', e.target.checked)}
                              className="w-4 h-4 rounded text-primary"
                            />
                          </label>

                          <div className="space-y-2 pt-1 border-t border-border/40">
                            <label className="flex items-center justify-between text-xs font-semibold text-foreground cursor-pointer">
                              <span>2. Scroll Depth Trigger</span>
                              <input
                                type="checkbox"
                                checked={settings.exit_popup_trigger_scroll_enabled !== false}
                                onChange={(e) => updateSetting('exit_popup_trigger_scroll_enabled', e.target.checked)}
                                className="w-4 h-4 rounded text-primary"
                              />
                            </label>
                            {settings.exit_popup_trigger_scroll_enabled !== false && (
                              <div className="flex items-center gap-2 pl-4">
                                <span className="text-xs text-muted-foreground">Trigger after scrolling:</span>
                                <Input
                                  type="number"
                                  value={settings.exit_popup_scroll_px ?? 600}
                                  onChange={(e) => updateSetting('exit_popup_scroll_px', parseInt(e.target.value) || 0)}
                                  className="w-24 h-8 text-xs"
                                  placeholder="600"
                                />
                                <span className="text-xs text-muted-foreground">px</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 pt-1 border-t border-border/40">
                            <label className="flex items-center justify-between text-xs font-semibold text-foreground cursor-pointer">
                              <span>3. Time Delay Trigger</span>
                              <input
                                type="checkbox"
                                checked={Boolean(settings.exit_popup_trigger_delay_enabled)}
                                onChange={(e) => updateSetting('exit_popup_trigger_delay_enabled', e.target.checked)}
                                className="w-4 h-4 rounded text-primary"
                              />
                            </label>
                            {Boolean(settings.exit_popup_trigger_delay_enabled) && (
                              <div className="flex items-center gap-2 pl-4">
                                <span className="text-xs text-muted-foreground">Trigger after staying:</span>
                                <Input
                                  type="number"
                                  value={settings.exit_popup_delay_sec ?? 30}
                                  onChange={(e) => updateSetting('exit_popup_delay_sec', parseInt(e.target.value) || 0)}
                                  className="w-24 h-8 text-xs"
                                  placeholder="30"
                                />
                                <span className="text-xs text-muted-foreground">seconds</span>
                              </div>
                            )}
                          </div>

                          {/* Live Preview Button */}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => updateSetting('exit_popup_preview_open', !settings.exit_popup_preview_open)}
                              className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                                settings.exit_popup_preview_open
                                  ? 'bg-amber-500 text-amber-950 hover:bg-amber-600'
                                  : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                              <span>
                                {settings.exit_popup_preview_open
                                  ? 'Hide Real-Time Preview Popup'
                                  : 'Preview Exit Popup Modal Live'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* 8. FAQ SPECIFIC */}
                  {section.section_type === 'faq' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Eyebrow / Badge Text</label>
                        <Input
                          value={settings.eyebrow || ''}
                          onChange={(e) => updateSetting('eyebrow', e.target.value)}
                          placeholder="Common Questions"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Main Heading</label>
                        <Input
                          value={settings.heading || ''}
                          onChange={(e) => updateSetting('heading', e.target.value)}
                          placeholder="Shopify Website Design & Development FAQ"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Subheading</label>
                        <Textarea
                          value={settings.subheading || ''}
                          onChange={(e) => updateSetting('subheading', e.target.value)}
                          placeholder="Supporting explanatory statement..."
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                        <div>
                          <div className="font-semibold text-xs">Multi-Question Accordion</div>
                          <div className="text-[10px] text-muted-foreground">Allow multiple answers to stay expanded simultaneously.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.accordion_allow_multiple === true}
                          onChange={(e) => updateSetting('accordion_allow_multiple', e.target.checked)}
                          className="w-4 h-4 rounded text-primary"
                        />
                      </div>
                    </>
                  )}

                  {/* 9. WORK SPECIFIC */}
                  {section.section_type === 'work' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Eyebrow / Badge Text</label>
                        <Input
                          value={settings.eyebrow || ''}
                          onChange={(e) => updateSetting('eyebrow', e.target.value)}
                          placeholder="Case Studies"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Main Heading</label>
                        <Input
                          value={settings.heading || ''}
                          onChange={(e) => updateSetting('heading', e.target.value)}
                          placeholder="Shopify Stores Built for Maximum Conversion"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Subheading</label>
                        <Textarea
                          value={settings.subheading || ''}
                          onChange={(e) => updateSetting('subheading', e.target.value)}
                          placeholder="Supporting explanatory statement..."
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                        <span className="font-semibold text-xs">Show Category Filter Pills</span>
                        <input
                          type="checkbox"
                          checked={settings.show_filters !== false}
                          onChange={(e) => updateSetting('show_filters', e.target.checked)}
                          className="w-4 h-4 rounded text-primary"
                        />
                      </div>
                    </>
                  )}

                  {/* 10. SERVICES SPECIFIC */}
                  {section.section_type === 'services' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Eyebrow / Badge Text</label>
                        <Input
                          value={settings.eyebrow || ''}
                          onChange={(e) => updateSetting('eyebrow', e.target.value)}
                          placeholder="What I Do"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Main Heading</label>
                        <Input
                          value={settings.heading || ''}
                          onChange={(e) => updateSetting('heading', e.target.value)}
                          placeholder="Complete Shopify Development Services"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Subheading</label>
                        <Textarea
                          value={settings.subheading || ''}
                          onChange={(e) => updateSetting('subheading', e.target.value)}
                          placeholder="Supporting explanatory statement..."
                        />
                      </div>
                    </>
                  )}

                  {/* 11. GENERIC FALLBACK FOR OTHER SECTIONS (cta, text_image, stats, custom, etc.) */}
                  {![
                    'navigation',
                    'trust_bar',
                    'hero',
                    'about',
                    'testimonials',
                    'contact',
                    'footer',
                    'faq',
                    'work',
                    'services',
                  ].includes(section.section_type) && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Eyebrow / Badge Text</label>
                        <Input
                          value={settings.eyebrow || ''}
                          onChange={(e) => updateSetting('eyebrow', e.target.value)}
                          placeholder="e.g. Featured Offerings"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Main Heading</label>
                        <Input
                          value={settings.heading || ''}
                          onChange={(e) => updateSetting('heading', e.target.value)}
                          placeholder="Main Heading"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Subheading</label>
                        <Textarea
                          value={settings.subheading || ''}
                          onChange={(e) => updateSetting('subheading', e.target.value)}
                          placeholder="Supporting explanatory statement..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Detailed Description</label>
                        <Textarea
                          value={settings.description || ''}
                          onChange={(e) => updateSetting('description', e.target.value)}
                          placeholder="Long-form section description..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Primary CTA Label</label>
                          <Input
                            value={settings.primary_cta_label || ''}
                            onChange={(e) => updateSetting('primary_cta_label', e.target.value)}
                            placeholder="Learn More"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground">Primary CTA Destination</label>
                          <Input
                            value={settings.primary_cta_url || ''}
                            onChange={(e) => updateSetting('primary_cta_url', e.target.value)}
                            placeholder="#contact"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <ImageUploader
                          label="Feature / Section Image"
                          value={settings.image_url || ''}
                          onChange={(url) => updateSetting('image_url', url)}
                        />
                      </div>

                      {caps.supportsBlocks && (
                        <div className="pt-4 border-t border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-foreground">Content Blocks ({settings.blocks?.length || 0})</label>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleAddBlock('card')}
                                className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-[11px] font-semibold"
                              >
                                + Card
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddBlock('stat')}
                                className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-[11px] font-semibold"
                              >
                                + Stat
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            {(settings.blocks || []).map((block) => (
                              <div key={block.id} className="p-3 rounded-xl border border-border bg-card space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold uppercase text-[10px] text-primary">{block.type} Block</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBlock(block.id)}
                                    className="text-muted-foreground hover:text-destructive p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                {block.type === 'stat' ? (
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input
                                      value={block.stat_value || ''}
                                      placeholder="Value e.g. +171%"
                                      onChange={(e) => handleUpdateBlock(block.id, { stat_value: e.target.value })}
                                    />
                                    <Input
                                      value={block.stat_label || ''}
                                      placeholder="Label e.g. Mobile CRO"
                                      onChange={(e) => handleUpdateBlock(block.id, { stat_label: e.target.value })}
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <Input
                                      value={block.title || ''}
                                      placeholder="Card Title"
                                      onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                    />
                                    <Textarea
                                      value={block.text || ''}
                                      placeholder="Card text description"
                                      onChange={(e) => handleUpdateBlock(block.id, { text: e.target.value })}
                                    />
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* LAYOUT TAB */}
              {activeTab === 'layout' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Section Container</label>
                    <Select
                      value={settings.layout || 'contained'}
                      onChange={(e) => updateSetting('layout', e.target.value)}
                    >
                      <option value="contained">Contained (Centered with max-width)</option>
                      <option value="full">Full-Width Edge to Edge</option>
                      <option value="two-column">Two Column Split</option>
                      <option value="three-column">Three Column Grid</option>
                      <option value="four-column">Four Column Grid</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Content Width</label>
                    <Select
                      value={settings.content_width || 'normal'}
                      onChange={(e) => updateSetting('content_width', e.target.value)}
                    >
                      <option value="narrow">Narrow (Optimal for reading / text)</option>
                      <option value="normal">Normal (Standard 1280px)</option>
                      <option value="wide">Wide (Spacious 1440px)</option>
                      <option value="full">Full Width</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Image Position (if applicable)</label>
                    <Select
                      value={settings.image_position || 'right'}
                      onChange={(e) => updateSetting('image_position', e.target.value)}
                    >
                      <option value="right">Image on Right / Text on Left</option>
                      <option value="left">Image on Left / Text on Right</option>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                    <span className="font-semibold">Stack Vertically on Mobile</span>
                    <input
                      type="checkbox"
                      checked={settings.stack_on_mobile !== false}
                      onChange={(e) => updateSetting('stack_on_mobile', e.target.checked)}
                      className="w-4 h-4 rounded text-primary"
                    />
                  </div>
                </div>
              )}

              {/* STYLE TAB */}
              {activeTab === 'style' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Section Background</label>
                    <Select
                      value={settings.background || 'default'}
                      onChange={(e) => updateSetting('background', e.target.value)}
                    >
                      <option value="default">Theme Default (Auto Light / Dark)</option>
                      <option value="muted">Subtle Muted Surface</option>
                      <option value="gradient-subtle">Gradient: Subtle Brand Top Wash</option>
                      <option value="gradient-card">Gradient: Dual-Tone Card Ambient</option>
                      <option value="gradient-radial">Gradient: Centered Radial Spotlight</option>
                      <option value="gradient-accent">Gradient: High-Impact Soft Accent</option>
                      <option value="gradient-vibrant">Gradient: Full Vibrant Brand Gradient</option>
                      <option value="accent">Primary Brand Accent Wash</option>
                      <option value="dark">Deep Obsidian Dark</option>
                      <option value="white">Pure Crisp White</option>
                      <option value="custom">Custom Hex Color</option>
                    </Select>
                  </div>

                  {settings.background === 'custom' && (
                    <div className="space-y-1.5">
                      <label className="font-semibold text-foreground">Custom Background Hex</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={settings.custom_bg || '#0B132B'}
                          onChange={(e) => updateSetting('custom_bg', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-border"
                        />
                        <Input
                          value={settings.custom_bg || '#0B132B'}
                          onChange={(e) => updateSetting('custom_bg', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Card Style</label>
                    <Select
                      value={settings.card_style || 'border'}
                      onChange={(e) => updateSetting('card_style', e.target.value)}
                    >
                      <option value="flat">Flat Minimalist</option>
                      <option value="border">Subtle Border Surface</option>
                      <option value="soft-shadow">Soft Elevated Shadow</option>
                      <option value="glass">Frosted Glass Blur</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Border Radius</label>
                    <Select
                      value={settings.border_radius || 'large'}
                      onChange={(e) => updateSetting('border_radius', e.target.value)}
                    >
                      <option value="none">None (0px)</option>
                      <option value="small">Small (10px - 12px)</option>
                      <option value="medium">Medium (14px - 16px)</option>
                      <option value="large">Large (18px - 20px - Modern Default)</option>
                      <option value="full">Full Pill (Capsule)</option>
                    </Select>
                  </div>
                </div>
              )}

              {/* TYPOGRAPHY TAB */}
              {activeTab === 'typography' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Heading Size Preset</label>
                    <Select
                      value={settings.heading_size || 'lg'}
                      onChange={(e) => updateSetting('heading_size', e.target.value)}
                    >
                      <option value="sm">Small (H3 scale)</option>
                      <option value="md">Medium (Standard H2)</option>
                      <option value="lg">Large (Heroic Impact)</option>
                      <option value="xl">Extra Large (Display)</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Text Alignment</label>
                    <Select
                      value={settings.alignment || 'left'}
                      onChange={(e) => updateSetting('alignment', e.target.value)}
                    >
                      <option value="left">Left-Aligned</option>
                      <option value="center">Centered</option>
                      <option value="right">Right-Aligned</option>
                    </Select>
                  </div>
                </div>
              )}

              {/* SPACING TAB */}
              {activeTab === 'spacing' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Top Padding (Spacing)</label>
                    <Select
                      value={settings.spacing_top || 'spacious'}
                      onChange={(e) => updateSetting('spacing_top', e.target.value)}
                    >
                      <option value="none">None (0px)</option>
                      <option value="compact">Compact (py-12 / 48px)</option>
                      <option value="normal">Normal (py-16 / 64px)</option>
                      <option value="spacious">Spacious (py-24 / 96px - Default)</option>
                      <option value="extra">Extra Spacious (py-32 / 128px)</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Bottom Padding (Spacing)</label>
                    <Select
                      value={settings.spacing_bottom || 'spacious'}
                      onChange={(e) => updateSetting('spacing_bottom', e.target.value)}
                    >
                      <option value="none">None (0px)</option>
                      <option value="compact">Compact (48px)</option>
                      <option value="normal">Normal (64px)</option>
                      <option value="spacious">Spacious (96px - Default)</option>
                      <option value="extra">Extra Spacious (128px)</option>
                    </Select>
                  </div>
                </div>
              )}

              {/* ANIMATION TAB */}
              {activeTab === 'animation' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Entrance Motion</label>
                    <Select
                      value={settings.animation || 'fade-up'}
                      onChange={(e) => updateSetting('animation', e.target.value)}
                    >
                      <option value="none">No Animation</option>
                      <option value="fade-up">Fade Up (Smooth Reveal)</option>
                      <option value="fade-down">Fade Down</option>
                      <option value="fade-left">Fade from Left</option>
                      <option value="fade-right">Fade from Right</option>
                      <option value="scale">Scale Up</option>
                      <option value="fade">Gentle Dissolve</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Animation Speed</label>
                    <Select
                      value={settings.animation_speed || 'normal'}
                      onChange={(e) => updateSetting('animation_speed', e.target.value)}
                    >
                      <option value="fast">Fast (0.25s)</option>
                      <option value="normal">Normal (0.45s)</option>
                      <option value="slow">Slow &amp; Cinematic (0.75s)</option>
                    </Select>
                  </div>
                </div>
              )}

              {/* VISIBILITY TAB */}
              {activeTab === 'visibility' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <div className="font-bold text-sm">Section Enabled</div>
                        <div className="text-[11px] text-muted-foreground">If turned off, this section will never render on the live site.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => setIsEnabled(e.target.checked)}
                        className="w-5 h-5 rounded text-primary"
                      />
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <div className="font-semibold text-xs text-foreground">Device Viewport Visibility</div>
                      <label className="flex items-center justify-between p-2 rounded-lg bg-background border border-border cursor-pointer">
                        <span className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-primary" /> Desktop Screens
                        </span>
                        <input
                          type="checkbox"
                          checked={desktopVisible}
                          onChange={(e) => setDesktopVisible(e.target.checked)}
                          className="w-4 h-4 rounded text-primary"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2 rounded-lg bg-background border border-border cursor-pointer">
                        <span className="flex items-center gap-2">
                          <Tablet className="w-4 h-4 text-primary" /> Tablet Screens
                        </span>
                        <input
                          type="checkbox"
                          checked={tabletVisible}
                          onChange={(e) => setTabletVisible(e.target.checked)}
                          className="w-4 h-4 rounded text-primary"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2 rounded-lg bg-background border border-border cursor-pointer">
                        <span className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-primary" /> Mobile Phones
                        </span>
                        <input
                          type="checkbox"
                          checked={mobileVisible}
                          onChange={(e) => setMobileVisible(e.target.checked)}
                          className="w-4 h-4 rounded text-primary"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ADVANCED TAB */}
              {activeTab === 'advanced' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Unique Section Key</label>
                    <Input value={section.section_key} disabled className="font-mono bg-muted" />
                    <p className="text-[11px] text-muted-foreground">Unique database anchor identifier.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">HTML Anchor ID</label>
                    <Input
                      value={settings.custom_id || ''}
                      onChange={(e) => updateSetting('custom_id', e.target.value)}
                      placeholder="e.g. specialized-services"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Custom CSS Class</label>
                    <Input
                      value={settings.custom_class || ''}
                      onChange={(e) => updateSetting('custom_class', e.target.value)}
                      placeholder="e.g. custom-border-glow"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 border-t border-border flex flex-wrap items-center justify-between gap-3 bg-card shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted transition-all"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleApply}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-xs hover:bg-muted active:scale-[0.98] transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyAndPublish}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save &amp; Publish Live</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Preview Column */}
          {showPreview && (
            <div className="hidden md:flex flex-1 bg-muted/40 flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto">
              <div className="mb-3 flex items-center justify-between w-full max-w-5xl px-2 text-xs text-muted-foreground">
                <span className="font-semibold">Live Interactive Section Preview</span>
                <span className="capitalize font-mono text-[11px]">
                  Mode: {previewDevice} ({previewDevice === 'mobile' ? '375px' : previewDevice === 'tablet' ? '768px' : '100%'})
                </span>
              </div>

              {/* Device Frame */}
              <div
                className={`bg-background border border-border rounded-2xl shadow-xl overflow-hidden transition-all duration-300 w-full ${
                  previewDevice === 'mobile'
                    ? 'max-w-[375px]'
                    : previewDevice === 'tablet'
                    ? 'max-w-[768px]'
                    : 'max-w-5xl'
                }`}
              >
                <div className="h-7 bg-muted/70 border-b border-border px-3 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <span className="text-[10px] font-mono text-muted-foreground mx-auto">
                    storefront-preview.local
                  </span>
                </div>
                <div className="p-2 sm:p-4 overflow-x-hidden">
                  <PageSectionRenderer
                    sections={[mockSectionForPreview]}
                    data={previewData}
                    isDraftPreview={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
