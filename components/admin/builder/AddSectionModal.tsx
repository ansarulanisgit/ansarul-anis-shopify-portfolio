'use client';

import * as React from 'react';
import {
  X,
  Sparkles,
  Award,
  FolderGit2,
  ShoppingBag,
  MessageSquareQuote,
  User,
  HelpCircle,
  Mail,
  Layers,
  Zap,
  Columns,
  BarChart3,
  ShieldCheck,
  Image as ImageIcon,
  Video,
  SeparatorHorizontal,
  LayoutGrid,
  Search,
  Plus,
} from 'lucide-react';
import { SECTION_DEFINITIONS } from '@/lib/sections/defaults';
import { SectionType } from '@/lib/sections/types';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (type: SectionType) => void;
}

const iconComponentMap: Record<string, React.ElementType> = {
  Navigation: Layers,
  Sparkles,
  Award,
  FolderGit2,
  ShoppingBag,
  MessageSquareQuote,
  User,
  HelpCircle,
  Mail,
  Layers,
  Zap,
  Columns,
  BarChart3,
  ShieldCheck,
  Image: ImageIcon,
  Video,
  SeparatorHorizontal,
  LayoutGrid,
};

export function AddSectionModal({ isOpen, onClose, onAddSection }: AddSectionModalProps) {
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'core' | 'content' | 'media' | 'layout'>('all');

  if (!isOpen) return null;

  const sectionTypes = Object.keys(SECTION_DEFINITIONS) as SectionType[];

  const filteredSections = sectionTypes.filter((type) => {
    const def = SECTION_DEFINITIONS[type];
    const matchesSearch =
      def.title.toLowerCase().includes(search.toLowerCase()) ||
      def.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || def.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Add Page Section</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose a section type to insert into your public page layout.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search section types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-background text-xs"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            {(['all', 'core', 'content', 'media', 'layout'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSections.map((type) => {
            const def = SECTION_DEFINITIONS[type];
            const Icon = iconComponentMap[def.iconName] || LayoutGrid;

            return (
              <div
                key={type}
                onClick={() => {
                  onAddSection(type);
                  onClose();
                }}
                className="group p-4 rounded-xl border border-border/80 bg-background hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {def.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {def.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {def.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-border/50 flex items-center gap-1 text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Section</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
