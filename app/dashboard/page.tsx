'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Activity, Flame, Footprints, HeartPulse, ShieldAlert, Utensils, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI, Type } from '@google/genai';

export default function DashboardPage() {
  const { state, logDailyData } = useAppStore();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = state.dailyLogs.find(l => l.date === todayStr) || {
    date: todayStr,
    steps: 0,
    caloriesIn: 0,
    proteinIn: 0,
    workoutCompleted: false,
    hrAlerts: 0
  };
  const [hrSim, setHrSim] = useState(70);
  const [workoutDuration, setWorkoutDuration] = useState<number | ''>('');
  const [aiSuggestions, setAiSuggestions] = useState<{food: string, exercise: string} | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const generateAiSuggestions = async () => {
    if (!state.profile || isGeneratingAi) return;
    setIsGeneratingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const prompt = `
        You are an elite bio-adaptive AI coach. Based on the user's profile and today's progress, provide one short, highly personalized food suggestion and one short exercise suggestion.
        
        User Profile:
        - Goal: ${state.profile.goal}
        - Age: ${state.profile.age}
        - Weight: ${state.profile.weight}kg
        - Activity Level: ${state.profile.activityLevel}
        - Occupation: ${state.profile.occupation || 'Not specified'}
        - Personal Best: ${state.profile.personalBest || 'Not specified'}

        Today's Progress:
        - Steps: ${todayLog?.steps || 0} / ${state.currentStepGoal}
        - Calories: ${todayLog?.caloriesIn || 0} / ${state.currentCalorieGoal}
        - Protein: ${todayLog?.proteinIn || 0} / ${state.currentProteinGoal}
        - HR Alerts: ${todayLog?.hrAlerts || 0}

        Keep each suggestion to 1-2 sentences. Be encouraging and scientific.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodSuggestion: { type: Type.STRING, description: "Personalized food suggestion" },
              exerciseSuggestion: { type: Type.STRING, description: "Personalized exercise suggestion" }
            },
            required: ["foodSuggestion", "exerciseSuggestion"]
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        setAiSuggestions({ food: data.foodSuggestion, exercise: data.exerciseSuggestion });
      }
    } catch (error) {
      console.error("Failed to generate AI suggestions:", error);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Simulate HR monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setHrSim(prev => {
        const newHr = prev + (Math.random() * 10 - 5);
        const threshold = state.profile?.hrAlertThreshold || 160;
        if (newHr > threshold) {
          logDailyData({ hrAlerts: (todayLog?.hrAlerts || 0) + 1 });
        }
        return Math.max(60, Math.min(180, newHr));
      });
    }, 3000);
  }, [todayLog?.hrAlerts, logDailyData, state.profile?.hrAlertThreshold]);

  useEffect(() => {
    if (state.profile && !aiSuggestions && !isGeneratingAi) {
      generateAiSuggestions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.profile]);

  if (!state.profile) return null;

  const isHrHigh = hrSim > (state.profile.hrAlertThreshold - 10);
  const stepsProgress = Math.min(100, ((todayLog?.steps || 0) / state.currentStepGoal) * 100);
  const caloriesProgress = Math.min(100, ((todayLog?.caloriesIn || 0) / state.currentCalorieGoal) * 100);
  const proteinProgress = Math.min(100, ((todayLog?.proteinIn || 0) / state.currentProteinGoal) * 100);

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">BioDashboard</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Real-time adaptive intervention</p>
          </div>
          <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${isHrHigh ? 'bg-[var(--color-alert)] text-white animate-pulse' : 'bg-white text-[var(--color-text-main)] shadow-sm'}`}>
            <HeartPulse className="h-5 w-5" />
            {Math.round(hrSim)} BPM
          </div>
        </header>

        {isHrHigh && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl bg-orange-100 p-4 text-[var(--color-alert)]"
          >
            <ShieldAlert className="h-6 w-6 flex-shrink-0" />
            <p className="text-sm font-medium">Critical Alert: Heart rate above target zone. Please breathe deeply and reduce intensity.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Steps Card */}
          <div className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-primary)]">
                <Footprints className="h-5 w-5" />
                <h2 className="font-semibold">Daily Steps</h2>
              </div>
              <span className="text-xs font-medium text-[var(--color-text-muted)]">RL CalFit</span>
            </div>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-3xl font-bold text-[var(--color-text-main)]">{todayLog?.steps || 0}</span>
              <span className="text-sm text-[var(--color-text-muted)]">/ {state.currentStepGoal}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div 
                className="h-full bg-[var(--color-success)] transition-all duration-500" 
                style={{ width: `${stepsProgress}%` }}
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => logDailyData({ steps: (todayLog?.steps || 0) + 1000 })}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-[var(--color-text-main)] hover:bg-gray-50"
              >
                +1k Steps
              </button>
            </div>
          </div>

          {/* Nutrition Card */}
          <div className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-primary)]">
                <Utensils className="h-5 w-5" />
                <h2 className="font-semibold">Nutrition (SPC)</h2>
              </div>
              <span className="text-xs font-medium text-[var(--color-text-muted)]">High Protein</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Calories</span>
                  <span className="font-medium">{todayLog?.caloriesIn || 0} / {state.currentCalorieGoal}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div 
                    className={`h-full transition-all duration-500 ${caloriesProgress > 100 ? 'bg-[var(--color-alert)]' : 'bg-[var(--color-primary)]'}`} 
                    style={{ width: `${Math.min(100, caloriesProgress)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Protein (g)</span>
                  <span className="font-medium">{todayLog?.proteinIn || 0} / {state.currentProteinGoal}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div 
                    className="h-full bg-[var(--color-success)] transition-all duration-500" 
                    style={{ width: `${proteinProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => logDailyData({ caloriesIn: (todayLog?.caloriesIn || 0) + 300, proteinIn: (todayLog?.proteinIn || 0) + 25 })}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-[var(--color-text-main)] hover:bg-gray-50"
              >
                + Meal (SPC)
              </button>
            </div>
            
            <div className="mt-4 rounded-xl bg-green-50 p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-green-800 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> AI Nutrition Plan
                </p>
                <button onClick={generateAiSuggestions} disabled={isGeneratingAi} className="text-[10px] text-green-600 hover:underline disabled:opacity-50">
                  Refresh
                </button>
              </div>
              <p className="text-xs text-green-700">
                {isGeneratingAi ? 'Analyzing biometrics...' : (aiSuggestions?.food || 'Loading...')}
              </p>
            </div>
          </div>

          {/* Workout Card */}
          <div className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-primary)]">
                <Flame className="h-5 w-5" />
                <h2 className="font-semibold">Periodization</h2>
              </div>
              <span className="text-xs font-medium text-[var(--color-text-muted)]">Drools Engine</span>
            </div>
            
            <div className="mb-4 rounded-xl bg-blue-50 p-4">
              <p className="text-sm font-medium text-[var(--color-primary)]">
                Today your workout focuses on maximum strength to improve your bone density long-term.
              </p>
              <p className="mt-2 text-xs text-blue-700">
                {state.profile.activityLevel === 'Sedentary' || state.profile.activityLevel === 'Light' 
                  ? 'Full Body - Neuromuscular Adaptation' 
                  : 'Split Routine - Eccentric Overload'}
              </p>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-blue-800 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> AI Exercise Plan
                  </p>
                  <button onClick={generateAiSuggestions} disabled={isGeneratingAi} className="text-[10px] text-blue-600 hover:underline disabled:opacity-50">
                    Refresh
                  </button>
                </div>
                <p className="text-xs text-blue-700">
                  {isGeneratingAi ? 'Analyzing biometrics...' : (aiSuggestions?.exercise || 'Loading...')}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {!todayLog?.workoutCompleted && (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Duration (min)" 
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>
              )}
              <button 
                onClick={() => {
                  if (!todayLog?.workoutCompleted) {
                    logDailyData({ 
                      workoutCompleted: true, 
                      workoutDuration: workoutDuration === '' ? 30 : workoutDuration 
                    });
                    setWorkoutDuration('');
                  } else {
                    logDailyData({ workoutCompleted: false, workoutDuration: undefined });
                  }
                }}
                className={`w-full rounded-lg py-3 font-medium transition-colors ${
                  todayLog?.workoutCompleted 
                    ? 'bg-[var(--color-success)] text-white' 
                    : 'bg-[var(--color-primary)] text-white hover:bg-opacity-90'
                }`}
              >
                {todayLog?.workoutCompleted ? 'Workout Completed' : 'Log Workout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
