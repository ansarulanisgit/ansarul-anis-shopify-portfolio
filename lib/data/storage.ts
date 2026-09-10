import fs from 'fs';
import path from 'path';
import { PageSection, SiteSettingsMap } from '@/types/database.types';
import { initialDefaultSections } from '@/lib/sections/defaults';
import { defaultSiteSettings } from '@/lib/data/seed-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const SECTIONS_FILE = path.join(DATA_DIR, 'sections.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

export function readSectionsFromStorage(pageKey: string = 'home'): PageSection[] {
  ensureDataDir();
  try {
    if (fs.existsSync(SECTIONS_FILE)) {
      const raw = fs.readFileSync(SECTIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading sections from storage, falling back to defaults:', err);
  }

  // Initialize with initialDefaultSections if file doesn't exist
  try {
    fs.writeFileSync(SECTIONS_FILE, JSON.stringify(initialDefaultSections, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial sections to storage:', err);
  }

  return initialDefaultSections;
}

export function writeSectionsToStorage(sections: PageSection[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(SECTIONS_FILE, JSON.stringify(sections, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing sections to storage:', err);
    throw err;
  }
}

export function readSettingsFromStorage(): SiteSettingsMap {
  ensureDataDir();
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...defaultSiteSettings, ...parsed };
      }
    }
  } catch (err) {
    console.error('Error reading settings from storage, falling back to defaults:', err);
  }

  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSiteSettings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial settings to storage:', err);
  }

  return defaultSiteSettings;
}

export function writeSettingsToStorage(settings: Partial<SiteSettingsMap>): SiteSettingsMap {
  ensureDataDir();
  try {
    const current = readSettingsFromStorage();
    const updated = {
      ...current,
      ...settings,
      appearance: settings.appearance
        ? { ...current.appearance, ...settings.appearance }
        : current.appearance,
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (err) {
    console.error('Error writing settings to storage:', err);
    throw err;
  }
}
