import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit, Inter, Space_Grotesk, Syne } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AppearanceProvider } from '@/components/appearance-provider';
import { getSiteSettings } from '@/lib/data/queries';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'AnisShopify | Ansarul Anis - Shopify Website Design & Store Development',
    template: '%s | AnisShopify',
  },
  description: 'Freelance Shopify developer Ansarul Anis (AnisShopify) crafting high-converting custom Shopify 2.0 themes, direct-response landing pages, and headless e-commerce architectures.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme={settings.appearance?.theme_preset || 'crimson'}
      data-font={settings.appearance?.font_preset || 'jakarta'}
      data-font-size={settings.appearance?.font_size || 'md'}
      data-style={settings.appearance?.style_preset || 'pill'}
      className={`${jakarta.variable} ${outfit.variable} ${inter.variable} ${spaceGrotesk.variable} ${syne.variable}`}
    >
      <head />
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppearanceProvider initialAppearance={settings.appearance}>
            {children}
          </AppearanceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
