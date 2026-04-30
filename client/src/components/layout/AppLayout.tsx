import React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Dock, DockIcon } from '../ui/dock';
import { LayoutDashboard, Shield, FileText, MessageCircle, BarChart3, LogOut } from 'lucide-react';

const Waves = dynamic(
  () => import('../ui/wave-background').then((m) => ({ default: m.Waves })),
  { ssr: false }
);

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

  const handleLogout = () => {
    localStorage.removeItem('cmmc_authed');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col relative">
      {/* Wave Background */}
      <Waves strokeColor="#60a5fa" backgroundColor="#0a0f1e" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-navy-800/80 backdrop-blur-sm border-b border-navy-600 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">CMMC Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Level 2 &bull; Azure</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <span className="text-xs text-slate-400">Azure: {tenant}</span>
          </div>
        </div>

        {/* Main Content with bottom padding for fixed dock */}
        <main className="flex-1 p-8 overflow-auto pb-32">{children}</main>

        {/* Bottom Dock Navigation - Fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-navy-900/80 backdrop-blur-sm border-t border-navy-600 flex justify-center z-50">
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
            
            {/* Logout Button */}
            <li
              style={{
                transition: "width, height, margin-top, cubic-bezier(0.25, 1, 0.5, 1) 150ms",
                "--icon-size": "48px",
              } as React.CSSProperties}
              className="icon group/li flex h-[48px] w-[48px] cursor-pointer items-center justify-center px-[calc(48px*0.075)] hover:-mt-[calc(48px/2)] hover:h-[calc(48px*1.5)] hover:w-[calc(48px*1.5)]"
            >
              <button
                onClick={handleLogout}
                className="group/a relative aspect-square w-full rounded-[10px] border border-gray-100 bg-gradient-to-t from-neutral-100 to-white p-1.5 shadow-[rgba(0,_0,_0,_0.05)_0px_1px_0px_inset] after:absolute after:inset-0 after:rounded-[inherit] after:shadow-md after:shadow-zinc-800/10 hover:from-red-600/20 hover:to-red-500/20 hover:border-red-400 dark:border-zinc-900 dark:from-zinc-900 dark:to-zinc-800"
              >
                <span className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 rounded-md border border-gray-100 bg-gradient-to-t from-neutral-100 to-white p-1 px-2 text-xs whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/li:opacity-100 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:text-white">
                  Logout
                </span>
                <div className="h-full w-full rounded-[inherit] flex items-center justify-center text-slate-600 group-hover/a:text-red-600 dark:text-slate-400">
                  <LogOut size={24} />
                </div>
              </button>
            </li>
          </Dock>
        </div>
      </div>
    </div>
  );
}
