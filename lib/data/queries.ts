import { cache } from 'react';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import {
  defaultSiteSettings,
  defaultSeoMeta,
  defaultServices,
  defaultProjects,
  defaultTestimonials,
  defaultFaqs,
  defaultLeads,
} from './seed-data';
import { initialDefaultSections } from '@/lib/sections/defaults';
import {
  Project,
  Service,
  Testimonial,
  FAQ,
  SiteSettingsMap,
  SeoMeta,
  Lead,
  PageSection,
} from '@/types/database.types';

import { readSectionsFromStorage, readSettingsFromStorage } from '@/lib/data/storage';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder'));
}

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  if (!isSupabaseConfigured()) {
    return readSettingsFromStorage();
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error || !data || data.length === 0) {
      return readSettingsFromStorage();
    }

    const localSettings = readSettingsFromStorage();
    const settingsMap = { ...localSettings };
    for (const item of data) {
      if (typeof item.value === 'object' && item.value !== null) {
        if (item.key === 'appearance') {
          settingsMap.appearance = { ...settingsMap.appearance, ...(item.value as any) };
        } else {
          Object.assign(settingsMap, item.value);
        }
      }
    }
    return settingsMap;
  } catch (err) {
    console.warn('Error fetching site_settings from Supabase, using fallback:', err);
    return readSettingsFromStorage();
  }
}

export async function getSeoMeta(pageKey: string = 'home'): Promise<SeoMeta> {
  if (!isSupabaseConfigured()) {
    return defaultSeoMeta;
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('seo_meta')
      .select('*')
      .eq('page_key', pageKey)
      .single();

    if (error || !data) {
      return defaultSeoMeta;
    }

    return data as SeoMeta;
  } catch {
    return defaultSeoMeta;
  }
}

export async function getProjects(publishedOnly: boolean = true): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return publishedOnly
      ? defaultProjects.filter((p) => p.status === 'published').sort((a, b) => a.order_index - b.order_index)
      : defaultProjects;
  }

  try {
    const supabase = createAdminSupabaseClient();
    let query = supabase
      .from('projects')
      .select('*, images:project_images(*)');

    if (publishedOnly) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query
      .order('featured', { ascending: false })
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultProjects;
    }

    return data as Project[];
  } catch {
    return defaultProjects;
  }
}

export async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return defaultServices.sort((a, b) => a.order_index - b.order_index);
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultServices;
    }

    return data as Service[];
  } catch {
    return defaultServices;
  }
}

export async function getTestimonials(featuredOnly: boolean = true): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return featuredOnly
      ? defaultTestimonials.filter((t) => t.featured).sort((a, b) => a.order_index - b.order_index)
      : defaultTestimonials;
  }

  try {
    const supabase = createAdminSupabaseClient();
    let query = supabase.from('testimonials').select('*');

    if (featuredOnly) {
      query = query.eq('featured', true);
    }

    const { data, error } = await query.order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultTestimonials;
    }

    return data as Testimonial[];
  } catch {
    return defaultTestimonials;
  }
}

export async function getFaqs(): Promise<FAQ[]> {
  if (!isSupabaseConfigured()) {
    return defaultFaqs.sort((a, b) => a.order_index - b.order_index);
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultFaqs;
    }

    return data as FAQ[];
  } catch {
    return defaultFaqs;
  }
}

export async function getLeads(): Promise<Lead[]> {
  if (!isSupabaseConfigured()) {
    return defaultLeads;
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return defaultLeads;
    }

    return data as Lead[];
  } catch {
    return defaultLeads;
  }
}

export async function getPageSections(
  pageKey: string = 'home',
  includeDrafts: boolean = false
): Promise<PageSection[]> {
  if (!isSupabaseConfigured()) {
    const all = readSectionsFromStorage(pageKey);
    return all
      .filter((s) => s.page_key === pageKey)
      .filter((s) => {
        if (includeDrafts) return true;
        return s.status === 'published' && s.is_enabled !== false;
      })
      .map((s) => {
        if (includeDrafts && s.draft_settings) {
          return { ...s, settings: { ...s.settings, ...s.draft_settings } };
        }
        return s;
      })
      .sort((a, b) => a.order_index - b.order_index);
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
      const fallback = readSectionsFromStorage(pageKey);
      return fallback
        .filter((s) => s.page_key === pageKey)
        .filter((s) => {
          if (includeDrafts) return true;
          return s.status === 'published' && s.is_enabled !== false;
        })
        .sort((a, b) => a.order_index - b.order_index);
    }

    return (data as PageSection[]).map((s) => {
      if (includeDrafts && s.draft_settings) {
        return { ...s, settings: { ...s.settings, ...s.draft_settings } };
      }
      return s;
    });
  } catch (err) {
    console.warn('Error fetching page_sections from Supabase, using storage fallback:', err);
    const fallback = readSectionsFromStorage(pageKey);
    return fallback.filter((s) => s.page_key === pageKey);
  }
}

