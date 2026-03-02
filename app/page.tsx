'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Activity } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { state } = useAppStore();

  useEffect(() => {
    if (!state.hasCompletedParQ) {
      router.push('/onboarding/parq');
    } else if (!state.profile) {
      router.push('/onboarding/profile');
    } else {
      router.push('/dashboard');
    }
  }, [state, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-background)]">
      <div className="flex flex-col items-center gap-4 text-[var(--color-primary)]">
        <Activity className="h-12 w-12 animate-pulse" />
        <p className="text-lg font-medium">Loading BioAdaptive System...</p>
      </div>
    </div>
  );
}
