import React from 'react';
import type { DashboardStats } from '../../types';

interface Props {
  stats: DashboardStats | null;
}

export default function StatsBar({ stats }: Props) {
  if (!stats) {
    return (
      <div className="bg-navy-700 border border-navy-600 rounded-lg p-4 text-sm text-slate-400 animate-pulse">
        Loading compliance data&hellip;
      </div>
    );
  }

  const cards = [
    { label: 'Controls Monitored', value: stats.total, color: 'text-blue-400' },
    { label: 'Passing', value: stats.passing, color: 'text-green-400' },
    { label: 'Failing', value: stats.failing, color: 'text-red-400' },
    { label: 'Warnings', value: stats.warnings, color: 'text-amber-400' },
    { label: 'Compliance Rate', value: `${stats.complianceRate}%`, color: 'text-white' },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-navy-700/80 rounded-lg p-4 border border-navy-500/60 backdrop-blur-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider">{card.label}</p>
          <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
