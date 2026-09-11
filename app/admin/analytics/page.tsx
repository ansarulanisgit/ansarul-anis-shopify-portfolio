'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Users,
  Eye,
  Clock,
  MousePointerClick,
  Activity,
  Globe2,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  TrendingUp,
  MessageCircle,
  Mail,
  FolderGit2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface StatsResponse {
  active_now: number;
  time_range: string;
  summary: {
    total_visitors: number;
    total_page_views: number;
    total_cta_clicks: number;
    ctr_percent: string;
    avg_duration_seconds: number;
    avg_duration_formatted: string;
    bounce_rate: string;
  };
  device_breakdown: Array<{ name: string; count: number; percentage: number; color: string }>;
  location_breakdown: Array<{ country: string; flag: string; visitors: number; percentage: number }>;
  cta_breakdown: Array<{ id: string; name: string; clicks: number; rate: string }>;
  time_series: Array<{ name: string; visitors: number; clicks: number }>;
  recent_events: Array<{
    id: string;
    event_type: string;
    label: string;
    location: string;
    device: string;
    created_at: string;
  }>;
}

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState<'today' | '7d' | '30d' | '90d'>('30d');
  const [data, setData] = React.useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<string>('Just now');

  const loadAnalytics = React.useCallback(async (range: string, showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/analytics/stats?range=${range}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        const d = new Date();
        setLastUpdated(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch {
      // Non-blocking
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadAnalytics(timeRange);
    // Polling every 12 seconds for real-time live presence updates
    const interval = setInterval(() => loadAnalytics(timeRange, false), 12000);
    return () => clearInterval(interval);
  }, [timeRange, loadAnalytics]);

  const activeNow = data?.active_now ?? 0;
  const summary = data?.summary || {
    total_visitors: 0,
    total_page_views: 0,
    total_cta_clicks: 0,
    ctr_percent: '0.0',
    avg_duration_seconds: 0,
    avg_duration_formatted: '0s',
    bounce_rate: '0.0%',
  };
  const timeSeries = data?.time_series || [];
  const deviceBreakdown = data?.device_breakdown || [];
  const locationBreakdown = data?.location_breakdown || [];
  const ctaBreakdown = data?.cta_breakdown || [];
  const recentEvents = data?.recent_events || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Real-Time Site Analytics
            </h1>
            {/* Live Pulse Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>{activeNow} Online Now</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Live visitor telemetry, device distributions, geographic insights, and CTA button conversions.
          </p>
        </div>

        {/* Action Controls & Date Range Filter */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => loadAnalytics(timeRange, true)}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-xs"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          </button>

          <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl text-xs font-semibold shadow-xs">
            {(
              [
                { id: 'today', label: 'Today' },
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '90d', label: '90 Days' },
              ] as const
            ).map((r) => (
              <button
                key={r.id}
                onClick={() => setTimeRange(r.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === r.id
                    ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Row (5 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Total Visitors */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Visitors</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {isLoading ? '...' : summary.total_visitors.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
            <span>{summary.total_visitors > 0 ? `${summary.total_visitors} unique visitors` : 'No visits recorded yet'}</span>
          </div>
        </div>

        {/* 2. Page Views */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Page Views</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {isLoading ? '...' : summary.total_page_views.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground font-semibold">
            {summary.total_visitors > 0
              ? `${(summary.total_page_views / summary.total_visitors).toFixed(1)} views / visitor`
              : '0 views / visitor'}
          </div>
        </div>

        {/* 3. Avg Duration */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg. Duration</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {isLoading ? '...' : summary.avg_duration_formatted}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {summary.avg_duration_seconds > 0 ? 'Active session dwell' : 'No duration logged'}
          </div>
        </div>

        {/* 4. CTA Clicks */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">CTA Clicks</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {isLoading ? '...' : summary.total_cta_clicks.toLocaleString()}
          </div>
          <div className="text-xs text-primary font-bold">
            {summary.ctr_percent}% Conversion Rate
          </div>
        </div>

        {/* 5. Bounce Rate */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Bounce Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {isLoading ? '...' : summary.bounce_rate}
          </div>
          <div className="text-xs text-muted-foreground font-semibold">
            {summary.total_visitors > 0
              ? `${(100 - parseFloat(summary.bounce_rate || '0')).toFixed(1)}% retention rate`
              : '0.0% retention rate'}
          </div>
        </div>
      </div>

      {/* Main Charts Row: Audience Visits & Conversions Over Time */}
      <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span>Audience Visit Counts &amp; CTA Clicks Over Time</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Dynamic calendar date tracking of visitors vs. high-intent call-to-action button clicks ({timeRange})
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-foreground">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span>Audience Visitors</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>CTA Clicks</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF2A51" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FF2A51" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} minTickGap={16} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                name="Visitors"
                stroke="#FF2A51"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorVisitors)"
              />
              <Area
                type="monotone"
                dataKey="clicks"
                name="CTA Clicks"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorClicks)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Devices & Geographic Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Device Distribution */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>Devices Breakdown</span>
            </h2>
            <p className="text-xs text-muted-foreground">Screen hardware detected from visiting traffic</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
            {deviceBreakdown.map((d) => {
              const Icon = d.name === 'Mobile' ? Smartphone : d.name === 'Tablet' ? Tablet : Monitor;
              return (
                <div key={d.name} className="p-3 rounded-xl bg-muted/40 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Icon className="w-3.5 h-3.5" style={{ color: d.color }} />
                    <span className="text-[11px] font-semibold">{d.name}</span>
                  </div>
                  <div className="text-base font-extrabold text-foreground">{d.percentage}%</div>
                  <div className="text-[10px] text-muted-foreground">{d.count} visits</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Locations */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-purple-500" />
                <span>Top Audience Locations</span>
              </h2>
              <p className="text-xs text-muted-foreground">Visitor origins ranked by country volume</p>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-2 py-1 rounded-lg">
              Geo IP Telemetry
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {locationBreakdown.map((loc) => (
              <div key={loc.country} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="text-base">{loc.flag}</span>
                    <span>{loc.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{loc.visitors} visits</span>
                    <span className="font-bold text-foreground w-10 text-right">{loc.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    style={{ width: `${loc.percentage}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Grid: CTA Buttons Breakdown & Live Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CTA Button Click Matrix */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-emerald-500" />
                <span>Call to Action Clicks</span>
              </h2>
              <p className="text-xs text-muted-foreground">Conversion triggers by interactive button</p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              {summary.total_cta_clicks} Total Clicks
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {ctaBreakdown.map((cta) => (
              <div
                key={cta.id}
                className="p-3 rounded-xl bg-background border border-border/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {cta.id === 'whatsapp' ? (
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    ) : cta.id === 'form_submit' ? (
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                    ) : cta.id === 'case_study_view' ? (
                      <FolderGit2 className="w-3.5 h-3.5 text-purple-500" />
                    ) : (
                      <MousePointerClick className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{cta.name}</div>
                    <div className="text-[11px] text-muted-foreground">{cta.clicks} total interactions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-foreground">{cta.rate}</div>
                  <div className="text-[10px] text-muted-foreground">share of clicks</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Live Activity Feed */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span>Live Telemetry Activity Feed</span>
              </h2>
              <span className="text-[11px] text-muted-foreground font-mono">
                Updated {lastUpdated}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Chronological stream of incoming client interactions</p>
          </div>

          <div className="space-y-2.5 divide-y divide-border/30">
            {recentEvents.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Listening for real-time telemetry events...
              </div>
            ) : (
              recentEvents.map((evt, idx) => (
                <div key={evt.id || idx} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        evt.event_type === 'whatsapp_click'
                          ? 'bg-emerald-500'
                          : evt.event_type === 'form_submit'
                          ? 'bg-blue-500'
                          : evt.event_type === 'cta_click'
                          ? 'bg-primary'
                          : 'bg-muted-foreground/60'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-foreground">{evt.label}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span>{evt.location}</span>
                        <span>&middot;</span>
                        <span className="capitalize">{evt.device}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                    {evt.created_at ? new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Encrypted privacy-safe visitor telemetry</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Telemetry Pipeline Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
