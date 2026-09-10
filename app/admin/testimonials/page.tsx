'use client';

import * as React from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Save, X, MessageSquareQuote } from 'lucide-react';
import { Testimonial } from '@/types/database.types';
import { defaultTestimonials } from '@/lib/data/seed-data';
import { ReorderableList } from '@/components/admin/ReorderableList';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>(defaultTestimonials);
  const [editingTestimonial, setEditingTestimonial] = React.useState<Partial<Testimonial> | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadTestimonials() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          setTestimonials(data as Testimonial[]);
        }
      } catch {
        // Fallback
      }
    }
    loadTestimonials();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('placeholder')) return;

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('testimonials_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'testimonials' },
          () => {
            loadTestimonials();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {}
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReorder = async (newItems: Testimonial[]) => {
    const updated = newItems.map((t, idx) => ({ ...t, order_index: idx + 1 }));
    setTestimonials(updated);

    try {
      const supabase = createClient();
      for (const t of updated) {
        await (supabase.from('testimonials') as any).update({ order_index: t.order_index }).eq('id', t.id);
      }
      showNotification('Testimonial order saved!');
    } catch {
      showNotification('Reordered locally');
    }
  };

  const handleOpenAdd = () => {
    setEditingTestimonial({
      client_name: '',
      client_company: '',
      quote: '',
      avatar_url: '',
      featured: true,
    });
  };

function isValidUuid(id?: string) {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

  const handleSave = async () => {
    if (!editingTestimonial?.client_name || !editingTestimonial?.quote) {
      alert('Client Name and Quote are required.');
      return;
    }

    setIsSaving(true);
    try {
      const dbPayload: any = {
        client_name: editingTestimonial.client_name,
        client_company: editingTestimonial.client_company || '',
        quote: editingTestimonial.quote,
        avatar_url:
          editingTestimonial.avatar_url ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(editingTestimonial.client_name)}`,
        order_index: editingTestimonial.order_index || testimonials.length + 1,
        featured: Boolean(editingTestimonial.featured),
        updated_at: new Date().toISOString(),
      };

      if (isValidUuid(editingTestimonial.id)) {
        dbPayload.id = editingTestimonial.id;
      }

      let savedItem: Testimonial | null = null;
      try {
        const supabase = createClient();
        const { data, error } = await (supabase.from('testimonials') as any)
          .upsert(dbPayload)
          .select()
          .single();

        if (!error && data) {
          savedItem = data as Testimonial;
        }
      } catch {
        // Fallback
      }

      const finalItem: Testimonial = savedItem || {
        id: dbPayload.id || `t-${Date.now()}`,
        ...dbPayload,
        created_at: editingTestimonial.created_at || new Date().toISOString(),
      };

      setTestimonials((prev) => {
        const exists = prev.some((t) => t.id === finalItem.id || (editingTestimonial.id && t.id === editingTestimonial.id));
        if (exists) return prev.map((t) => (t.id === finalItem.id || t.id === editingTestimonial.id ? finalItem : t));
        return [...prev, finalItem];
      });

      try {
        await fetch('/api/revalidate?path=/', { method: 'POST' });
      } catch {}

      setEditingTestimonial(null);
      showNotification('Testimonial saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving testimonial.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this testimonial?')) return;
    try {
      const supabase = createClient();
      await supabase.from('testimonials').delete().eq('id', id);
    } catch {
      // Fallback
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    showNotification('Testimonial deleted.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Testimonials &amp; Social Proof
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage reviews displayed on the carousel. Only testimonials toggled &ldquo;Featured&rdquo; will show on the homepage.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground font-semibold text-xs shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          {notification}
        </div>
      )}

      {/* Reorderable Testimonials List */}
      <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border/80 shadow-xs">
        <ReorderableList
          items={testimonials}
          onReorder={handleReorder}
          renderItem={(t) => (
            <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/70 bg-background hover:border-border transition-all">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border bg-muted">
                  <Image src={t.avatar_url} alt={t.client_name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground truncate">{t.client_name}</h3>
                    <span className="text-xs text-muted-foreground truncate">({t.client_company})</span>
                    {t.featured ? (
                      <Badge variant="success" className="text-[10px] py-0 px-1.5">
                        Live
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                        Hidden
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground italic truncate mt-0.5 max-w-lg">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  onClick={() => setEditingTestimonial(t)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Edit Testimonial"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Delete Testimonial"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Add / Edit Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button
                onClick={() => setEditingTestimonial(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Client Name *</label>
                  <Input
                    value={editingTestimonial.client_name || ''}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, client_name: e.target.value })
                    }
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Client Company / Role</label>
                  <Input
                    value={editingTestimonial.client_company || ''}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, client_company: e.target.value })
                    }
                    placeholder="Founder, Aura Botanicals"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Testimonial Quote *</label>
                <Textarea
                  value={editingTestimonial.quote || ''}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                  }
                  placeholder="The results we achieved together were outstanding..."
                  className="min-h-[100px]"
                />
              </div>

              <ImageUploader
                label="Client Avatar"
                value={editingTestimonial.avatar_url || ''}
                onChange={(url) =>
                  setEditingTestimonial({ ...editingTestimonial, avatar_url: url })
                }
              />

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingTestimonial.featured)}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, featured: e.target.checked })
                    }
                    className="rounded border-input text-primary w-4 h-4"
                  />
                  <span className="font-semibold text-foreground">
                    Featured (Display on Homepage Carousel)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground text-xs font-semibold shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Testimonial'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
