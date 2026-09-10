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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createAdmin() {
  const email = 'ansarul.contact@gmail.com';
  const password = 'Ansarul@233';

  console.log(`Creating/updating admin user in Supabase Auth: ${email}...`);

  // Check if user already exists
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError.message);
  }

  const existingUser = listData?.users?.find((u) => u.email === email);

  if (existingUser) {
    console.log(`User ${email} already exists (ID: ${existingUser.id}). Updating password...`);
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password, email_confirm: true }
    );

    if (updateError) {
      console.error('Error updating user password:', updateError.message);
    } else {
      console.log(`✅ Admin user password updated successfully for ${email}!`);
    }
  } else {
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin', full_name: 'Ansarul Anis' },
    });

    if (createError) {
      console.error('Error creating user:', createError.message);
    } else {
      console.log(`✅ Admin user created successfully in Supabase Auth! (ID: ${createData.user.id})`);
    }
  }
}

createAdmin();
