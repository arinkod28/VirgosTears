import React, { useState, useMemo } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { CMMC_DOMAINS, ALL_CONTROLS, TOTAL_CONTROLS, MONITORED_COUNT } from '../data/cmmcAllControls';

const DOMAIN_COLORS: Record<string, string> = {
  blue: 'border-blue-500/60 bg-blue-500/15',
  purple: 'border-purple-500/60 bg-purple-500/15',
  green: 'border-green-500/60 bg-green-500/15',
  orange: 'border-orange-500/60 bg-orange-500/15',
  cyan: 'border-cyan-500/60 bg-cyan-500/15',
  red: 'border-red-500/60 bg-red-500/15',
  yellow: 'border-yellow-500/60 bg-yellow-500/15',
  indigo: 'border-indigo-500/60 bg-indigo-500/15',
  pink: 'border-pink-500/60 bg-pink-500/15',
  teal: 'border-teal-500/60 bg-teal-500/15',
  amber: 'border-amber-500/60 bg-amber-500/15',
  lime: 'border-lime-500/60 bg-lime-500/15',
  violet: 'border-violet-500/60 bg-violet-500/15',
  emerald: 'border-emerald-500/60 bg-emerald-500/15',
};

const DOMAIN_BADGE: Record<string, string> = {
  blue: 'bg-blue-500/20 text-blue-300',
  purple: 'bg-purple-500/20 text-purple-300',
  green: 'bg-green-500/20 text-green-300',
  orange: 'bg-orange-500/20 text-orange-300',
  cyan: 'bg-cyan-500/20 text-cyan-300',
  red: 'bg-red-500/20 text-red-300',
  yellow: 'bg-yellow-500/20 text-yellow-300',
  indigo: 'bg-indigo-500/20 text-indigo-300',
  pink: 'bg-pink-500/20 text-pink-300',
  teal: 'bg-teal-500/20 text-teal-300',
  amber: 'bg-amber-500/20 text-amber-300',
  lime: 'bg-lime-500/20 text-lime-300',
  violet: 'bg-violet-500/20 text-violet-300',
  emerald: 'bg-emerald-500/20 text-emerald-300',
};

export default function ControlsPage() {
  const [search, setSearch] = useState('');
  const [monitoredOnly, setMonitoredOnly] = useState(false);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set(CMMC_DOMAINS.map((d) => d.code)));

  const toggle = (code: string) =>
    setExpandedDomains((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CMMC_DOMAINS.map((domain) => ({
      ...domain,
      controls: domain.controls.filter((c) => {
        if (monitoredOnly && !c.monitored) return false;
        if (!q) return true;
        return (
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        );
      }),
    })).filter((d) => d.controls.length > 0);
  }, [search, monitoredOnly]);

  const matchCount = filtered.reduce((s, d) => s + d.controls.length, 0);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">CMMC 2.0 Controls</h1>
          <p className="text-sm text-slate-400 mt-1">
            All {TOTAL_CONTROLS} Level 2 practices &mdash; {MONITORED_COUNT} actively monitored via Azure
          </p>
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs bg-navy-700 border border-navy-600 text-slate-300">
            {TOTAL_CONTROLS} total requirements
          </span>
          <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 border border-blue-500/30 text-blue-300">
            {MONITORED_COUNT} monitored by this dashboard
          </span>
          <span className="px-3 py-1 rounded-full text-xs bg-navy-700 border border-navy-600 text-slate-400">
            {CMMC_DOMAINS.length} domains
          </span>
        </div>

        {/* Filters */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, or description..."
            className="flex-1 max-w-md bg-navy-700 border border-navy-600 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={() => setMonitoredOnly(!monitoredOnly)}
            className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
              monitoredOnly
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                : 'bg-navy-700 border-navy-600 text-slate-400 hover:text-slate-200'
            }`}
          >
            {monitoredOnly ? '★ Monitored only' : '☆ Show all'}
          </button>
          {search && (
            <span className="text-xs text-slate-500">{matchCount} results</span>
          )}
        </div>

        {/* Domain sections */}
        <div className="space-y-4">
          {filtered.map((domain) => {
            const open = expandedDomains.has(domain.code);
            const borderCls = DOMAIN_COLORS[domain.color] || DOMAIN_COLORS.blue;
            const badgeCls = DOMAIN_BADGE[domain.color] || DOMAIN_BADGE.blue;
            const monCount = domain.controls.filter((c) => c.monitored).length;

            return (
              <div key={domain.code} className={`rounded-xl border ${borderCls}`}>
                {/* Domain header */}
                <button
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => toggle(domain.code)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${badgeCls}`}>
                      {domain.code}
                    </span>
                    <span className="text-sm font-semibold text-slate-200">{domain.name}</span>
                    <span className="text-xs text-slate-500">{domain.controls.length} requirements</span>
                    {monCount > 0 && (
                      <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                        {monCount} monitored
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 text-sm">{open ? '▲' : '▼'}</span>
                </button>

                {/* Controls list */}
                {open && (
                  <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {domain.controls.map((control) => (
                      <div
                        key={control.id}
                        className={`rounded-lg p-3 border transition-colors ${
                          control.monitored
                            ? 'bg-blue-500/10 border-blue-500/30'
                            : 'bg-navy-800/60 border-navy-600/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-slate-400">{control.id}</span>
                            {control.monitored && (
                              <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                                MONITORED
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs font-semibold text-slate-200 mb-1">{control.title}</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{control.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
