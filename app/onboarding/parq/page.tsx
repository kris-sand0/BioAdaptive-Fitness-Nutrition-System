'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const PARQ_QUESTIONS = [
  "Has your doctor ever said that you have a heart condition OR high blood pressure?",
  "Do you feel pain in your chest at rest, during your daily activities of living, OR when you do physical activity?",
  "Do you lose balance because of dizziness OR have you lost consciousness in the last 12 months?",
  "Have you ever been diagnosed with another chronic medical condition (other than heart disease or high blood pressure)?",
  "Are you currently taking prescribed medications for a chronic medical condition?",
  "Do you currently have (or have had within the past 12 months) a bone, joint, or soft tissue problem that could be made worse by becoming more physically active?",
  "Has your doctor ever said that you should only do medically supervised physical activity?"
];

export default function ParQPage() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [showWarning, setShowWarning] = useState(false);
  const { completeParQ } = useAppStore();
  const router = useRouter();

  const handleAnswer = (index: number, value: boolean) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    const hasYes = Object.values(answers).some(v => v === true);
    if (hasYes) {
      setShowWarning(true);
    } else {
      completeParQ(true);
      router.push('/onboarding/profile');
    }
  };

  const allAnswered = Object.keys(answers).length === PARQ_QUESTIONS.length;

  if (showWarning) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-2xl bg-[var(--color-surface)] p-8 shadow-xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-[var(--color-alert)]">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-main)]">Medical Clearance Recommended</h2>
          <p className="mb-8 text-[var(--color-text-muted)]">
            Based on your responses to the PAR-Q+ assessment, we strongly recommend consulting with a qualified healthcare professional before beginning any new exercise program.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowWarning(false)}
              className="flex-1 rounded-lg border border-gray-200 py-3 font-medium text-[var(--color-text-main)] hover:bg-gray-50"
            >
              Review Answers
            </button>
            <button
              onClick={() => {
                completeParQ(true);
                router.push('/onboarding/profile');
              }}
              className="flex-1 rounded-lg bg-[var(--color-alert)] py-3 font-medium text-white hover:bg-opacity-90"
            >
              I Understand, Proceed
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Safety Onboarding</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">PAR-Q+ Readiness Assessment</p>
        </div>

        <div className="space-y-6 rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm md:p-8">
          {PARQ_QUESTIONS.map((q, i) => (
            <div key={i} className="flex flex-col gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-medium text-[var(--color-text-main)] md:w-2/3">{q}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAnswer(i, true)}
                  className={`flex-1 rounded-lg border px-6 py-2 text-sm font-medium transition-colors md:flex-none ${
                    answers[i] === true 
                      ? 'border-[var(--color-alert)] bg-orange-50 text-[var(--color-alert)]' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(i, false)}
                  className={`flex-1 rounded-lg border px-6 py-2 text-sm font-medium transition-colors md:flex-none ${
                    answers[i] === false 
                      ? 'border-[var(--color-success)] bg-green-50 text-[var(--color-success)]' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          ))}

          <div className="pt-6">
            <button
              disabled={!allAnswered}
              onClick={handleSubmit}
              className="w-full rounded-lg bg-[var(--color-primary)] py-4 font-medium text-white transition-colors hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              Complete Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
