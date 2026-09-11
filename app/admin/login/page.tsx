'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!isConfigured) {
        // Fallback demo mode login
        document.cookie = 'demo_admin_session=true; path=/; max-age=86400; SameSite=Lax';
        router.push('/admin');
        router.refresh();
        return;
      }

      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-muted/20 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-card border border-border/80 shadow-xl">
        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-md mb-4 shadow-primary/25">
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Access</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Sign in to manage everything in your site
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email Address</label>
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-9"
              />
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-9 pr-10"
              />
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-accent-800 text-white hover:bg-accent-700 dark:bg-primary dark:text-primary-foreground font-semibold text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </form>

        {/* Footer Credit */}
        <div className="mt-6 pt-6 border-t border-border/80 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            Developed by Ansarul Anis
          </p>
        </div>
      </div>
    </div>
  );
}
