'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, LogOut, User, Sparkles, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/theme-toggle';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  adminEmail?: string;
}

export function AdminHeader({ onToggleMobileMenu, adminEmail }: AdminHeaderProps) {
  const router = useRouter();
  const [userEmail, setUserEmail] = React.useState<string>(adminEmail || 'admin@portfolio.dev');
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }
      } catch {
        // Fallback email
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear demo cookie if present
      document.cookie = 'demo_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card px-4 sm:px-6 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-foreground hover:bg-muted"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-medium bg-muted/60 px-3 py-1.5 rounded-lg border border-border/50">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Shopify Developer Portfolio CMS</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-primary" />
          <span>Live Site</span>
        </Link>

        <ThemeToggle />

        {/* User Identity Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="max-w-[180px] truncate">{userEmail}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 border border-destructive/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </header>
  );
}
