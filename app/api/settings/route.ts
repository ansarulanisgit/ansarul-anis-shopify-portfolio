import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { readSettingsFromStorage, writeSettingsToStorage, readSectionsFromStorage, writeSectionsToStorage } from '@/lib/data/storage';
import { defaultSiteSettings } from '@/lib/data/seed-data';
import { revalidatePath, revalidateTag } from 'next/cache';

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

        // Complete 2-way sync: Sync settings updates to page_sections in Supabase
        try {
          const { data: allSections } = await supabase
            .from('page_sections')
            .select('*');

          if (allSections && allSections.length > 0) {
            for (const sec of allSections) {
              let secModified = false;
              const currentSettings = { ...(sec.settings || {}) };

              // Sync Hero
              if (sec.section_key === 'home_hero' || sec.section_type === 'hero') {
                if (body.hero_eyebrow || body.hero?.hero_eyebrow) {
                  currentSettings.eyebrow = body.hero_eyebrow || body.hero?.hero_eyebrow;
                  secModified = true;
                }
                if (body.hero_headline || body.hero?.hero_headline) {
                  currentSettings.heading = body.hero_headline || body.hero?.hero_headline;
                  secModified = true;
                }
                if (body.hero_headline_prefix || body.hero?.hero_headline_prefix) {
                  currentSettings.heading_prefix = body.hero_headline_prefix || body.hero?.hero_headline_prefix;
                  secModified = true;
                }
                if (body.hero_subheadline || body.hero?.hero_subheadline) {
                  currentSettings.subheading = body.hero_subheadline || body.hero?.hero_subheadline;
                  secModified = true;
                }
                if (body.hero_rotating_words || body.hero?.hero_rotating_words) {
                  currentSettings.rotating_words = body.hero_rotating_words || body.hero?.hero_rotating_words;
                  secModified = true;
                }
                if (body.hero_trust_chips || body.hero?.hero_trust_chips) {
                  currentSettings.hero_trust_chips = body.hero_trust_chips || body.hero?.hero_trust_chips;
                  secModified = true;
                }
                if (body.hero_primary_cta_label || body.hero?.hero_primary_cta_label) {
                  currentSettings.primary_cta_label = body.hero_primary_cta_label || body.hero?.hero_primary_cta_label;
                  secModified = true;
                }
                if (body.hero_secondary_cta_label || body.hero?.hero_secondary_cta_label) {
                  currentSettings.secondary_cta_label = body.hero_secondary_cta_label || body.hero?.hero_secondary_cta_label;
                  secModified = true;
                }
                if (body.hero_secondary_cta_url || body.hero?.hero_secondary_cta_url) {
                  currentSettings.secondary_cta_url = body.hero_secondary_cta_url || body.hero?.hero_secondary_cta_url;
                  secModified = true;
                }
                if (body.hero_graphic_url || body.hero?.hero_graphic_url) {
                  currentSettings.image_url = body.hero_graphic_url || body.hero?.hero_graphic_url;
                  secModified = true;
                }
              }

              // Sync Trust Bar
              if ((sec.section_key === 'home_trust_bar' || sec.section_type === 'trust_bar') && body.trust_stats) {
                currentSettings.blocks = body.trust_stats.map((ts: any, i: number) => ({
                  id: ts.id || `ts-${i + 1}`,
                  type: 'stat',
                  stat_value: ts.value,
                  stat_label: ts.label,
                }));
                secModified = true;
              }

              // Sync About
              if (sec.section_key === 'home_about' || sec.section_type === 'about') {
                if (body.about_text) {
                  currentSettings.description = Array.isArray(body.about_text) ? body.about_text.join('\n\n') : body.about_text;
                  secModified = true;
                }
                if (body.about_tools) {
                  currentSettings.tools = body.about_tools;
                  secModified = true;
                }
                if (body.availability_line) {
                  currentSettings.availability_line = body.availability_line;
                  secModified = true;
                }
                if (body.about_photo_url) {
                  currentSettings.image_url = body.about_photo_url;
                  secModified = true;
                }
              }

              // Sync Contact
              if (sec.section_key === 'home_contact' || sec.section_type === 'contact') {
                if (body.whatsapp_number) {
                  currentSettings.whatsapp_number = body.whatsapp_number;
                  secModified = true;
                }
                if (body.whatsapp_message) {
                  currentSettings.whatsapp_prefill = body.whatsapp_message;
                  secModified = true;
                }
              }

              if (secModified) {
                await (supabase.from('page_sections') as any)
                  .update({
                    settings: currentSettings,
                    draft_settings: null,
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', sec.id);
              }
            }
          }
        } catch (secSyncErr) {
          console.error('Error syncing settings into page_sections in Supabase:', secSyncErr);
        }
      } catch (supabaseErr) {
        console.error('Supabase settings sync error:', supabaseErr);
      }
    }

    // Sync to local sections file as well
    try {
      const localSections = readSectionsFromStorage('home');
      let localModified = false;
      const updatedLocalSections = localSections.map((s) => {
        const currentSettings = { ...(s.settings || {}) };
        let sMod = false;

        if (s.section_key === 'home_hero' || s.section_type === 'hero') {
          if (body.hero_eyebrow || body.hero?.hero_eyebrow) {
            currentSettings.eyebrow = body.hero_eyebrow || body.hero?.hero_eyebrow;
            sMod = true;
          }
          if (body.hero_headline || body.hero?.hero_headline) {
            currentSettings.heading = body.hero_headline || body.hero?.hero_headline;
            sMod = true;
          }
          if (body.hero_headline_prefix || body.hero?.hero_headline_prefix) {
            currentSettings.heading_prefix = body.hero_headline_prefix || body.hero?.hero_headline_prefix;
            sMod = true;
          }
          if (body.hero_subheadline || body.hero?.hero_subheadline) {
            currentSettings.subheading = body.hero_subheadline || body.hero?.hero_subheadline;
            sMod = true;
          }
          if (body.hero_rotating_words || body.hero?.hero_rotating_words) {
            currentSettings.rotating_words = body.hero_rotating_words || body.hero?.hero_rotating_words;
            sMod = true;
          }
          if (body.hero_trust_chips || body.hero?.hero_trust_chips) {
            currentSettings.hero_trust_chips = body.hero_trust_chips || body.hero?.hero_trust_chips;
            sMod = true;
          }
          if (body.hero_primary_cta_label || body.hero?.hero_primary_cta_label) {
            currentSettings.primary_cta_label = body.hero_primary_cta_label || body.hero?.hero_primary_cta_label;
            sMod = true;
          }
          if (body.hero_secondary_cta_label || body.hero?.hero_secondary_cta_label) {
            currentSettings.secondary_cta_label = body.hero_secondary_cta_label || body.hero?.hero_secondary_cta_label;
            sMod = true;
          }
          if (body.hero_secondary_cta_url || body.hero?.hero_secondary_cta_url) {
            currentSettings.secondary_cta_url = body.hero_secondary_cta_url || body.hero?.hero_secondary_cta_url;
            sMod = true;
          }
          if (body.hero_graphic_url || body.hero?.hero_graphic_url) {
            currentSettings.image_url = body.hero_graphic_url || body.hero?.hero_graphic_url;
            sMod = true;
          }
        }

        if ((s.section_key === 'home_trust_bar' || s.section_type === 'trust_bar') && body.trust_stats) {
          currentSettings.blocks = body.trust_stats.map((ts: any, i: number) => ({
            id: ts.id || `ts-${i + 1}`,
            type: 'stat',
            stat_value: ts.value,
            stat_label: ts.label,
          }));
          sMod = true;
        }

        if (s.section_key === 'home_about' || s.section_type === 'about') {
          if (body.about_text) {
            currentSettings.description = Array.isArray(body.about_text) ? body.about_text.join('\n\n') : body.about_text;
            sMod = true;
          }
          if (body.about_tools) {
            currentSettings.tools = body.about_tools;
            sMod = true;
          }
          if (body.availability_line) {
            currentSettings.availability_line = body.availability_line;
            sMod = true;
          }
        }

        if (sMod) {
          localModified = true;
          return { ...s, settings: currentSettings, draft_settings: null };
        }
        return s;
      });

      if (localModified) {
        writeSectionsToStorage(updatedLocalSections);
      }
    } catch (err) {
      console.error('Error writing synchronized settings to local sections:', err);
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin', 'layout');
      revalidatePath('/admin/settings');
      revalidatePath('/admin/builder');
      revalidateTag('site-settings');
      revalidateTag('site-data');
      revalidateTag('page-sections');
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
