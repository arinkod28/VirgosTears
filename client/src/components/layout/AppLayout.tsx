import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  tenant?: string;
}

const NAV = [
  { label: 'Dashboard', href: '/' },
  { label: 'Controls', href: '/controls' },
  { label: 'Evidence', href: '/evidence' },
  { label: 'AI Assistant', href: '/assistant' },
  { label: 'Reports', href: '/reports' },
];

export default function AppLayout({ children, tenant = 'Contoso Defense Corp' }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-navy-900 flex">
      <aside className="w-64 bg-navy-800 border-r border-navy-600 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight">CMMC Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Level 2 &bull; Azure</p>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map(({ label, href }) => {
            const active = router.pathname === href;
            return (
              <Link key={href} href={href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    active
                      ? 'bg-blue-600/20 text-blue-400 font-medium'
                      : 'text-slate-400 hover:bg-navy-700 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-blue-400' : 'bg-slate-600'}`} />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-navy-600 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <span className="text-xs text-slate-400 truncate">Azure: {tenant}</span>
          </div>
          <p className="text-[10px] text-slate-600">CMMC Level 2 &bull; 6 controls active</p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
