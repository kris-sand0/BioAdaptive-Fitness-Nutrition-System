'use client';

import { useAppStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Activity, Target } from 'lucide-react';

export default function HistoryPage() {
  const { state } = useAppStore();

  if (!state.profile) return null;

  const chartData = state.dailyLogs.map(log => ({
    date: format(parseISO(log.date), 'MMM dd'),
    steps: log.steps,
    goal: state.currentStepGoal,
    success: log.steps >= state.currentStepGoal
  }));

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">Performance History</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Consistency visualization</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Steps Chart */}
          <div className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-[var(--color-primary)]">
              <Activity className="h-5 w-5" />
              <h2 className="font-semibold">Step Consistency</h2>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-success)" stopOpacity={1}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="steps" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.success ? 'url(#colorSuccess)' : 'var(--color-alert)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Workout Consistency */}
          <div className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-[var(--color-primary)]">
              <Target className="h-5 w-5" />
              <h2 className="font-semibold">Workout Adherence</h2>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {state.dailyLogs.slice(-14).map((log, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group relative">
                  <div 
                    className={`h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      log.workoutCompleted ? 'bg-[var(--color-success)]' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {log.workoutCompleted ? '✓' : '-'}
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{format(parseISO(log.date), 'dd')}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 flex-col items-center group-hover:flex z-10 w-max">
                    <div className="rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg text-center">
                      <p className="font-semibold">{format(parseISO(log.date), 'MMM dd, yyyy')}</p>
                      <p>{log.steps.toLocaleString()} steps</p>
                      {log.workoutCompleted && log.workoutDuration && (
                        <p>{log.workoutDuration} min workout</p>
                      )}
                    </div>
                    <div className="h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-gray-900"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
