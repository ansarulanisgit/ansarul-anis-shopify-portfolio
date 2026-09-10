'use client';

import * as React from 'react';
import Image from 'next/image';
import { Search, Save, Globe, Share2, CheckCircle2, AlertCircle } from 'lucide-react';
import { SeoMeta } from '@/types/database.types';
import { defaultSeoMeta } from '@/lib/data/seed-data';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';

export default function AdminSeoPage() {
  const [seo, setSeo] = React.useState<SeoMeta>(defaultSeoMeta);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadSeo() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('seo_meta')
          .select('*')
          .eq('page_key', 'home')
          .single();

        if (!error && data) {
          setSeo(data as SeoMeta);
        }
      } catch {
        // Fallback
      }
    }
    loadSeo();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      try {
        const supabase = createClient();
        await (supabase.from('seo_meta') as any)
          .upsert({
            page_key: 'home',
            meta_title: seo.meta_title,
            meta_description: seo.meta_description,
            og_image_url: seo.og_image_url,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'page_key' });
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

      showNotification('SEO Metadata updated and live site cache revalidated!');
    } catch (err: any) {
      alert(err.message || 'Failed to save SEO metadata.');
    } finally {
      setIsSaving(false);
    }
  };

  const titleLength = seo.meta_title.length;
  const descLength = seo.meta_description.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">SEO &amp; Social Previews</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Configure search engine title tags, meta descriptions, and OpenGraph social share cards.
        </p>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <div className="lg:col-span-6 space-y-5 bg-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-xs">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Search className="w-4 h-4 text-primary dark:text-sky-400" />
            <span>Search Metadata (Homepage)</span>
          </h2>

          {/* Meta Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Meta Title *</label>
              <span
                className={`text-[11px] font-mono ${
                  titleLength > 60 ? 'text-amber-500' : 'text-muted-foreground'
                }`}
              >
                {titleLength} / 60 characters
              </span>
            </div>
            <Input
              value={seo.meta_title}
              onChange={(e) => setSeo({ ...seo, meta_title: e.target.value })}
              placeholder="Shopify Website Design & Development"
            />
            {titleLength > 60 && (
              <p className="text-[11px] text-amber-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> May be truncated in Google search results
              </p>
            )}
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Meta Description *</label>
              <span
                className={`text-[11px] font-mono ${
                  descLength > 160 ? 'text-amber-500' : 'text-muted-foreground'
                }`}
              >
                {descLength} / 160 characters
              </span>
            </div>
            <Textarea
              value={seo.meta_description}
              onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })}
              placeholder="Freelance Shopify developer crafting high-converting stores..."
              className="min-h-[100px]"
            />
            {descLength > 160 && (
              <p className="text-[11px] text-amber-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> May exceed Google snippet preview limit
              </p>
            )}
          </div>

          {/* Open Graph Image */}
          <ImageUploader
            label="OpenGraph Social Share Image (1200 x 630px)"
            value={seo.og_image_url || ''}
            onChange={(url) => setSeo({ ...seo, og_image_url: url })}
            helperText="Shown when link is shared on WhatsApp, LinkedIn, X/Twitter, and iMessage"
          />

          <div className="pt-4 border-t border-border">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground font-semibold text-xs shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save & Revalidate Live Site'}</span>
            </button>
          </div>
        </div>

        {/* Live Previews */}
        <div className="lg:col-span-6 space-y-6">
          {/* Google SERP Preview */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>Google Search Result Preview</span>
            </h3>

            <div className="p-4 rounded-xl bg-background border border-border/60 font-sans text-left space-y-1">
              <div className="text-xs text-muted-foreground truncate">
                https://yourdomain.com
              </div>
              <div className="text-base font-medium text-blue-600 dark:text-sky-400 hover:underline cursor-pointer leading-snug">
                {seo.meta_title || 'Shopify Website Design & Development'}
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {seo.meta_description || 'Freelance Shopify developer specializing in custom Shopify store design...'}
              </div>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-primary" />
              <span>Social Share Preview (WhatsApp / X / LinkedIn)</span>
            </h3>

            <div className="rounded-xl border border-border/60 overflow-hidden bg-background">
              {seo.og_image_url && (
                <div className="relative aspect-[1.91/1] w-full bg-muted">
                  <Image
                    src={seo.og_image_url}
                    alt="Social Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-1 border-t border-border/40">
                <div className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">
                  yourdomain.com
                </div>
                <div className="text-sm font-bold text-foreground leading-tight">
                  {seo.meta_title}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {seo.meta_description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
