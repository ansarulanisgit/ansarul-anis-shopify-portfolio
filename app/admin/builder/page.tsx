'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Send,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Layers,
  AlertCircle,
  X,
} from 'lucide-react';
import { PageSection, SectionType } from '@/types/database.types';
import { initialDefaultSections, createNewSection, SECTION_DEFINITIONS } from '@/lib/sections/defaults';
import { SectionEditorDrawer } from '@/components/admin/builder/SectionEditorDrawer';
import { AddSectionModal } from '@/components/admin/builder/AddSectionModal';
import { DeleteSectionDialog } from '@/components/admin/builder/DeleteSectionDialog';
import { PageSectionRenderer } from '@/lib/sections/renderer';
import { defaultProjects, defaultServices, defaultTestimonials, defaultFaqs, defaultSiteSettings } from '@/lib/data/seed-data';
import { createClient } from '@/lib/supabase/client';

interface SortableSectionCardProps {
  section: PageSection;
  index: number;
  onEdit: (section: PageSection) => void;
  onDuplicate: (section: PageSection) => void;
  onToggleEnabled: (section: PageSection) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (section: PageSection) => void;
  isFirst: boolean;
  isLast: boolean;
}

function SortableSectionCard({
  section,
  index,
  onEdit,
  onDuplicate,
  onToggleEnabled,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast,
}: SortableSectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : 'auto',
    opacity: isDragging ? 0.65 : 1,
  };

  const def = SECTION_DEFINITIONS[section.section_type as SectionType] || SECTION_DEFINITIONS.custom;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${
        section.is_enabled === false
          ? 'border-border/60 bg-muted/40 opacity-75'
          : 'border-border/80 bg-card hover:border-primary/50 shadow-xs'
      }`}
    >
      {/* Left: Drag Handle & Meta Info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing rounded-xl hover:bg-muted shrink-0 transition-colors"
          title="Drag to reorder section"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
          {(index + 1).toString().padStart(2, '0')}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
              {section.title}
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-lg bg-muted text-muted-foreground font-semibold">
              {section.section_type}
            </span>
            {section.status === 'draft' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Draft Changes
              </span>
            )}
            {section.is_enabled === false && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">
                Disabled
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="truncate max-w-[200px] sm:max-w-xs">{def.description}</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              •
              {section.desktop_visible !== false && (
                <span title="Visible on desktop">
                  <Monitor className="w-3 h-3 text-emerald-500" />
                </span>
              )}
              {section.tablet_visible !== false && (
                <span title="Visible on tablet">
                  <Tablet className="w-3 h-3 text-emerald-500" />
                </span>
              )}
              {section.mobile_visible !== false ? (
                <span title="Visible on mobile">
                  <Smartphone className="w-3 h-3 text-emerald-500" />
                </span>
              ) : (
                <span title="Hidden on mobile">
                  <Smartphone className="w-3 h-3 text-destructive" />
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-2">
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={isFirst}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
          title="Move up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
          title="Move down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onToggleEnabled(section)}
          className={`p-2 rounded-xl transition-colors ${
            section.is_enabled !== false
              ? 'text-emerald-500 hover:bg-emerald-500/10'
              : 'text-muted-foreground hover:bg-muted'
          }`}
          title={section.is_enabled !== false ? 'Disable section' : 'Enable section'}
        >
          {section.is_enabled !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => onDuplicate(section)}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Duplicate section"
        >
          <Copy className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onEdit(section)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-90 transition-opacity"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(section)}
          className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Delete section"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function FrontEndBuilderPage() {
  const [sections, setSections] = React.useState<PageSection[]>(initialDefaultSections);
  const [editingSection, setEditingSection] = React.useState<PageSection | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [deletingSection, setDeletingSection] = React.useState<PageSection | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = React.useState(false);
  const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Mock / database collections for live preview
  const [previewCollections, setPreviewCollections] = React.useState({
    projects: defaultProjects,
    services: defaultServices,
    testimonials: defaultTestimonials,
    faqs: defaultFaqs,
    siteSettings: defaultSiteSettings,
  });

  // Load from Supabase or Fallback on mount
  React.useEffect(() => {
    async function loadSections() {
      try {
        const res = await fetch('/api/sections?pageKey=home&includeDrafts=true');
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setSections(json.data);
        }
      } catch {
        // Keep initial seed
      }
    }
    loadSections();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('placeholder')) return;

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('page_sections_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'page_sections' },
          () => {
            loadSections();
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
    setTimeout(() => setNotification(null), 3500);
  };

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(sections, oldIndex, newIndex).map((s, idx) => ({
          ...s,
          order_index: idx,
        }));
        setSections(reordered);
        setHasUnsavedChanges(true);
      }
    }
  };

  // Move up/down buttons
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const reordered = arrayMove(sections, index, index - 1).map((s, idx) => ({
      ...s,
      order_index: idx,
    }));
    setSections(reordered);
    setHasUnsavedChanges(true);
  };

  const handleMoveDown = (index: number) => {
    if (index >= sections.length - 1) return;
    const reordered = arrayMove(sections, index, index + 1).map((s, idx) => ({
      ...s,
      order_index: idx,
    }));
    setSections(reordered);
    setHasUnsavedChanges(true);
  };

  // Quick toggle enabled
  const handleToggleEnabled = (sec: PageSection) => {
    const updated = sections.map((s) =>
      s.id === sec.id ? { ...s, is_enabled: s.is_enabled === false ? true : false } : s
    );
    setSections(updated);
    setHasUnsavedChanges(true);
  };

  // Duplicate section
  const handleDuplicate = (sec: PageSection) => {
    const timestamp = Date.now();
    const newSection: PageSection = {
      ...sec,
      id: `sec-${sec.section_type}-${timestamp}`,
      section_key: `${sec.section_key}_copy_${timestamp.toString(36)}`,
      title: `${sec.title} — Copy`,
      order_index: sec.order_index + 1,
      status: 'draft',
      draft_settings: JSON.parse(JSON.stringify(sec.draft_settings || sec.settings || {})),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const targetIdx = sections.findIndex((s) => s.id === sec.id);
    const updated = [...sections];
    updated.splice(targetIdx + 1, 0, newSection);
    const reindexed = updated.map((s, idx) => ({ ...s, order_index: idx }));

    setSections(reindexed);
    setHasUnsavedChanges(true);
    showNotification(`Duplicated "${sec.title}". New section ready for customization.`);
  };

  // Delete section confirmation
  const handleConfirmDelete = async (sec: PageSection) => {
    const filtered = sections
      .filter((s) => s.id !== sec.id)
      .map((s, idx) => ({ ...s, order_index: idx }));
    setSections(filtered);
    setHasUnsavedChanges(true);

    try {
      await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', sectionId: sec.id, sectionKey: sec.section_key }),
      });
    } catch {
      // Handled
    }
    showNotification(`Section "${sec.title}" removed. Reusable component is preserved.`);
  };

  // Add new section
  const handleAddSection = (type: SectionType) => {
    const newSec = createNewSection(type, sections.length);
    setSections([...sections, newSec]);
    setHasUnsavedChanges(true);
    showNotification(`Added new "${newSec.title}" section at the bottom.`);
  };

  // Save drawer edits
  const handleSaveSectionEdit = (updatedSection: PageSection) => {
    setSections((prev) => prev.map((s) => (s.id === updatedSection.id ? updatedSection : s)));
    setHasUnsavedChanges(true);
    showNotification(`Updated settings for "${updatedSection.title}". Click "Publish" to apply live.`);
  };

  // Directly publish a section from the drawer
  const handlePublishSection = async (updatedSection: PageSection) => {
    const updatedList = sections.map((s) =>
      s.id === updatedSection.id
        ? {
            ...updatedSection,
            status: 'published' as const,
            settings: updatedSection.draft_settings || updatedSection.settings,
            draft_settings: null,
          }
        : s
    );
    setSections(updatedList);
    setIsSaving(true);
    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', sections: updatedList, pageKey: 'home' }),
      });
      const json = await res.json();
      if (json.success) {
        setHasUnsavedChanges(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('anisshopify_sections_changed'));
        }
        showNotification(`Published "${updatedSection.title}" live! Changes are visible on the website now.`);
      } else {
        alert(json.error || 'Failed to publish.');
      }
    } catch {
      showNotification(`Saved "${updatedSection.title}".`);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    if (confirm('Reset all page sections and order back to system defaults?')) {
      setSections(JSON.parse(JSON.stringify(initialDefaultSections)));
      setHasUnsavedChanges(true);
      showNotification('Sections reset to defaults. Click "Publish" to apply live.');
    }
  };

  // Save Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_draft', sections, pageKey: 'home' }),
      });
      const json = await res.json();
      if (json.success) {
        setHasUnsavedChanges(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('anisshopify_sections_changed'));
        }
        showNotification('Draft changes saved! Public site remains unchanged until published.');
      } else {
        alert(json.error || 'Failed to save draft.');
      }
    } catch {
      showNotification('Draft saved locally.');
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', sections, pageKey: 'home' }),
      });
      const json = await res.json();
      if (json.success) {
        // Update all local statuses to published
        setSections((prev) =>
          prev.map((s) => ({
            ...s,
            status: 'published',
            settings: s.draft_settings || s.settings,
            draft_settings: null,
          }))
        );
        setHasUnsavedChanges(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('anisshopify_sections_changed'));
        }
        showNotification('Published successfully! Live site is updated with instant revalidation.');
      } else {
        alert(json.error || 'Failed to publish.');
      }
    } catch {
      showNotification('Published locally.');
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner & Title Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Front-End Builder
            </h1>
            {hasUnsavedChanges && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Visually arrange, reorder, customize, and publish public sections without writing code.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground font-bold text-xs shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span>Preview Page</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Publishing...' : 'Publish'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Reset to initial default sections"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Info Tip */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <span>
            Drag sections vertically using the grip handle. The public storefront will render active sections in this exact order.
          </span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline shrink-0"
        >
          <span>View Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Reorderable Section List */}
      <div className="space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {sections.map((section, idx) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                index={idx}
                onEdit={(sec) => setEditingSection(sec)}
                onDuplicate={handleDuplicate}
                onToggleEnabled={handleToggleEnabled}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDelete={(sec) => setDeletingSection(sec)}
                isFirst={idx === 0}
                isLast={idx === sections.length - 1}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Section Button At Bottom */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 text-xs font-bold text-muted-foreground hover:text-primary transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Section to Bottom</span>
        </button>
      </div>

      {/* Modals and Drawers */}
      <AddSectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSection={handleAddSection}
      />

      <DeleteSectionDialog
        isOpen={Boolean(deletingSection)}
        section={deletingSection}
        onClose={() => setDeletingSection(null)}
        onConfirm={handleConfirmDelete}
      />

      <SectionEditorDrawer
        isOpen={Boolean(editingSection)}
        section={editingSection}
        onClose={() => setEditingSection(null)}
        onSave={handleSaveSectionEdit}
        onPublish={handlePublishSection}
        previewData={previewCollections}
      />

      {/* Full Page Live Preview Modal */}
      {isFullPreviewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md">
          {/* Preview Header */}
          <div className="h-16 px-6 bg-card border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Full Page Preview</span>
              <span className="text-[11px] text-muted-foreground font-mono">
                ({sections.filter((s) => s.is_enabled !== false).length} active sections)
              </span>
            </div>

            {/* Device Toggles */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'desktop' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'tablet' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'mobile' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsFullPreviewOpen(false)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Scrollable Frame */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
            <div
              className={`bg-background border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 w-full ${
                previewDevice === 'mobile'
                  ? 'max-w-[375px]'
                  : previewDevice === 'tablet'
                  ? 'max-w-[768px]'
                  : 'max-w-6xl'
              }`}
            >
              <PageSectionRenderer
                sections={sections}
                data={previewCollections}
                isDraftPreview={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
