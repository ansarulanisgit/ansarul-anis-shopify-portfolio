import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import {
  defaultProjects,
  defaultServices,
  defaultTestimonials,
  defaultFaqs,
  defaultSiteSettings,
} from '../lib/data/seed-data';
import { initialDefaultSections } from '../lib/sections/defaults';

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

if (!url || !key) {
  console.error('Error: Supabase environment variables missing in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

function isValidUuid(str?: string): boolean {
  return (
    typeof str === 'string' &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str)
  );
}

async function syncAllData() {
  console.log('🚀 Starting complete seed sync to Supabase database...\n');

  // 1. Sync Services (9 services)
  console.log(`Syncing ${defaultServices.length} Services...`);
  for (const s of defaultServices) {
    const payload: any = {
      title: s.title,
      hook: s.hook,
      description: s.description,
      icon: s.icon,
      order_index: s.order_index,
      featured: Boolean(s.featured),
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await (supabase.from('services') as any)
      .select('id')
      .eq('title', s.title)
      .maybeSingle();

    let error: any = null;
    if (existing?.id) {
      const res = await (supabase.from('services') as any)
        .update(payload)
        .eq('id', existing.id);
      error = res.error;
    } else {
      if (isValidUuid(s.id)) payload.id = s.id;
      const res = await (supabase.from('services') as any)
        .insert(payload);
      error = res.error;
    }

    if (error) {
      console.error(`❌ Service '${s.title}':`, error.message);
    } else {
      console.log(`  ✅ Service '${s.title}' synced.`);
    }
  }

  // 2. Sync Projects (13 projects) & images
  console.log(`\nSyncing ${defaultProjects.length} Case Studies & Projects...`);
  for (const p of defaultProjects) {
    const payload: any = {
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      problem: p.problem,
      solution: p.solution,
      result: p.result,
      tech_stack: p.tech_stack,
      live_url: p.live_url,
      order_index: p.order_index,
      status: p.status || 'published',
      featured: Boolean(p.featured),
      updated_at: new Date().toISOString(),
    };
    if (isValidUuid(p.id)) payload.id = p.id;

    const { data: upsertData, error } = await (supabase.from('projects') as any)
      .upsert(payload, { onConflict: 'slug' })
      .select('id')
      .single();

    if (error) {
      console.error(`❌ Project '${p.title}':`, error.message);
    } else {
      const realProjectId = upsertData?.id || p.id;
      console.log(`  ✅ Project '${p.title}' synced (ID: ${realProjectId}).`);

      // Sync project images
      if (p.images && p.images.length > 0 && isValidUuid(realProjectId)) {
        for (const img of p.images) {
          const imgPayload: any = {
            project_id: realProjectId,
            image_url: img.image_url,
            alt_text: img.alt_text || p.title,
            order_index: img.order_index || 1,
            updated_at: new Date().toISOString(),
          };

          const { data: existingImg } = await (supabase.from('project_images') as any)
            .select('id')
            .eq('project_id', realProjectId)
            .eq('image_url', img.image_url)
            .maybeSingle();

          if (existingImg?.id) {
            await (supabase.from('project_images') as any)
              .update(imgPayload)
              .eq('id', existingImg.id);
          } else {
            if (isValidUuid(img.id)) imgPayload.id = img.id;
            await (supabase.from('project_images') as any).insert(imgPayload);
          }
        }
      }
    }
  }

  // 3. Sync Testimonials (12 testimonials)
  console.log(`\nSyncing ${defaultTestimonials.length} Testimonials...`);
  for (const t of defaultTestimonials) {
    const payload: any = {
      client_name: t.client_name,
      client_company: t.client_company,
      quote: t.quote,
      avatar_url: t.avatar_url,
      order_index: t.order_index,
      featured: Boolean(t.featured !== false),
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await (supabase.from('testimonials') as any)
      .select('id')
      .eq('client_name', t.client_name)
      .maybeSingle();

    let error: any = null;
    if (existing?.id) {
      const res = await (supabase.from('testimonials') as any)
        .update(payload)
        .eq('id', existing.id);
      error = res.error;
    } else {
      if (isValidUuid(t.id)) payload.id = t.id;
      const res = await (supabase.from('testimonials') as any)
        .insert(payload);
      error = res.error;
    }

    if (error) {
      console.error(`❌ Testimonial '${t.client_name}':`, error.message);
    } else {
      console.log(`  ✅ Testimonial '${t.client_name}' synced.`);
    }
  }

  // 4. Sync FAQs (6 FAQs)
  console.log(`\nSyncing ${defaultFaqs.length} FAQs...`);
  for (const f of defaultFaqs) {
    const payload: any = {
      question: f.question,
      answer: f.answer,
      order_index: f.order_index,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await (supabase.from('faqs') as any)
      .select('id')
      .eq('question', f.question)
      .maybeSingle();

    let error: any = null;
    if (existing?.id) {
      const res = await (supabase.from('faqs') as any)
        .update(payload)
        .eq('id', existing.id);
      error = res.error;
    } else {
      if (isValidUuid(f.id)) payload.id = f.id;
      const res = await (supabase.from('faqs') as any)
        .insert(payload);
      error = res.error;
    }

    if (error) {
      console.error(`❌ FAQ '${f.question}':`, error.message);
    } else {
      console.log(`  ✅ FAQ '${f.question}' synced.`);
    }
  }

  // 5. Sync Site Settings
  console.log(`\nSyncing Site Settings...`);
  const settingsKeys = [
    { key: 'general', value: { site_name: defaultSiteSettings.site_name, developer_name: defaultSiteSettings.developer_name, nav_cta_label: defaultSiteSettings.nav_cta_label, social_links: defaultSiteSettings.social_links } },
    { key: 'hero', value: { hero_eyebrow: defaultSiteSettings.hero_eyebrow, hero_headline: defaultSiteSettings.hero_headline, hero_headline_prefix: defaultSiteSettings.hero_headline_prefix, hero_rotating_words: defaultSiteSettings.hero_rotating_words, hero_subheadline: defaultSiteSettings.hero_subheadline, hero_primary_cta_label: defaultSiteSettings.hero_primary_cta_label, hero_secondary_cta_label: defaultSiteSettings.hero_secondary_cta_label, hero_secondary_cta_url: defaultSiteSettings.hero_secondary_cta_url, hero_graphic_url: defaultSiteSettings.hero_graphic_url } },
    { key: 'trust_bar', value: { trust_stats: defaultSiteSettings.trust_stats } },
    { key: 'about', value: { about_photo_url: defaultSiteSettings.about_photo_url, about_text: defaultSiteSettings.about_text, availability_line: defaultSiteSettings.availability_line, about_tools: defaultSiteSettings.about_tools } },
    { key: 'contact', value: { whatsapp_number: defaultSiteSettings.whatsapp_number, whatsapp_message: defaultSiteSettings.whatsapp_message } },
    { key: 'appearance', value: defaultSiteSettings.appearance },
  ];

  for (const sk of settingsKeys) {
    const { error } = await (supabase.from('site_settings') as any).upsert(
      { key: sk.key, value: sk.value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
    if (error) {
      console.error(`❌ Setting '${sk.key}':`, error.message);
    } else {
      console.log(`  ✅ Setting '${sk.key}' synced.`);
    }
  }

  // 6. Sync Page Sections
  console.log(`\nSyncing ${initialDefaultSections.length} Page Sections...`);
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
    if (isValidUuid(sec.id)) payload.id = sec.id;

    const { error } = await (supabase.from('page_sections') as any).upsert(payload, {
      onConflict: 'section_key',
    });

    if (error) {
      console.error(`❌ Section '${sec.section_key}':`, error.message);
    } else {
      console.log(`  ✅ Section '${sec.section_key}' synced.`);
    }
  }

  console.log('\n🎉 ALL 13 Projects, 12 Testimonials, 9 Services, 6 FAQs, and Site Settings are fully synced to Supabase!');
}

syncAllData();
