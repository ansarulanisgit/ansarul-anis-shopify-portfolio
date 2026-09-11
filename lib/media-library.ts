import { createClient } from '@/lib/supabase/client';
import { defaultProjects, defaultTestimonials, defaultSiteSettings } from '@/lib/data/seed-data';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  source?: 'storage' | 'system' | 'custom';
}

const LOCAL_STORAGE_KEY = 'portfolio_media_library_items';
const EVENT_NAME = 'media-library-updated';

// Built-in / default media assets from seed data
const initialDefaultMedia: MediaItem[] = [
  ...defaultProjects.map((p: any) => ({
    id: `project-${p.id}`,
    name: `${p.title} (Cover)`,
    url: p.cover_image || (p.images && p.images[0] ? p.images[0].image_url : '') || '',
    uploadedAt: 'System Asset',
    source: 'system' as const,
  })).filter((item: any) => Boolean(item.url)),
  ...defaultTestimonials.map((t: any) => ({
    id: `testimonial-${t.id}`,
    name: `${t.client_name} (${t.client_company})`,
    url: t.avatar_url,
    uploadedAt: 'System Asset',
    source: 'system' as const,
  })).filter((item: any) => Boolean(item.url)),
  {
    id: 'setting-developer-avatar',
    name: 'Developer Profile Portrait',
    url: (defaultSiteSettings as any).about_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    uploadedAt: 'System Asset',
    source: 'system',
  },
  {
    id: 'setting-hero-image',
    name: 'Hero Showcase Image',
    url: (defaultSiteSettings as any).hero_graphic_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    uploadedAt: 'System Asset',
    source: 'system',
  },
];

export async function fetchAllMediaItems(): Promise<MediaItem[]> {
  const itemsMap = new Map<string, MediaItem>();

  // 1. Add default system media
  initialDefaultMedia.forEach((item) => {
    if (item.url) itemsMap.set(item.url, item);
  });

  // 2. Add local storage items
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: MediaItem[] = JSON.parse(stored);
        parsed.forEach((item) => {
          if (item.url) itemsMap.set(item.url, item);
        });
      }
    } catch (e) {
      console.warn('Failed to load local media library:', e);
    }
  }

  // 3. Fetch uploaded assets from Supabase Storage
  try {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from('portfolio-assets').list('uploads', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (!error && data && data.length > 0) {
      data.forEach((file) => {
        if (!file.name || file.name === '.emptyFolderPlaceholder') return;
        const filePath = `uploads/${file.name}`;
        const { data: { publicUrl } } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
        
        if (publicUrl && !itemsMap.has(publicUrl)) {
          itemsMap.set(publicUrl, {
            id: `storage-${file.id || file.name}`,
            name: file.name.replace(/^\d+-/, ''),
            url: publicUrl,
            uploadedAt: file.created_at ? new Date(file.created_at).toLocaleDateString() : 'Recently',
            source: 'storage',
          });
        }
      });
    }
  } catch (err) {
    console.warn('Supabase storage fetch skipped or unavailable:', err);
  }

  return Array.from(itemsMap.values());
}

export function addMediaItem(item: { name: string; url: string }) {
  if (typeof window === 'undefined' || !item.url) return;

  try {
    const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: MediaItem[] = existing ? JSON.parse(existing) : [];
    
    // Check duplicate URL
    if (!list.some((m) => m.url === item.url)) {
      const newItem: MediaItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: item.name || `Uploaded Asset ${list.length + 1}`,
        url: item.url,
        uploadedAt: new Date().toLocaleDateString(),
        source: 'custom',
      };
      const updated = [newItem, ...list];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }
  } catch (e) {
    console.warn('Failed to save to local media library:', e);
  }
}

export function deleteMediaItem(id: string, url?: string) {
  if (typeof window === 'undefined') return;

  try {
    const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existing) {
      const list: MediaItem[] = JSON.parse(existing);
      const updated = list.filter((m) => m.id !== id && m.url !== url);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }

    // Try deleting from Supabase Storage if it's a storage URL
    if (url && url.includes('portfolio-assets/object/public/portfolio-assets/uploads/')) {
      const fileName = url.split('/').pop();
      if (fileName) {
        const supabase = createClient();
        supabase.storage.from('portfolio-assets').remove([`uploads/${fileName}`]).then(({ error }) => {
          if (error) console.warn('Storage delete error:', error.message);
        });
      }
    }

    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (e) {
    console.warn('Failed to delete media item:', e);
  }
}

export function subscribeMediaChanges(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
}
