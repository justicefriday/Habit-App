import { Habit } from "@/types/habit";

export function toggleHabitCompletion(
  habit: Habit,
  date: string
): Habit {
  const exists = habit.completions.includes(date);

  let updated = exists
    ? habit.completions.filter(d => d !== date)
    : [...habit.completions, date];

  updated = Array.from(new Set(updated));

  return {
    ...habit,
    completions: updated,
  };
}