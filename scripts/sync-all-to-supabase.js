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

if (!url || !key) {
  console.error('Error: Supabase environment variables missing');
  process.exit(1);
}

const supabase = createClient(url, key);

function isValidUuid(str) {
  return (
    typeof str === 'string' &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str)
  );
}

async function syncAllToSupabase() {
  console.log('🚀 Starting complete data sync to Supabase database...\n');

  // Load compiled seed data using require or TypeScript import
  // Since seed-data is TypeScript, let's parse seed-data or use require if ts-node/register or direct JSON
  // Let's import from compiled or read seed-data.ts directly using simple regex/eval or TS loader
}
