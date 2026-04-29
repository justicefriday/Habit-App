"use client";

import { useMemo } from "react";
import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";

type Props = {
  habit: Habit;
  onUpdate: () => void;
};

export default function HabitCard({ habit, onUpdate }: Props) {
  const slug = useMemo(() => getHabitSlug(habit.name), [habit.name]);

  const today = new Date().toISOString().split("T")[0];

  const isCompletedToday = habit.completions?.includes(today);

  const streak = useMemo(
    () => calculateCurrentStreak(habit.completions || []),
    [habit.completions]
  );

  const toggle = () => {
    const all = JSON.parse(localStorage.getItem("habit-tracker-habits") || "[]");

    const updated = all.map((h: Habit) => {
      if (h.id !== habit.id) return h;

      const exists = (h.completions || []).includes(today);

      return {
        ...h,
        completions: exists
          ? h.completions.filter((d: string) => d !== today)
          : [...(h.completions || []), today],
      };
    });

    localStorage.setItem("habit-tracker-habits", JSON.stringify(updated));

    window.dispatchEvent(new Event("habit-updated"));
    onUpdate();
  };

  return (
    <div className="border p-3 flex flex-col gap-2">
      <h2 className="font-bold">{habit.name}</h2>

      <div data-testid={`habit-streak-${slug}`}>
        Streak: {streak}
      </div>

      <button
        data-testid={`habit-complete-${slug}`}
        onClick={toggle}
        className={`p-2 text-white ${
          isCompletedToday ? "bg-green-500" : "bg-gray-500"
        }`}
      >
        {isCompletedToday ? "Completed Today" : "Mark Complete"}
      </button>
    </div>
  );
}