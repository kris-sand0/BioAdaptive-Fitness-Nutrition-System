'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { AlertTriangle, MessageSquare, Phone, ShieldAlert } from 'lucide-react';

export default function SafetyPage() {
  const { state } = useAppStore();
  const [message, setMessage] = useState('');

  if (!state.profile) return null;

  const totalHrAlerts = state.dailyLogs.reduce((acc, log) => acc + (log.hrAlerts || 0), 0);

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">Safety & Contact</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Direct channel for support and health alerts</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Alerts Summary */}
          <div className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-[var(--color-primary)]">
              <ShieldAlert className="h-5 w-5" />
              <h2 className="font-semibold">Safety Summary</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex items-center gap-3 text-[var(--color-alert)]">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Total HR Alerts (7 days)</span>
                </div>
                <span className="text-xl font-bold text-[var(--color-alert)]">{totalHrAlerts}</span>
              </div>

              {totalHrAlerts > 3 && (
                <p className="text-sm text-[var(--color-text-muted)]">
                  You have experienced multiple high heart rate events recently. We recommend scheduling a check-in with your healthcare provider or adjusting your intensity goals.
                </p>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-[var(--color-primary)]">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-semibold">Report Pain or Injury</h2>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); setMessage(''); alert('Report submitted successfully. Our team will review it shortly.'); }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Describe your symptoms</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  placeholder="E.g., Sharp pain in lower back during deadlifts..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--color-primary)] py-3 font-medium text-white transition-colors hover:bg-opacity-90"
              >
                Submit Report
              </button>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
                <Phone className="h-5 w-5" />
                <span className="text-sm">Emergency Medical Services: <strong>911</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
