import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { readSettingsFromStorage, writeSettingsToStorage, readSectionsFromStorage, writeSectionsToStorage } from '@/lib/data/storage';
import { defaultSiteSettings } from '@/lib/data/seed-data';
import { revalidatePath } from 'next/cache';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder'));
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    try {
      const settings = readSettingsFromStorage();
      return NextResponse.json({ success: true, data: settings, source: 'local' });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from('site_settings').select('key, value');

    if (error || !data || data.length === 0) {
      const local = readSettingsFromStorage();
      return NextResponse.json({ success: true, data: local, source: 'fallback' });
    }

    const settingsMap = { ...defaultSiteSettings };
    for (const item of data) {
      if (typeof item.value === 'object' && item.value !== null) {
        if (item.key === 'appearance') {
          settingsMap.appearance = { ...settingsMap.appearance, ...(item.value as any) };
        } else {
          Object.assign(settingsMap, item.value);
        }
      }
    }

    return NextResponse.json({ success: true, data: settingsMap, source: 'supabase' });
  } catch (err: any) {
    const local = readSettingsFromStorage();
    return NextResponse.json({ success: true, data: local, source: 'error_fallback' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1. Write to local storage
    const updatedLocal = writeSettingsToStorage(body);

    // 2. Upsert to Supabase site_settings if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        
        // Map settings payload into key-value pairs
        const entries: { key: string; value: any }[] = [];

        if (body.site_name || body.developer_name || body.nav_cta_label || body.social_links) {
          entries.push({
            key: 'general',
            value: {
              site_name: body.site_name || updatedLocal.site_name,
              developer_name: body.developer_name || updatedLocal.developer_name,
              nav_cta_label: body.nav_cta_label || updatedLocal.nav_cta_label,
              social_links: body.social_links || updatedLocal.social_links,
            },
          });
        }

        if (body.hero_eyebrow || body.hero_headline || body.hero_subheadline || body.hero_primary_cta_label || body.hero_graphic_url || body.hero_rotating_words || body.hero_trust_chips) {
          entries.push({
            key: 'hero',
            value: {
              hero_eyebrow: body.hero_eyebrow || updatedLocal.hero_eyebrow,
              hero_headline: body.hero_headline || updatedLocal.hero_headline,
              hero_headline_prefix: body.hero_headline_prefix || updatedLocal.hero_headline_prefix,
              hero_rotating_words: body.hero_rotating_words || updatedLocal.hero_rotating_words,
              hero_trust_chips: body.hero_trust_chips || updatedLocal.hero_trust_chips,
              hero_subheadline: body.hero_subheadline || updatedLocal.hero_subheadline,
              hero_primary_cta_label: body.hero_primary_cta_label || updatedLocal.hero_primary_cta_label,
              hero_secondary_cta_label: body.hero_secondary_cta_label || updatedLocal.hero_secondary_cta_label,
              hero_secondary_cta_url: body.hero_secondary_cta_url || updatedLocal.hero_secondary_cta_url,
              hero_graphic_url: body.hero_graphic_url || updatedLocal.hero_graphic_url,
            },
          });
        }

        if (body.trust_stats) {
          entries.push({ key: 'trust_bar', value: { trust_stats: body.trust_stats } });
        }

        if (body.about_photo_url || body.about_text || body.availability_line || body.about_tools) {
          entries.push({
            key: 'about',
            value: {
              about_photo_url: body.about_photo_url || updatedLocal.about_photo_url,
              about_text: body.about_text || updatedLocal.about_text,
              availability_line: body.availability_line || updatedLocal.availability_line,
              about_tools: body.about_tools || updatedLocal.about_tools,
            },
          });
        }

        if (body.whatsapp_number || body.whatsapp_message) {
          entries.push({
            key: 'contact',
            value: {
              whatsapp_number: body.whatsapp_number || updatedLocal.whatsapp_number,
              whatsapp_message: body.whatsapp_message || updatedLocal.whatsapp_message,
            },
          });
        }

        if (body.appearance) {
          entries.push({ key: 'appearance', value: body.appearance });
        }

        // Direct tab payloads e.g. { general: {...} }, { appearance: {...} }
        for (const k of ['general', 'hero', 'trust_bar', 'about', 'contact', 'appearance']) {
          if (body[k] && typeof body[k] === 'object') {
            entries.push({ key: k, value: body[k] });
          }
        }

        for (const entry of entries) {
          await (supabase.from('site_settings') as any).upsert(
            { key: entry.key, value: entry.value, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          );
        }

        // Sync hero_trust_chips to page_sections in Supabase if present
        const trustChipsPayload = body.hero_trust_chips || body.hero?.hero_trust_chips;
        if (trustChipsPayload && Array.isArray(trustChipsPayload)) {
          try {
            const { data: heroSections } = await supabase
              .from('page_sections')
              .select('*')
              .eq('section_key', 'home_hero')
              .limit(1);

            if (heroSections && heroSections.length > 0) {
              const heroSec = heroSections[0];
              const updatedSettings = {
                ...(heroSec.settings || {}),
                hero_trust_chips: trustChipsPayload,
              };
              const updatedDraftSettings = heroSec.draft_settings
                ? { ...(heroSec.draft_settings || {}), hero_trust_chips: trustChipsPayload }
                : null;

              await (supabase.from('page_sections') as any)
                .update({
                  settings: updatedSettings,
                  draft_settings: updatedDraftSettings,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', heroSec.id);
            }
          } catch (secErr) {
            console.error('Error syncing hero trust chips to page_sections in Supabase:', secErr);
          }
        }
      } catch (supabaseErr) {
        console.error('Supabase settings sync error:', supabaseErr);
      }
    }

    // Sync trust chips to local sections file if present
    const trustChips = body.hero_trust_chips || body.hero?.hero_trust_chips;
    if (trustChips && Array.isArray(trustChips)) {
      try {
        const localSections = readSectionsFromStorage('home');
        let modified = false;
        const updated = localSections.map((s) => {
          if (s.section_key === 'home_hero' || s.section_type === 'hero') {
            modified = true;
            return {
              ...s,
              settings: { ...(s.settings || {}), hero_trust_chips: trustChips },
              draft_settings: s.draft_settings
                ? { ...(s.draft_settings || {}), hero_trust_chips: trustChips }
                : s.draft_settings,
            };
          }
          return s;
        });
        if (modified) {
          writeSectionsToStorage(updated);
        }
      } catch (err) {
        console.error('Error writing trust chips to local sections:', err);
      }
    }

    try {
      revalidatePath('/');
      revalidatePath('/?preview=draft');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Settings saved to database and local storage successfully.',
      data: updatedLocal,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
