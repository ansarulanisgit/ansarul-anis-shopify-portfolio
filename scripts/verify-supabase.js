const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
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

async function checkTables() {
  console.log('Testing connection to Supabase instance:', url);

  const tables = [
    'site_settings',
    'projects',
    'project_images',
    'services',
    'testimonials',
    'faqs',
    'leads',
    'page_sections',
    'seo_meta',
    'cta_events',
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`❌ Table '${table}': ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`✅ Table '${table}': Exists (Rows: ${data.length})`);
    }
  }
}

checkTables();
