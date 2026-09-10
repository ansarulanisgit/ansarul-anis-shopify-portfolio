import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { initialDefaultSections } from '@/lib/sections/defaults';
import { PageSection } from '@/types/database.types';
import { revalidatePath, revalidateTag } from 'next/cache';
import { readSectionsFromStorage, writeSectionsToStorage, readSettingsFromStorage, writeSettingsToStorage } from '@/lib/data/storage';

function revalidateAllCaches() {
  try {
    revalidatePath('/');
    revalidatePath('/?preview=draft');
    revalidateTag('site-data');
    revalidateTag('page-sections');
    revalidateTag('site-settings');
  } catch (e) {
    console.warn('Cache revalidation error:', e);
  }
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder'));
}

function isValidUuid(str?: string): boolean {
  return (
    typeof str === 'string' &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str)
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageKey = searchParams.get('pageKey') || searchParams.get('page_key') || 'home';
  const includeDrafts = searchParams.get('includeDrafts') === 'true' || searchParams.get('include_drafts') === 'true';

  if (!isSupabaseConfigured()) {
    const all = readSectionsFromStorage(pageKey);
    const filtered = all
      .filter((s) => s.page_key === pageKey)
      .filter((s) => {
        if (includeDrafts) return true;
        return s.status === 'published' && s.is_enabled !== false;
      })
      .sort((a, b) => a.order_index - b.order_index);

    return NextResponse.json({
      success: true,
      data: filtered,
      source: 'local_storage',
    });
  }

  try {
    const supabase = createAdminSupabaseClient();
    let query = supabase
      .from('page_sections')
      .select('*')
      .eq('page_key', pageKey)
      .order('order_index', { ascending: true });

    if (!includeDrafts) {
      query = query.eq('status', 'published').eq('is_enabled', true);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      const all = readSectionsFromStorage(pageKey);
      return NextResponse.json({
        success: true,
        data: all.filter((s) => s.page_key === pageKey),
        source: 'local_fallback',
      });
    }

    return NextResponse.json({ success: true, data, source: 'supabase' });
  } catch (err: any) {
    const all = readSectionsFromStorage(pageKey);
    return NextResponse.json({
      success: true,
      data: all.filter((s) => s.page_key === pageKey),
      source: 'error_fallback',
      error: err.message,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sections, pageKey = 'home', sectionId, sectionKey } = body;

    let currentSections = readSectionsFromStorage(pageKey);

    if (action === 'publish') {
      const publishedSections = (sections as PageSection[]).map((sec) => ({
        ...sec,
        status: 'published' as const,
        settings: sec.draft_settings || sec.settings || {},
        draft_settings: null,
        updated_at: new Date().toISOString(),
      }));

      // 1. Supabase First
      if (isSupabaseConfigured()) {
        try {
          const supabase = createAdminSupabaseClient();
          for (const sec of publishedSections) {
            const payload: any = {
              page_key: sec.page_key || pageKey,
              section_key: sec.section_key,
              section_type: sec.section_type,
              title: sec.title,
              order_index: sec.order_index,
              is_enabled: sec.is_enabled !== false,
              is_visible: sec.is_visible !== false,
              desktop_visible: sec.desktop_visible !== false,
              tablet_visible: sec.tablet_visible !== false,
              mobile_visible: sec.mobile_visible !== false,
              status: 'published',
              settings: sec.settings || {},
              draft_settings: null,
              updated_at: new Date().toISOString(),
            };

            if (isValidUuid(sec.id)) {
              payload.id = sec.id;
            }

            await (supabase.from('page_sections') as any).upsert(payload, {
              onConflict: 'section_key',
            });

            // If hero section has hero_trust_chips, sync to site_settings
            if ((sec.section_key === 'home_hero' || sec.section_type === 'hero') && sec.settings?.hero_trust_chips) {
              try {
                const { data: existingHeroSetting } = await supabase.from('site_settings').select('value').eq('key', 'hero').maybeSingle();
                const existingVal = existingHeroSetting?.value || {};
                await (supabase.from('site_settings') as any).upsert({
                  key: 'hero',
                  value: { ...existingVal, hero_trust_chips: sec.settings.hero_trust_chips },
                  updated_at: new Date().toISOString(),
                }, { onConflict: 'key' });
              } catch (heroSyncErr) {
                console.error('Error syncing hero trust chips to site_settings:', heroSyncErr);
              }
            }
          }
        } catch (supabaseErr) {
          console.error('Supabase sync error:', supabaseErr);
        }
      }

      // 2. Safe storage update
      try {
        writeSectionsToStorage(publishedSections);
        const heroSec = publishedSections.find((s) => s.section_key === 'home_hero' || s.section_type === 'hero');
        if (heroSec?.settings?.hero_trust_chips) {
          writeSettingsToStorage({ hero_trust_chips: heroSec.settings.hero_trust_chips });
        }
      } catch (storageErr) {
        console.warn('Storage sync warning:', storageErr);
      }

      // Revalidate all caches immediately
      revalidateAllCaches();

      return NextResponse.json({
        success: true,
        message: 'Sections published and live site revalidated successfully.',
        data: publishedSections,
      });
    }

    if (action === 'save_draft') {
      const draftSections = (sections as PageSection[]).map((sec) => ({
        ...sec,
        status: 'draft' as const,
        draft_settings: sec.draft_settings || sec.settings || {},
        updated_at: new Date().toISOString(),
      }));

      // 1. Supabase First
      if (isSupabaseConfigured()) {
        try {
          const supabase = createAdminSupabaseClient();
          for (const sec of draftSections) {
            const payload: any = {
              page_key: sec.page_key || pageKey,
              section_key: sec.section_key,
              section_type: sec.section_type,
              title: sec.title,
              order_index: sec.order_index,
              is_enabled: sec.is_enabled !== false,
              is_visible: sec.is_visible !== false,
              desktop_visible: sec.desktop_visible !== false,
              tablet_visible: sec.tablet_visible !== false,
              mobile_visible: sec.mobile_visible !== false,
              status: 'draft',
              draft_settings: sec.draft_settings,
              updated_at: new Date().toISOString(),
            };

            if (isValidUuid(sec.id)) {
              payload.id = sec.id;
            }

            await (supabase.from('page_sections') as any).upsert(payload, {
              onConflict: 'section_key',
            });
          }
        } catch (supabaseErr) {
          console.error('Supabase draft sync error:', supabaseErr);
        }
      }

      // 2. Safe storage update
      try {
        writeSectionsToStorage(draftSections);
      } catch (storageErr) {
        console.warn('Storage draft sync warning:', storageErr);
      }

      revalidateAllCaches();

      return NextResponse.json({
        success: true,
        message: 'Draft saved successfully without affecting the public site.',
        data: draftSections,
      });
    }

    if (action === 'reorder') {
      const reordered = (sections as PageSection[]).map((sec, idx) => ({
        ...sec,
        order_index: idx,
        updated_at: new Date().toISOString(),
      }));

      if (isSupabaseConfigured()) {
        try {
          const supabase = createAdminSupabaseClient();
          for (const sec of reordered) {
            if (isValidUuid(sec.id)) {
              await (supabase.from('page_sections') as any).update({ order_index: sec.order_index }).eq('id', sec.id);
            } else if (sec.section_key) {
              await (supabase.from('page_sections') as any).update({ order_index: sec.order_index }).eq('section_key', sec.section_key);
            }
          }
        } catch (supabaseErr) {
          console.error('Supabase reorder sync error:', supabaseErr);
        }
      }

      try {
        writeSectionsToStorage(reordered);
      } catch {}

      revalidateAllCaches();
      return NextResponse.json({ success: true, message: 'Sections reordered.', data: reordered });
    }

    if (action === 'delete') {
      const remaining = currentSections
        .filter((s) => s.id !== sectionId && s.section_key !== sectionKey)
        .map((s, idx) => ({ ...s, order_index: idx }));

      if (isSupabaseConfigured() && (sectionId || sectionKey)) {
        try {
          const supabase = createAdminSupabaseClient();
          if (isValidUuid(sectionId)) {
            await supabase.from('page_sections').delete().eq('id', sectionId);
          } else if (sectionKey) {
            await supabase.from('page_sections').delete().eq('section_key', sectionKey);
          }
        } catch (supabaseErr) {
          console.error('Supabase delete error:', supabaseErr);
        }
      }

      try {
        writeSectionsToStorage(remaining);
      } catch {}

      revalidateAllCaches();

      return NextResponse.json({ success: true, message: 'Section removed successfully.', data: remaining });
    }

    if (action === 'reset') {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createAdminSupabaseClient();
          for (const sec of initialDefaultSections) {
            const payload: any = {
              page_key: sec.page_key || 'home',
              section_key: sec.section_key,
              section_type: sec.section_type,
              title: sec.title,
              order_index: sec.order_index,
              is_enabled: sec.is_enabled !== false,
              is_visible: sec.is_visible !== false,
              desktop_visible: sec.desktop_visible !== false,
              tablet_visible: sec.tablet_visible !== false,
              mobile_visible: sec.mobile_visible !== false,
              status: 'published',
              settings: sec.settings || {},
              draft_settings: null,
              updated_at: new Date().toISOString(),
            };
            await (supabase.from('page_sections') as any).upsert(payload, { onConflict: 'section_key' });
          }
        } catch (supabaseErr) {
          console.error('Supabase reset error:', supabaseErr);
        }
      }

      try {
        writeSectionsToStorage(initialDefaultSections);
      } catch {}

      revalidateAllCaches();
      return NextResponse.json({ success: true, message: 'Sections reset to defaults.', data: initialDefaultSections });
    }

    return NextResponse.json({ success: true, message: 'Action processed.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
