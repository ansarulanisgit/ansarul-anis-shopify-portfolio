'use client';

import * as React from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Save,
  X,
  AlertTriangle,
  ShoppingBag,
  Target,
  Code2,
  ArrowRightLeft,
  Building2,
  Cpu,
  Repeat,
  Zap,
} from 'lucide-react';
import { Service } from '@/types/database.types';
import { defaultServices } from '@/lib/data/seed-data';
import { ReorderableList } from '@/components/admin/ReorderableList';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';

const iconOptions = [
  { value: 'ShoppingBag', label: 'ShoppingBag (Store development)' },
  { value: 'Target', label: 'Target (Landing pages / CRO)' },
  { value: 'Code2', label: 'Code2 (Headless / Storefront API)' },
  { value: 'ArrowRightLeft', label: 'ArrowRightLeft (Platform migration)' },
  { value: 'Building2', label: 'Building2 (Shopify Plus / B2B)' },
  { value: 'Cpu', label: 'Cpu (Custom Apps / Integrations)' },
  { value: 'Repeat', label: 'Repeat (Subscriptions / Recharge)' },
  { value: 'Sparkles', label: 'Sparkles (AI Store Features)' },
  { value: 'Zap', label: 'Zap (Speed / SEO Optimization)' },
];

export default function AdminServicesPage() {
  const [services, setServices] = React.useState<Service[]>(defaultServices);
  const [editingService, setEditingService] = React.useState<Partial<Service> | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadServices() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          setServices(data as Service[]);
        }
      } catch {
        // Seed default
      }
    }
    loadServices();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('placeholder')) return;

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('services_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'services' },
          () => {
            loadServices();
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

  const handleReorder = async (newItems: Service[]) => {
    const updated = newItems.map((s, idx) => ({ ...s, order_index: idx + 1 }));
    setServices(updated);

    try {
      const supabase = createClient();
      for (const s of updated) {
        await (supabase.from('services') as any).update({ order_index: s.order_index }).eq('id', s.id);
      }
      showNotification('Services reordered!');
    } catch {
      showNotification('Reordered locally');
    }
  };

  const handleOpenAdd = () => {
    setEditingService({
      title: '',
      hook: '',
      description: '',
      icon: 'ShoppingBag',
      featured: false,
    });
  };

function isValidUuid(id?: string) {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

  const handleSave = async () => {
    if (!editingService?.title || !editingService?.hook) {
      alert('Title and Hook are required.');
      return;
    }

    setIsSaving(true);
    try {
      const dbPayload: any = {
        title: editingService.title,
        hook: editingService.hook,
        description: editingService.description || '',
        icon: editingService.icon || 'ShoppingBag',
        order_index: editingService.order_index || services.length + 1,
        featured: Boolean(editingService.featured),
        updated_at: new Date().toISOString(),
      };

      if (isValidUuid(editingService.id)) {
        dbPayload.id = editingService.id;
      }

      let savedItem: Service | null = null;
      try {
        const supabase = createClient();
        const { data, error } = await (supabase.from('services') as any)
          .upsert(dbPayload)
          .select()
          .single();

        if (!error && data) {
          savedItem = data as Service;
        }
      } catch {
        // Fallback
      }

      const finalItem: Service = savedItem || {
        id: dbPayload.id || `srv-${Date.now()}`,
        ...dbPayload,
        created_at: editingService.created_at || new Date().toISOString(),
      };

      setServices((prev) => {
        const exists = prev.some((s) => s.id === finalItem.id || (editingService.id && s.id === editingService.id));
        if (exists) return prev.map((s) => (s.id === finalItem.id || s.id === editingService.id ? finalItem : s));
        return [...prev, finalItem];
      });

      try {
        await fetch('/api/revalidate?path=/', { method: 'POST' });
      } catch {}

      setEditingService(null);
      showNotification('Service saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Error saving service.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const supabase = createClient();
      await supabase.from('services').delete().eq('id', id);
    } catch {
      // Fallback
    }
    setServices((prev) => prev.filter((s) => s.id !== id));
    showNotification('Service deleted.');
  };

  const featuredCount = services.filter((s) => s.featured).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Services Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Reorder and manage your service offerings. The first 3 featured services appear in the prominent top row.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground font-semibold text-xs shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {featuredCount > 3 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            You have {featuredCount} services marked as Featured. We recommend capping at 3 for the optimal desktop grid balance.
          </span>
        </div>
      )}

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          {notification}
        </div>
      )}

      {/* Reorderable List */}
      <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border/80 shadow-xs">
        <ReorderableList
          items={services}
          onReorder={handleReorder}
          renderItem={(service) => (
            <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/70 bg-background hover:border-border transition-all">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 text-primary dark:text-sky-400 font-bold text-xs">
                  {service.icon.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground truncate">{service.title}</h3>
                    {service.featured && (
                      <Badge variant="accent" className="text-[10px] py-0 px-1.5">
                        Featured (Top Row)
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground italic truncate mt-0.5 max-w-lg">
                    &ldquo;{service.hook}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  onClick={() => setEditingService(service)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Edit Service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Add / Edit Drawer */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Service Title *</label>
                <Input
                  value={editingService.title || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  placeholder="e.g. Headless Shopify Storefronts"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Italic One-Line Hook *</label>
                <Input
                  value={editingService.hook || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, hook: e.target.value })
                  }
                  placeholder="e.g. Custom-built storefronts using Shopify's Storefront API."
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Detailed Description</label>
                <Textarea
                  value={editingService.description || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  placeholder="Explain what the service covers and the benefits..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Icon Identifier</label>
                <Select
                  value={editingService.icon || 'ShoppingBag'}
                  onChange={(e) =>
                    setEditingService({ ...editingService, icon: e.target.value })
                  }
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingService.featured)}
                    onChange={(e) =>
                      setEditingService({ ...editingService, featured: e.target.checked })
                    }
                    className="rounded border-input text-primary w-4 h-4"
                  />
                  <span className="font-semibold text-foreground">
                    Featured (Display in Top 3 Cards)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditingService(null)}
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
                <span>{isSaving ? 'Saving...' : 'Save Service'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
