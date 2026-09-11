import * as React from 'react';
import { getSiteSettings } from '@/lib/data/queries';
import { WhatsAppButton } from '@/components/site/WhatsAppButton';
import { BackToTopButton } from '@/components/site/BackToTopButton';
import { ExitIntentModal } from '@/components/site/ExitIntentModal';
import { AnalyticsTracker } from '@/components/site/AnalyticsTracker';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="relative flex min-h-screen flex-col">
      <AnalyticsTracker />
      <main className="flex-1">{children}</main>
      <WhatsAppButton
        whatsappNumber={settings.whatsapp_number}
        whatsappMessage={settings.whatsapp_message}
      />
      <BackToTopButton />
      <ExitIntentModal
        whatsappNumber={settings.whatsapp_number}
        whatsappMessage={settings.whatsapp_message}
      />
    </div>
  );
}
