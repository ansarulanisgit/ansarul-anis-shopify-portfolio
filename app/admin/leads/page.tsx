'use client';

import * as React from 'react';
import {
  Inbox,
  Search,
  Filter,
  Mail,
  MessageCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { Lead, LeadStatus, LeadSource } from '@/types/database.types';
import { defaultLeads } from '@/lib/data/seed-data';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function AdminLeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>(defaultLeads);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [sourceFilter, setSourceFilter] = React.useState<string>('all');
  const [expandedLeadId, setExpandedLeadId] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadLeads() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setLeads(data as Lead[]);
        }
      } catch {
        // Fallback
      }
    }
    loadLeads();

    // Supabase Realtime listener for incoming leads
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('placeholder')) return;

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('leads_realtime')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'leads' },
          (payload: any) => {
            if (payload.new) {
              setLeads((prev) => [payload.new as Lead, ...prev]);
              showNotification(`⚡ New lead received from ${payload.new.name}!`);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {}
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      const supabase = createClient();
      await (supabase.from('leads') as any).update({ status: newStatus }).eq('id', leadId);
      showNotification(`Lead status updated to ${newStatus}`);
    } catch {
      showNotification('Status updated locally');
    }
  };

  // Filter & Search Logic
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Summary statistics
  const emailLeadsCount = leads.filter((l) => l.source === 'email_form').length;
  const whatsappLeadsCount = leads.filter((l) => l.source === 'whatsapp').length;
  const wonLeadsCount = leads.filter((l) => l.status === 'won').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Leads Inbox</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review inquiries captured from your portfolio contact form and WhatsApp click-throughs.
        </p>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          {notification}
        </div>
      )}

      {/* Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted-foreground">Total Inquiries</div>
            <div className="text-2xl font-black text-foreground mt-1">{leads.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-primary dark:text-sky-400">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted-foreground">Channel Breakdown</div>
            <div className="text-xs font-medium text-foreground mt-1.5 flex gap-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" /> {emailLeadsCount} Form
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> {whatsappLeadsCount} WhatsApp
              </span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-muted text-muted-foreground">
            <Filter className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted-foreground">Won Deals</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {wonLeadsCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search by client name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </Select>

          {/* Source Filter */}
          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-36 text-xs"
          >
            <option value="all">All Sources</option>
            <option value="email_form">Email Form</option>
            <option value="whatsapp">WhatsApp</option>
          </Select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No leads match your current search and filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredLeads.map((lead) => {
              const isExpanded = expandedLeadId === lead.id;

              // Parse out subject if stored as [Subject: ...]
              const hasSubjectTag = lead.message.startsWith('[Subject: ');
              const subjectLine = hasSubjectTag
                ? lead.message.slice(10, lead.message.indexOf(']\n\n'))
                : null;
              const displayMessage = hasSubjectTag
                ? lead.message.slice(lead.message.indexOf(']\n\n') + 3)
                : lead.message;

              return (
                <div key={lead.id} className="transition-colors hover:bg-muted/20">
                  {/* Row Summary */}
                  <div
                    onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <div className="p-2.5 rounded-xl bg-muted text-foreground shrink-0 mt-1 sm:mt-0">
                        {lead.source === 'whatsapp' ? (
                          <MessageCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Mail className="w-4 h-4 text-primary dark:text-sky-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-sm text-foreground truncate">{lead.name}</h3>
                          <span className="text-xs text-muted-foreground truncate">&lt;{lead.email}&gt;</span>
                          {subjectLine && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                              {subjectLine}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                          <span>{lead.project_type || 'General Inquiry'}</span>
                          <span>•</span>
                          <span className="font-medium text-foreground">{lead.budget_range || 'Flexible'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                      {/* Inline Status Dropdown */}
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border appearance-none cursor-pointer focus:outline-none ${
                          lead.status === 'new'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                            : lead.status === 'won'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : lead.status === 'contacted'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="won">Won Deal</option>
                        <option value="lost">Lost</option>
                      </select>

                      <div className="text-right text-xs text-muted-foreground min-w-[70px]">
                        {formatTimeAgo(lead.created_at)}
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Message Box */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 bg-muted/40 border-t border-border/40 text-xs sm:text-sm">
                      {subjectLine && (
                        <div className="mb-3 p-3 rounded-lg bg-card border border-border flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject:</span>
                          <span className="text-sm font-extrabold text-foreground">{subjectLine}</span>
                        </div>
                      )}
                      <div className="mb-2 font-semibold text-foreground">Message:</div>
                      <div className="p-4 rounded-xl bg-card border border-border text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {displayMessage}
                      </div>
                      <div className="mt-4 flex gap-3">
                        <a
                          href={`mailto:${lead.email}?subject=${encodeURIComponent('Re: ' + (subjectLine || 'Your Shopify project inquiry'))}`}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent-800 text-white dark:bg-primary dark:text-primary-foreground font-semibold text-xs shadow-xs"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
