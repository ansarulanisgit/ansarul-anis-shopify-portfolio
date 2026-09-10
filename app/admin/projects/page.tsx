'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  X,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Project } from '@/types/database.types';
import { defaultProjects } from '@/lib/data/seed-data';
import { ReorderableList } from '@/components/admin/ReorderableList';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function AdminProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>(defaultProjects);
  const [editingProject, setEditingProject] = React.useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadProjects() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('projects')
          .select('*, images:project_images(*)')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          setProjects(data as Project[]);
        }
      } catch {
        // Keep default seed
      }
    }
    loadProjects();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('placeholder')) return;

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('projects_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'projects' },
          () => {
            loadProjects();
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

  const handleReorder = async (newProjects: Project[]) => {
    const updated = newProjects.map((p, idx) => ({ ...p, order_index: idx + 1 }));
    setProjects(updated);

    try {
      const supabase = createClient();
      for (const p of updated) {
        await (supabase.from('projects') as any).update({ order_index: p.order_index }).eq('id', p.id);
      }
      showNotification('Project order updated!');
    } catch {
      showNotification('Order saved locally (demo mode)');
    }
  };

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      slug: '',
      summary: '',
      problem: '',
      solution: '',
      result: '',
      tech_stack: ['Shopify 2.0', 'Liquid', 'Tailwind CSS'],
      live_url: '',
      status: 'draft',
      featured: false,
      images: [
        {
          id: `img-${Date.now()}`,
          project_id: '',
          image_url:
            'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
          alt_text: 'Project Cover',
          order_index: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
    setTechInput('');
  };

  const handleTitleChange = (newTitle: string) => {
    if (!editingProject) return;
    setEditingProject((prev) => ({
      ...prev,
      title: newTitle,
      slug: prev?.slug ? prev.slug : slugify(newTitle),
    }));
  };

  const handleAddTechTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      const current = editingProject?.tech_stack || [];
      if (!current.includes(techInput.trim())) {
        setEditingProject({
          ...editingProject,
          tech_stack: [...current, techInput.trim()],
        });
      }
      setTechInput('');
    }
  };

  const handleRemoveTechTag = (tagToRemove: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      tech_stack: (editingProject.tech_stack || []).filter((t) => t !== tagToRemove),
    });
  };

  const isValidUuid = (str?: string): boolean => {
    return (
      typeof str === 'string' &&
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str)
    );
  };

  const handleSaveProject = async () => {
    if (!editingProject?.title || !editingProject?.summary) {
      alert('Title and Summary are required.');
      return;
    }

    setIsSaving(true);
    try {
      const slug = editingProject.slug || slugify(editingProject.title);
      const dbPayload: any = {
        title: editingProject.title,
        slug,
        summary: editingProject.summary,
        problem: editingProject.problem || '',
        solution: editingProject.solution || '',
        result: editingProject.result || '',
        tech_stack: editingProject.tech_stack || [],
        live_url: editingProject.live_url || null,
        status: editingProject.status || 'published',
        featured: Boolean(editingProject.featured),
        order_index: editingProject.order_index || projects.length + 1,
        updated_at: new Date().toISOString(),
      };

      if (isValidUuid(editingProject.id)) {
        dbPayload.id = editingProject.id;
      }

      let savedProject: Project = {
        id: editingProject.id || `proj-${Date.now()}`,
        title: editingProject.title,
        slug,
        summary: editingProject.summary,
        problem: editingProject.problem || '',
        solution: editingProject.solution || '',
        result: editingProject.result || '',
        tech_stack: editingProject.tech_stack || [],
        live_url: editingProject.live_url || null,
        status: editingProject.status || 'published',
        featured: Boolean(editingProject.featured),
        order_index: editingProject.order_index || projects.length + 1,
        created_at: editingProject.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: editingProject.images || [],
      };

      try {
        const supabase = createClient();
        const { data: upsertData, error } = await (supabase.from('projects') as any)
          .upsert(dbPayload, { onConflict: 'slug' })
          .select('*, images:project_images(*)')
          .single();

        if (!error && upsertData) {
          savedProject = upsertData as Project;
        } else if (error) {
          console.error('Supabase project save error:', error.message);
        }
      } catch (dbErr) {
        console.error('Database connection error:', dbErr);
      }

      setProjects((prev) => {
        const exists = prev.some((p) => p.id === savedProject.id || p.slug === savedProject.slug);
        if (exists) {
          return prev.map((p) => (p.id === savedProject.id || p.slug === savedProject.slug ? savedProject : p));
        }
        return [...prev, savedProject];
      });

      // Trigger ISR Revalidation
      try {
        await fetch('/api/revalidate?path=/&secret=dev_secret_token_123', { method: 'POST' });
      } catch {}

      setEditingProject(null);
      showNotification('Case study saved to database & live site updated!');
    } catch (err: any) {
      alert(err.message || 'Error saving project.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;

    try {
      const supabase = createClient();
      await supabase.from('projects').delete().eq('id', id);
    } catch {
      // Ignore
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    showNotification('Project removed');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Drag to reorder how case studies appear on your homepage. Published items appear live.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground font-semibold text-xs shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Case Study</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          {notification}
        </div>
      )}

      {/* Projects Reorderable List */}
      <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border/80 shadow-xs">
        <ReorderableList
          items={projects}
          onReorder={handleReorder}
          renderItem={(project) => {
            const coverImage =
              project.images && project.images.length > 0
                ? project.images[0].image_url
                : 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80';

            return (
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/70 bg-background hover:border-border transition-all">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border border-border bg-muted">
                    <Image src={coverImage} alt={project.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground truncate">{project.title}</h3>
                      {project.featured && (
                        <Badge variant="accent" className="text-[10px] py-0 px-1.5">
                          Featured
                        </Badge>
                      )}
                      <Badge
                        variant={project.status === 'published' ? 'success' : 'secondary'}
                        className="text-[10px] py-0 px-1.5"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-md">
                      {project.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Edit Case Study"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Case Study"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Add / Edit Drawer Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {editingProject.id ? 'Edit Case Study' : 'Create New Case Study'}
              </h2>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Project Title *</label>
                  <Input
                    value={editingProject.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Aura Botanicals - Organic Skincare"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Slug (URL safe) *</label>
                  <Input
                    value={editingProject.slug || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, slug: slugify(e.target.value) })
                    }
                    placeholder="aura-botanicals-skincare"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">One-Line Card Summary *</label>
                <Input
                  value={editingProject.summary || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, summary: e.target.value })
                  }
                  placeholder="Custom Shopify theme redesign with 3.8x mobile conversion lift."
                />
              </div>

              {/* Cover Image */}
              <ImageUploader
                label="Cover Image"
                value={editingProject.images?.[0]?.image_url || ''}
                onChange={(url) => {
                  setEditingProject({
                    ...editingProject,
                    images: [
                      {
                        id: `img-${Date.now()}`,
                        project_id: editingProject.id || '',
                        image_url: url,
                        alt_text: editingProject.title || '',
                        order_index: 1,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      },
                    ],
                  });
                }}
              />

              {/* Problem / Solution / Result */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">The Problem (Challenge)</label>
                <Textarea
                  value={editingProject.problem || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, problem: e.target.value })
                  }
                  placeholder="What bottlenecks or issues was the client experiencing?"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">The Solution</label>
                <Textarea
                  value={editingProject.solution || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, solution: e.target.value })
                  }
                  placeholder="How did you solve it technically with Shopify / Liquid / React?"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">The Result (Metrics &amp; ROI)</label>
                <Textarea
                  value={editingProject.result || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, result: e.target.value })
                  }
                  placeholder="e.g. Mobile conversion rate increased from 1.4% to 3.8%."
                  className="min-h-[80px]"
                />
              </div>

              {/* Tech Stack Tags */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Tech Stack Tags (Press Enter or click presets below)</label>
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTechTag}
                  placeholder="Type a tag (e.g. Liquid) and press Enter"
                />
                
                {/* Quick Add Skill Presets */}
                <div className="pt-1">
                  <span className="text-[11px] text-muted-foreground font-semibold block mb-1.5">Quick add skill presets:</span>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-muted/40 rounded-lg border border-border/50">
                    {[
                      'Shopify Development',
                      'Liquid',
                      'HTML & CSS',
                      'JavaScript',
                      'TypeScript',
                      'Figma',
                      'UI/UX Design',
                      'Shopify APIs',
                      'GraphQL',
                      'React',
                      'Next.js',
                      'Headless Shopify',
                      'Shopify App Development',
                      'Shopify CLI',
                      'Shopify Theme Development',
                      'Performance Optimization',
                      'Technical SEO',
                      'Third-Party Integrations',
                      'Automation',
                      'CRO & Analytics',
                      'SEO',
                    ].map((skill) => {
                      const isSelected = (editingProject.tech_stack || []).includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            const current = editingProject.tech_stack || [];
                            if (isSelected) {
                              handleRemoveTechTag(skill);
                            } else {
                              setEditingProject({
                                ...editingProject,
                                tech_stack: [...current, skill],
                              });
                            }
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all ${
                            isSelected
                              ? 'bg-primary text-primary-foreground font-bold'
                              : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40'
                          }`}
                        >
                          {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(editingProject.tech_stack || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary font-semibold text-xs border border-primary/20"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Live URL */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Live Site URL (Optional)</label>
                <Input
                  type="url"
                  value={editingProject.live_url || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, live_url: e.target.value })
                  }
                  placeholder="https://brand-store.com"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.status === 'published'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="rounded border-input text-primary w-4 h-4"
                  />
                  <span className="font-semibold text-foreground">Published to Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.featured)}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        featured: e.target.checked,
                      })
                    }
                    className="rounded border-input text-primary w-4 h-4"
                  />
                  <span className="font-semibold text-foreground">Featured (Top of Grid)</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProject}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground text-xs font-semibold shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Case Study'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
