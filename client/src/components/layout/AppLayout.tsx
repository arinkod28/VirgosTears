import React from 'react';
import { useRouter } from 'next/router';
import { Dock, DockIcon } from '../ui/dock';
import { LayoutDashboard, Shield, FileText, MessageCircle, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  tenant?: string;
}

const NAV = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Controls', href: '/controls', icon: Shield },
  { label: 'Evidence', href: '/evidence', icon: FileText },
  { label: 'AI Assistant', href: '/assistant', icon: MessageCircle },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function AppLayout({ children, tenant = 'Contoso Defense Corp' }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Header */}
      <div className="bg-navy-800 border-b border-navy-600 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">CMMC Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Level 2 &bull; Azure</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <span className="text-xs text-slate-400">Azure: {tenant}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>

      {/* Bottom Dock Navigation */}
      <Dock className="dark:from-navy-950 dark:to-navy-900 dark:border-navy-800 bg-navy-800 border-navy-600">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = router.pathname === href;
          return (
            <DockIcon
              key={href}
              href={href}
              name={label}
              active={active}
              icon={<Icon size={24} />}
            />
          );
        })}
      </Dock>
    </div>
  );
}
