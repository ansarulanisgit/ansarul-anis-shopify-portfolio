'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function AccordionItem({ title, children, isOpen, onToggle, className }: AccordionItemProps) {
  return (
    <div className={cn('border-b border-border/80 py-4 transition-colors', className)}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left font-medium text-foreground transition-all hover:text-primary focus:outline-none group"
        aria-expanded={isOpen}
      >
        <span className="text-base sm:text-lg font-semibold pr-4">{title}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:text-foreground',
            isOpen && 'rotate-180 text-primary'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({
  items,
  className,
  allowMultiple = false,
}: {
  items: { id: string; question: string; answer: string }[];
  className?: string;
  allowMultiple?: boolean;
}) {
  const [openIds, setOpenIds] = React.useState<string[]>(items[0]?.id ? [items[0].id] : []);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('w-full divide-y divide-border/60', className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          title={item.question}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
        >
          {item.answer}
        </AccordionItem>
      ))}
    </div>
  );
}
