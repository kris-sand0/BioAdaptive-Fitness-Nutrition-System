'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, UserProfile, GoalType } from '@/lib/store';
import { Activity, Target, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const { saveProfile } = useAppStore();
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: undefined,
    gender: 'Male',
    weight: undefined,
    height: undefined,
    bodyFat: undefined,
    activityLevel: 'Moderate',
    goal: 'Weight Loss',
    occupation: '',
    personalBest: '',
    hrAlertThreshold: 160
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['age', 'weight', 'height', 'bodyFat', 'hrAlertThreshold'].includes(name) ? (value === '' ? undefined : Number(value)) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age && formData.weight && formData.height) {
      saveProfile(formData as UserProfile);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Biometric Profile</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">Establish your baseline for adaptive interventions.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Age</label>
                <input
                  type="number"
                  name="age"
                  required
                  min="18"
                  max="120"
                  value={formData.age === undefined ? '' : formData.age}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  required
                  min="30"
                  max="300"
                  step="0.1"
                  value={formData.weight === undefined ? '' : formData.weight}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  required
                  min="100"
                  max="250"
                  value={formData.height === undefined ? '' : formData.height}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Body Fat % (Optional)</label>
                <input
                  type="number"
                  name="bodyFat"
                  min="3"
                  max="60"
                  value={formData.bodyFat === undefined ? '' : formData.bodyFat}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <p className="text-xs text-[var(--color-text-muted)]">Used for Cunningham RMR calculation if &lt; 15%</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Personal Best</label>
                <input
                  type="text"
                  name="personalBest"
                  value={formData.personalBest}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  placeholder="e.g. 5k in 25 mins"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">HR Alert Threshold (BPM)</label>
                <input
                  type="number"
                  name="hrAlertThreshold"
                  required
                  min="100"
                  max="220"
                  value={formData.hrAlertThreshold === undefined ? '' : formData.hrAlertThreshold}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <p className="text-xs text-[var(--color-text-muted)]">You will receive an alert if your simulated heart rate exceeds this value.</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">Activity Level</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                >
                  <option value="Sedentary">Sedentary (Little to no exercise)</option>
                  <option value="Light">Light (Exercise 1-3 days/week)</option>
                  <option value="Moderate">Moderate (Exercise 3-5 days/week)</option>
                  <option value="Active">Active (Exercise 6-7 days/week)</option>
                  <option value="Very Active">Very Active (Hard exercise/sports & physical job)</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[var(--color-text-main)]">S.M.A.R.T Goal</label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {(['Weight Loss', 'Muscle Gain', 'Anti-aging'] as GoalType[]).map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, goal }))}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-colors ${
                        formData.goal === goal
                          ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Target className="h-6 w-6" />
                      <span className="font-medium">{goal}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--color-primary)] py-4 font-medium text-white transition-colors hover:bg-opacity-90 flex items-center justify-center gap-2"
              >
                <Activity className="h-5 w-5" />
                Initialize Adaptive Engine
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
