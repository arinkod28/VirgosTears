import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  tenant: string;
}

export default function AppLayout({ children, tenant }: LayoutProps) {
  return (
    <div className="min-h-screen bg-navy-900 flex">
      <aside className="w-64 bg-navy-800 border-r border-navy-600 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight">CMMC Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Level 2 &bull; Azure</p>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem label="Dashboard" active />
          <NavItem label="Controls" />
          <NavItem label="Evidence" />
          <NavItem label="AI Assistant" />
          <NavItem label="Reports" />
        </nav>

        <div className="mt-auto pt-4 border-t border-navy-600 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-400 truncate">Azure: {tenant}</span>
          </div>
          <p className="text-[10px] text-slate-600">CMMC Level 2 &bull; 6 controls active</p>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function NavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
        active
          ? 'bg-blue-600/20 text-blue-400 font-medium'
          : 'text-slate-400 hover:bg-navy-700 hover:text-slate-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-blue-400' : 'bg-slate-600'}`} />
      {label}
    </div>
  );
}
