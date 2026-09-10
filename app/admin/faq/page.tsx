'use client';

import * as React from 'react';
import { Plus, Edit2, Trash2, Save, X, HelpCircle } from 'lucide-react';
import { FAQ } from '@/types/database.types';
import { defaultFaqs } from '@/lib/data/seed-data';
import { ReorderableList } from '@/components/admin/ReorderableList';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';

export default function AdminFaqPage() {
  const [faqs, setFaqs] = React.useState<FAQ[]>(defaultFaqs);
  const [editingFaq, setEditingFaq] = React.useState<Partial<FAQ> | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadFaqs() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          setFaqs(data as FAQ[]);
        }
      } catch {
        // Fallback
      }
    }
    loadFaqs();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('placeholder')) return;

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('faqs_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'faqs' },
          () => {
            loadFaqs();
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

  const handleReorder = async (newItems: FAQ[]) => {
    const updated = newItems.map((f, idx) => ({ ...f, order_index: idx + 1 }));
    setFaqs(updated);

    try {
      const supabase = createClient();
      for (const f of updated) {
        await (supabase.from('faqs') as any).update({ order_index: f.order_index }).eq('id', f.id);
      }
      showNotification('FAQ order saved!');
    } catch {
      showNotification('Reordered locally');
    }
  };

  const handleOpenAdd = () => {
    setEditingFaq({
      question: '',
      answer: '',
    });
  };

function isValidUuid(id?: string) {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

  const handleSave = async () => {
    if (!editingFaq?.question || !editingFaq?.answer) {
      alert('Question and Answer are required.');
      return;
    }

    setIsSaving(true);
    try {
      const dbPayload: any = {
        question: editingFaq.question,
        answer: editingFaq.answer,
        order_index: editingFaq.order_index || faqs.length + 1,
        updated_at: new Date().toISOString(),
      };

      if (isValidUuid(editingFaq.id)) {
        dbPayload.id = editingFaq.id;
      }

      let savedItem: FAQ | null = null;
      try {
        const supabase = createClient();
        const { data, error } = await (supabase.from('faqs') as any)
          .upsert(dbPayload)
          .select()
          .single();

        if (!error && data) {
          savedItem = data as FAQ;
        }
      } catch {
        // Fallback
      }

      const finalItem: FAQ = savedItem || {
        id: dbPayload.id || `faq-${Date.now()}`,
        ...dbPayload,
        created_at: editingFaq.created_at || new Date().toISOString(),
      };

      setFaqs((prev) => {
        const exists = prev.some((f) => f.id === finalItem.id || (editingFaq.id && f.id === editingFaq.id));
        if (exists) return prev.map((f) => (f.id === finalItem.id || f.id === editingFaq.id ? finalItem : f));
        return [...prev, finalItem];
      });

      try {
        await fetch('/api/revalidate?path=/', { method: 'POST' });
      } catch {}

      setEditingFaq(null);
      showNotification('FAQ saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving FAQ.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const supabase = createClient();
      await supabase.from('faqs').delete().eq('id', id);
    } catch {
      // Fallback
    }
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    showNotification('FAQ deleted.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pre-answer client objections and questions. Drag and drop to adjust display order.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground font-semibold text-xs shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ Item</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          {notification}
        </div>
      )}

      {/* Reorderable FAQ List */}
      <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border/80 shadow-xs">
        <ReorderableList
          items={faqs}
          onReorder={handleReorder}
          renderItem={(faq) => (
            <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/70 bg-background hover:border-border transition-all">
              <div className="min-w-0 flex-1 pr-4">
                <h3 className="font-bold text-sm text-foreground mb-1">{faq.question}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setEditingFaq(faq)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Add / Edit Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {editingFaq.id ? 'Edit FAQ Item' : 'Add FAQ Item'}
              </h2>
              <button
                onClick={() => setEditingFaq(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Question *</label>
                <Input
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g. What is your typical timeline for a store build?"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Answer *</label>
                <Textarea
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Provide a clear, reassuring answer..."
                  className="min-h-[120px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditingFaq(null)}
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
                <span>{isSaving ? 'Saving...' : 'Save FAQ'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
