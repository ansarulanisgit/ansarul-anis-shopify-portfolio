'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  Sparkles,
  MessageSquareQuote,
  HelpCircle,
  Inbox,
  Search,
  Settings,
  BarChart3,
  Image as ImageIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/builder', label: 'Front-End Builder', icon: Layers },
  { href: '/admin/design', label: 'Customization', icon: Palette },
  { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/admin/services', label: 'Services', icon: Sparkles },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/faq', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/leads', label: 'Leads Inbox', icon: Inbox },
  { href: '/admin/seo', label: 'SEO Settings', icon: Search },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
];

export function AdminSidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed md:sticky top-0 h-screen inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300 shrink-0 select-none',
          isCollapsed ? 'w-20' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            'h-16 flex items-center px-4 border-b border-border',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-base shadow-sm">
              A
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-foreground">AnisShopify</span>
                <span className="text-[11px] text-muted-foreground">Admin Studio</span>
              </div>
            )}
          </Link>

          {/* Close for mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div
          className={cn(
            'flex-1 py-4 px-3 space-y-1.5',
            isCollapsed ? 'overflow-visible' : 'overflow-y-auto'
          )}
        >
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center rounded-xl text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-accent-800 text-white shadow-sm dark:bg-primary dark:text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70',
                  isCollapsed
                    ? 'w-10 h-10 mx-auto justify-center p-0'
                    : 'gap-3 px-3 py-2.5'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white dark:text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}

                {/* Nice Tooltip with Primary Color Background on Hover */}
                {isCollapsed && (
                  <div
                    role="tooltip"
                    className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xl shadow-primary/25 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50 flex items-center -translate-x-1 group-hover:translate-x-0 select-none"
                  >
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rotate-45" />
                    <span className="relative z-10">{item.label}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section - Fixed to bottom left */}
        <div className="p-3 border-t border-border space-y-2 bg-card/95 backdrop-blur-sm mt-auto shrink-0 relative overflow-visible">
          <Link
            href="/"
            target="_blank"
            className={cn(
              'flex items-center rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-border/60 bg-background/60 shadow-xs group relative',
              isCollapsed
                ? 'w-10 h-10 mx-auto justify-center p-0 hover:border-primary/40'
                : 'w-full gap-2.5 px-3 py-2.5'
            )}
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-primary" />
            {!isCollapsed && <span>View Live Site</span>}

            {/* Nice Tooltip with Primary Color Background */}
            {isCollapsed && (
              <div
                role="tooltip"
                className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xl shadow-primary/25 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50 flex items-center -translate-x-1 group-hover:translate-x-0 select-none"
              >
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rotate-45" />
                <span className="relative z-10">View Live Site</span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle at bottom */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={cn(
                'hidden md:flex items-center rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-border/60 bg-background/60 shadow-xs group relative',
                isCollapsed
                  ? 'w-10 h-10 mx-auto justify-center p-0 hover:border-border'
                  : 'w-full gap-2.5 px-3 py-2.5'
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 shrink-0" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                  <span>Collapse Sidebar</span>
                </>
              )}

              {/* Nice Tooltip with Primary Color Background */}
              {isCollapsed && (
                <div
                  role="tooltip"
                  className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xl shadow-primary/25 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50 flex items-center -translate-x-1 group-hover:translate-x-0 select-none"
                >
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rotate-45" />
                  <span className="relative z-10">Expand Sidebar</span>
                </div>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
