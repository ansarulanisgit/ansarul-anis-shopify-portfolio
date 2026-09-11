import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const idsParam = searchParams.get('ids');
    const all = searchParams.get('all');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseLive = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (isSupabaseLive) {
      const supabase = createAdminSupabaseClient();
      if (all === 'true') {
        const { error } = await supabase.from('leads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw error;
      } else if (idsParam) {
        const ids = idsParam.split(',').filter(Boolean);
        const { error } = await supabase.from('leads').delete().in('id', ids);
        if (error) throw error;
      } else if (id) {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) throw error;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete lead' }, { status: 500 });
  }
}
