const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  lines.forEach((line) => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key && val && !process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function syncLocalToSupabase() {
  console.log('Syncing rich local settings and sections to Supabase database...');

  // 1. Sync Settings
  const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

    // Insert key-value pairs into site_settings
    const keys = ['general', 'hero', 'trust_bar', 'about', 'contact', 'appearance'];
    for (const k of keys) {
      let val = {};
      if (k === 'general') {
        val = {
          site_name: settings.site_name,
          developer_name: settings.developer_name,
          nav_cta_label: settings.nav_cta_label,
          social_links: settings.social_links,
        };
      } else if (k === 'hero') {
        val = {
          hero_eyebrow: settings.hero_eyebrow,
          hero_headline: settings.hero_headline,
          hero_headline_prefix: settings.hero_headline_prefix,
          hero_rotating_words: settings.hero_rotating_words,
          hero_subheadline: settings.hero_subheadline,
          hero_primary_cta_label: settings.hero_primary_cta_label,
          hero_secondary_cta_label: settings.hero_secondary_cta_label,
          hero_secondary_cta_url: settings.hero_secondary_cta_url,
          hero_graphic_url: settings.hero_graphic_url,
        };
      } else if (k === 'trust_bar') {
        val = { trust_stats: settings.trust_stats };
      } else if (k === 'about') {
        val = {
          about_photo_url: settings.about_photo_url,
          about_text: settings.about_text,
          availability_line: settings.availability_line,
          about_tools: settings.about_tools,
        };
      } else if (k === 'contact') {
        val = {
          whatsapp_number: settings.whatsapp_number,
          whatsapp_message: settings.whatsapp_message,
        };
      } else if (k === 'appearance') {
        val = settings.appearance;
      }

      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: k, value: val, updated_at: new Date().toISOString() }, { onConflict: 'key' });

      if (error) {
        console.error(`Error syncing key '${k}':`, error.message);
      } else {
        console.log(`✅ Synced site_setting '${k}' to Supabase!`);
      }
    }
  }

  // 2. Sync Sections
  const sectionsPath = path.join(process.cwd(), 'data', 'sections.json');
  if (fs.existsSync(sectionsPath)) {
    const sections = JSON.parse(fs.readFileSync(sectionsPath, 'utf-8'));
    if (Array.isArray(sections)) {
      for (const s of sections) {
        const { error } = await supabase
          .from('page_sections')
          .upsert(
            {
              page_key: s.page_key || 'home',
              section_key: s.section_key,
              section_type: s.section_type,
              title: s.title,
              order_index: s.order_index,
              is_enabled: s.is_enabled !== false,
              is_visible: s.is_visible !== false,
              desktop_visible: s.desktop_visible !== false,
              tablet_visible: s.tablet_visible !== false,
              mobile_visible: s.mobile_visible !== false,
              status: s.status || 'published',
              settings: s.settings || {},
              draft_settings: s.draft_settings || null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'section_key' }
          );

        if (error) {
          console.error(`Error syncing section '${s.section_key}':`, error.message);
        } else {
          console.log(`✅ Synced page_section '${s.section_key}' to Supabase!`);
        }
      }
    }
  }

  console.log('\n🎉 All local data and settings have been synced to your Supabase database!');
}

syncLocalToSupabase();
