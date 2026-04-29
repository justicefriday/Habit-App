import { Habit } from "@/types/habit";

const STORAGE_KEY = "habit-tracker-habits";

export const getHabits = (): Habit[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

export const addHabit = (habit: Habit) => {
  const habits = getHabits();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...habits, habit]));
};

export const updateHabit = (updatedHabit: Habit) => {
  const habits = getHabits();
  const updated = habits.map((h) => h.id === updatedHabit.id ? updatedHabit : h);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteHabit = (id: string) => {
  const habits = getHabits();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits.filter((h) => h.id !== id)));
};

// Required by spec — pure function, does NOT write to localStorage
export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = habit.completions || [];
  const exists = completions.includes(date);
  return {
    ...habit,
    completions: exists
      ? completions.filter((d) => d !== date)
      : [...new Set([...completions, date])],
  };
}