'use client';

import * as React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { PageSection } from '@/types/database.types';

interface DeleteSectionDialogProps {
  section: PageSection | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (section: PageSection) => void;
}

export function DeleteSectionDialog({
  section,
  isOpen,
  onClose,
  onConfirm,
}: DeleteSectionDialogProps) {
  if (!isOpen || !section) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 text-left">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2.5 text-destructive font-bold text-base">
            <div className="w-8 h-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span>Delete {section.title}?</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          This will remove the section instance &ldquo;<strong className="text-foreground">{section.title}</strong>&rdquo; from your public page layout.
        </p>

        <div className="p-3 rounded-xl bg-muted/60 border border-border/70 text-[11px] text-muted-foreground">
          <strong>Note:</strong> The underlying reusable <code>{section.section_type}</code> component will remain available in your component library for future use.
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted text-foreground transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(section);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Section</span>
          </button>
        </div>
      </div>
    </div>
  );
}
