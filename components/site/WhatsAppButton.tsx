'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export function WhatsAppButton({
  whatsappNumber = '+8801709260934',
  whatsappMessage = 'Hi Anis! I visited your portfolio and I would like to discuss a Shopify project.',
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Show after slight scroll to not clutter initial hero view
    const handleScroll = () => {
      setIsVisible(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;

  const handleClick = async () => {
    try {
      await fetch('/api/cta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'whatsapp_click',
          source_section: 'floating_button',
        }),
      });
    } catch {
      // Non-blocking tracking
    }
  };

  if (!isVisible) return null;

  return (
    <motion.aside
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 left-6 z-40 pb-[env(safe-area-inset-bottom)]"
      aria-label="Floating Contact"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {/* Pulse ring */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30 -z-10" />

        <MessageCircle className="w-7 h-7" />

        {/* Hover Tooltip on desktop */}
        <span className="hidden md:group-hover:inline-block absolute left-16 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold whitespace-nowrap shadow-lg transition-opacity duration-200">
          Chat on WhatsApp
        </span>
      </a>
    </motion.aside>
  );
}
