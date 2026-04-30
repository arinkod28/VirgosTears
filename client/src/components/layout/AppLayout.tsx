import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  connected: boolean;
  tenant: string | null;
}

/**
 * Main app shell — sidebar + top bar + content area
 * TODO: Build out sidebar with nav links (Dashboard, Controls, Evidence, Chat)
 */
export default function AppLayout({ children, connected, tenant }: LayoutProps) {
  return (
    <div className="min-h-screen bg-navy-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-800 border-r border-navy-600 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight">CMMC Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Level 2 • Azure</p>
        </div>

        <nav className="flex-1 space-y-2">
          {/* TODO: Add navigation items */}
          <div className="text-sm text-slate-500">Dashboard</div>
          <div className="text-sm text-slate-500">Controls</div>
          <div className="text-sm text-slate-500">Evidence</div>
          <div className="text-sm text-slate-500">AI Assistant</div>
        </nav>

        <div className="mt-auto pt-4 border-t border-navy-600">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-xs text-slate-400">
              {connected ? `Azure: ${tenant}` : 'Not connected'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
