'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type GoalType = 'Weight Loss' | 'Muscle Gain' | 'Anti-aging';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  weight: number; // kg
  height: number; // cm
  bodyFat?: number; // %
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active';
  goal: GoalType;
  occupation?: string;
  personalBest?: string;
  hrAlertThreshold: number;
}

export interface DailyLog {
  date: string;
  steps: number;
  caloriesIn: number;
  proteinIn: number;
  workoutCompleted: boolean;
  workoutDuration?: number; // minutes
  hrAlerts: number;
}

interface AppState {
  hasCompletedParQ: boolean;
  profile: UserProfile | null;
  dailyLogs: DailyLog[];
  currentStepGoal: number;
  currentCalorieGoal: number;
  currentProteinGoal: number;
}

interface AppContextType {
  state: AppState;
  resetApp: () => void;
  completeParQ: (passed: boolean) => void;
  saveProfile: (profile: UserProfile) => void;
  logDailyData: (log: Partial<DailyLog>) => void;
}

const initialState: AppState = {
  hasCompletedParQ: false,
  profile: null,
  dailyLogs: [
    { date: '2023-10-01', steps: 8000, caloriesIn: 2100, proteinIn: 120, workoutCompleted: true, hrAlerts: 0 },
    { date: '2023-10-02', steps: 10500, caloriesIn: 2200, proteinIn: 130, workoutCompleted: true, hrAlerts: 0 },
    { date: '2023-10-03', steps: 4000, caloriesIn: 2500, proteinIn: 90, workoutCompleted: false, hrAlerts: 0 },
    { date: '2023-10-04', steps: 9500, caloriesIn: 2000, proteinIn: 140, workoutCompleted: true, hrAlerts: 0 },
    { date: '2023-10-05', steps: 11000, caloriesIn: 2300, proteinIn: 150, workoutCompleted: true, hrAlerts: 0 },
  ],
  currentStepGoal: 10000,
  currentCalorieGoal: 2000,
  currentProteinGoal: 150,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bioadaptive_state');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse state', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('bioadaptive_state', JSON.stringify(state));
  }, [state]);

  const resetApp = () => setState(initialState);
  
  const completeParQ = (passed: boolean) => {
    setState(s => ({ ...s, hasCompletedParQ: passed }));
  };

  const saveProfile = (profile: UserProfile) => {
    // Calculate metabolic goals
    // Ten-Haaf (simplified) or Cunningham
    let rmr = 0;
    if (profile.bodyFat && profile.bodyFat < 15) {
      // Cunningham for high lean mass
      const leanMass = profile.weight * (1 - profile.bodyFat / 100);
      rmr = 500 + 22 * leanMass;
    } else {
      // Mifflin-St Jeor as fallback for general
      if (profile.gender === 'Male') {
        rmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
      } else {
        rmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
      }
    }

    const activityMultipliers = {
      'Sedentary': 1.2,
      'Light': 1.375,
      'Moderate': 1.55,
      'Active': 1.725,
      'Very Active': 1.9
    };
    
    let tdee = rmr * activityMultipliers[profile.activityLevel];
    let calGoal = tdee;
    
    if (profile.goal === 'Weight Loss') calGoal -= 500;
    if (profile.goal === 'Muscle Gain') calGoal += 300;

    // Protein: 1.6 to 2.0 g/kg
    const proteinGoal = profile.weight * 1.8;

    setState(s => ({
      ...s,
      profile,
      currentCalorieGoal: Math.round(calGoal),
      currentProteinGoal: Math.round(proteinGoal),
      currentStepGoal: 8000 // Initial step goal
    }));
  };

  const logDailyData = (log: Partial<DailyLog>) => {
    const today = new Date().toISOString().split('T')[0];
    setState(s => {
      const existingIdx = s.dailyLogs.findIndex(l => l.date === today);
      let newLogs = [...s.dailyLogs];
      
      if (existingIdx >= 0) {
        newLogs[existingIdx] = { ...newLogs[existingIdx], ...log };
      } else {
        newLogs.push({
          date: today,
          steps: 0,
          caloriesIn: 0,
          proteinIn: 0,
          workoutCompleted: false,
          hrAlerts: 0,
          ...log
        });
      }

      // RL CalFit simulation: Adjust step goal based on recent performance
      let newStepGoal = s.currentStepGoal;
      if (log.steps) {
        if (log.steps > s.currentStepGoal * 1.2) {
          newStepGoal = Math.min(s.currentStepGoal + 500, 15000); // Increase slightly
        } else if (log.steps < s.currentStepGoal * 0.5) {
          newStepGoal = Math.max(s.currentStepGoal - 1000, 3000); // Reduce to restore self-efficacy
        }
      }

      return { ...s, dailyLogs: newLogs, currentStepGoal: newStepGoal };
    });
  };

  return (
    <AppContext.Provider value={{ state, resetApp, completeParQ, saveProfile, logDailyData }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
