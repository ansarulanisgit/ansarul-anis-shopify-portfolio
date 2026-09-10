'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Sparkles, CheckCircle, AlertCircle, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '@/types/database.types';
import { SectionSettings } from '@/lib/sections/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface WorkSectionProps {
  projects?: Project[];
  sectionSettings?: SectionSettings;
}

const FILTER_CATEGORIES = [
  'All',
  'Ecommerce Store',
  'Landing Page',
  'Brand Website',
  'Product Launch',
  'Campaign',
  'Shopify Plus Store',
  'Headless Store',
] as const;

const ITEMS_PER_PAGE = 9;

export function WorkSection({ projects = [], sectionSettings }: WorkSectionProps) {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const eyebrow = sectionSettings?.eyebrow || 'Featured Case Studies';
  const heading = sectionSettings?.heading || 'Shopify Stores Built for Maximum Conversion';
  const subheading =
    sectionSettings?.subheading ||
    'Real client results combining direct-response UX architecture, custom Shopify 2.0 themes, and lightning-fast performance.';

  const filteredProjects = React.useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => {
      if (p.category === activeCategory) return true;
      const catLower = activeCategory.toLowerCase();
      return (
        p.title.toLowerCase().includes(catLower) ||
        p.summary.toLowerCase().includes(catLower)
      );
    });
  }, [projects, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));

  const paginatedProjects = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleOpenCaseStudy = async (project: Project) => {
    setSelectedProject(project);
    try {
      await fetch('/api/cta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'case_study_click',
          source_section: `project_${project.slug}`,
        }),
      });
    } catch {
      // Non-blocking
    }
  };

  const showFilters = sectionSettings?.show_filters !== false;

  return (
    <section id="work" className="py-24 sm:py-32 relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* Category Filters Bar */}
        {showFilters && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {FILTER_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/50'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}

        {/* Project Cards Grid (Paginated to 9 per page) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProjects.map((project, index) => {
            const coverImage =
              project.images && project.images.length > 0
                ? project.images[0].image_url
                : 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80';

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                className="group relative flex flex-col rounded-[14px] bg-card border border-border/80 hover:border-primary/50 shadow-sm hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/50">
                  <Image
                    src={coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  
                  {/* Category Tag Badge in top left */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-background/90 backdrop-blur-md border border-border/60 text-foreground text-xs font-semibold shadow-xs">
                      <Sparkles className="w-3 h-3 text-primary" />
                      {project.category || 'Shopify Build'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-6">
                  {/* Tech stack tags */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-[8px] bg-secondary/80 text-secondary-foreground border border-border/50 group-hover:border-primary/20 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-xl font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug tracking-tight">
                    {project.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-4">
                    {project.summary}
                  </p>

                  {/* Action Link / Buttons */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2 mt-auto">
                    <button
                      onClick={() => handleOpenCaseStudy(project)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm font-bold transition-all duration-200 group/btn"
                    >
                      <span>View Case Study</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </button>

                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] border border-border hover:border-primary/40 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                        title="Open live store"
                      >
                        <span>Live Store</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Centered Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-border bg-card text-xs sm:text-sm font-bold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    currentPage === pageNum
                      ? 'bg-primary text-primary-foreground shadow-md scale-105'
                      : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-border bg-card text-xs sm:text-sm font-bold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Case Study Deep-Dive Modal / Fullscreen Sheet */}
      <Dialog
        open={Boolean(selectedProject)}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        {selectedProject && (
          <div>
            <DialogHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedProject.tech_stack.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              <DialogTitle>{selectedProject.title}</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {selectedProject.summary}
              </DialogDescription>
            </DialogHeader>

            {/* Case Study Gallery */}
            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-6 bg-muted border border-border">
                <Image
                  src={selectedProject.images[0].image_url}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Problem, Solution, Result Grid */}
            <div className="space-y-6">
              {/* Problem */}
              <div className="p-4 sm:p-5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm mb-1.5 uppercase tracking-wide">
                  <AlertCircle className="w-4 h-4" /> The Challenge & Bottleneck
                </div>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                  {selectedProject.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40">
                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1.5 uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4" /> The Strategic Solution
                </div>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                  {selectedProject.solution}
                </p>
              </div>

              {/* Result */}
              <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1.5 uppercase tracking-wide">
                  <CheckCircle className="w-4 h-4" /> The Revenue & Conversion Lift
                </div>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
                  {selectedProject.result}
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              {selectedProject.live_url && (
                <a
                  href={selectedProject.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Visit Live Store</span>
                </a>
              )}
              <button
                onClick={() => {
                  setSelectedProject(null);
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-[10px] bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
              >
                Hire Me for Similar Project
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  );
}
