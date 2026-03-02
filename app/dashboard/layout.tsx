'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Activity, BarChart2, ShieldAlert, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { state, resetApp } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!state.hasCompletedParQ || !state.profile) {
      router.push('/');
    }
  }, [state, router]);

  if (!state.profile) return null;

  const navItems = [
    { name: 'BioDashboard', href: '/dashboard', icon: Activity },
    { name: 'Performance', href: '/dashboard/history', icon: BarChart2 },
    { name: 'Safety', href: '/dashboard/safety', icon: ShieldAlert },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] lg:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-[var(--color-surface)] lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
          <Activity className="h-6 w-6 text-[var(--color-primary)]" />
          <span className="font-bold text-[var(--color-primary)]">BioAdaptive</span>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-muted)] hover:bg-gray-50 hover:text-[var(--color-text-main)]'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="mb-4 flex items-center gap-3 px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-[var(--color-primary)]">
              {state.profile.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--color-text-main)]">{state.profile.name}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{state.profile.goal}</span>
            </div>
          </div>
          <button
            onClick={() => {
              resetApp();
              router.push('/');
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Reset App
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-gray-200 bg-[var(--color-surface)] lg:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <item.icon className={`h-6 w-6 ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
