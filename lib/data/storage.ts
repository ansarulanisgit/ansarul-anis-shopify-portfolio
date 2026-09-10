import fs from 'fs';
import path from 'path';
import os from 'os';
import { PageSection, SiteSettingsMap } from '@/types/database.types';
import { initialDefaultSections } from '@/lib/sections/defaults';
import { defaultSiteSettings } from '@/lib/data/seed-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const SECTIONS_FILE = path.join(DATA_DIR, 'sections.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Writable directory fallback for serverless environments (e.g. Vercel Lambda /var/task read-only)
const TMP_DIR = path.join(os.tmpdir(), 'anisshopify_data');
const TMP_SECTIONS_FILE = path.join(TMP_DIR, 'sections.json');
const TMP_SETTINGS_FILE = path.join(TMP_DIR, 'settings.json');

// In-memory runtime cache for the serverless container lifetime
let memorySections: PageSection[] | null = null;
let memorySettings: SiteSettingsMap | null = null;

function tryEnsureDir(dirPath: string): boolean {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}

function safeWriteFile(primaryFile: string, fallbackFile: string, content: string): boolean {
  // 1. Try writing to primary project data dir (works in local dev / persistent file systems)
  try {
    const primaryDir = path.dirname(primaryFile);
    if (tryEnsureDir(primaryDir)) {
      fs.writeFileSync(primaryFile, content, 'utf-8');
      return true;
    }
  } catch {
    // EROFS is expected on Vercel / AWS Lambda read-only filesystems. Proceed to fallback.
  }

  // 2. Try writing to /tmp directory (writable in serverless environments)
  try {
    const fallbackDir = path.dirname(fallbackFile);
    if (tryEnsureDir(fallbackDir)) {
      fs.writeFileSync(fallbackFile, content, 'utf-8');
      return true;
    }
  } catch (tmpErr: any) {
    console.warn('Storage fallback to tmp also failed:', tmpErr?.message);
  }

  return false;
}

export function readSectionsFromStorage(pageKey: string = 'home'): PageSection[] {
  // 1. In-memory cache first
  if (memorySections && Array.isArray(memorySections) && memorySections.length > 0) {
    return memorySections;
  }

  // 2. Check writable tmp storage (if written earlier in this serverless session)
  try {
    if (fs.existsSync(TMP_SECTIONS_FILE)) {
      const raw = fs.readFileSync(TMP_SECTIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memorySections = parsed;
        return parsed;
      }
    }
  } catch {}

  // 3. Check bundled project data directory
  try {
    if (fs.existsSync(SECTIONS_FILE)) {
      const raw = fs.readFileSync(SECTIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memorySections = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading sections from storage, falling back to defaults:', err);
  }

  // 4. Return initial default sections (do not write to disk to prevent EROFS)
  memorySections = initialDefaultSections;
  return initialDefaultSections;
}

export function writeSectionsToStorage(sections: PageSection[]): void {
  // Always update in-memory cache
  memorySections = sections;

  try {
    const content = JSON.stringify(sections, null, 2);
    safeWriteFile(SECTIONS_FILE, TMP_SECTIONS_FILE, content);
  } catch (err: any) {
    console.warn('writeSectionsToStorage caught non-fatal warning:', err?.message);
  }
}

export function readSettingsFromStorage(): SiteSettingsMap {
  // 1. In-memory cache first
  if (memorySettings && typeof memorySettings === 'object') {
    return memorySettings;
  }

  // 2. Check writable tmp storage
  try {
    if (fs.existsSync(TMP_SETTINGS_FILE)) {
      const raw = fs.readFileSync(TMP_SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const result: SiteSettingsMap = { ...defaultSiteSettings, ...parsed };
        memorySettings = result;
        return result;
      }
    }
  } catch {}

  // 3. Check bundled project data directory
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const result: SiteSettingsMap = { ...defaultSiteSettings, ...parsed };
        memorySettings = result;
        return result;
      }
    }
  } catch (err) {
    console.error('Error reading settings from storage, falling back to defaults:', err);
  }

  memorySettings = defaultSiteSettings;
  return defaultSiteSettings;
}

export function writeSettingsToStorage(settings: Partial<SiteSettingsMap>): SiteSettingsMap {
  const current = readSettingsFromStorage();
  const updated: SiteSettingsMap = {
    ...current,
    ...settings,
    appearance: settings.appearance
      ? { ...current.appearance, ...settings.appearance }
      : current.appearance,
  };

  // Always update in-memory cache
  memorySettings = updated;

  try {
    const content = JSON.stringify(updated, null, 2);
    safeWriteFile(SETTINGS_FILE, TMP_SETTINGS_FILE, content);
  } catch (err: any) {
    console.warn('writeSettingsToStorage caught non-fatal warning:', err?.message);
  }

  return updated;
}

