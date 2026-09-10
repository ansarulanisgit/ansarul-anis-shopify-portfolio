import * as React from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Sparkles,
  Inbox,
  ArrowUpRight,
  Clock,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { getProjects, getServices, getLeads, getTestimonials } from '@/lib/data/queries';
import { Badge } from '@/components/ui/badge';
import { formatTimeAgo } from '@/lib/utils';
import { RealtimeDashboardBanner } from '@/components/admin/RealtimeDashboardBanner';

export default async function AdminDashboardPage() {
  const [projects, services, leads, testimonials] = await Promise.all([
    getProjects(false),
    getServices(),
    getLeads(),
    getTestimonials(false),
  ]);

  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Portfolio Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Welcome back! Here is a summary of your portfolio content, case studies, and client leads.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-xs"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Real-Time Live Analytics Banner */}
      <RealtimeDashboardBanner />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Leads */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Leads</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">{leads.length}</div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-500">{newLeadsCount} new</span> awaiting response
          </div>
        </div>

        {/* Projects */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Case Studies</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">{projects.length}</div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span className="font-semibold text-foreground">{publishedCount} published</span> live
          </div>
        </div>

        {/* Services */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Services</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">{services.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {services.filter((s) => s.featured).length} featured on homepage
          </div>
        </div>

        {/* Testimonials */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Testimonials</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-foreground">{testimonials.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {testimonials.filter((t) => t.featured).length} currently displayed
          </div>
        </div>
      </div>

      {/* Recent Incoming Leads */}
      <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Client Inquiries</h2>
            <p className="text-xs text-muted-foreground">Latest leads from your contact form and WhatsApp</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-semibold text-primary dark:text-sky-400 hover:underline inline-flex items-center gap-1"
          >
            <span>View all leads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="pb-3 font-semibold">Client</th>
                <th className="pb-3 font-semibold">Project Type</th>
                <th className="pb-3 font-semibold">Budget</th>
                <th className="pb-3 font-semibold">Source</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {leads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-medium text-foreground">
                    <div>{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.email}</div>
                  </td>
                  <td className="py-3 text-muted-foreground">{lead.project_type || 'Custom'}</td>
                  <td className="py-3 font-medium text-foreground">{lead.budget_range || 'N/A'}</td>
                  <td className="py-3">
                    <Badge variant="outline" className="capitalize text-[11px]">
                      {lead.source.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={lead.status === 'new' ? 'default' : lead.status === 'won' ? 'success' : 'secondary'}
                      className="capitalize text-[11px]"
                    >
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right text-xs text-muted-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(lead.created_at)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
