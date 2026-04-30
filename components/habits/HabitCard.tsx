"use client";

import { useMemo, useState } from "react";
import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { deleteHabit } from "@/lib/habits";
import HabitForm from "./HabitForm";

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

  const [showConfirm, setShowConfirm] = useState(false);
  const [editing, setEditing] = useState(false);

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

  const handleDelete = () => {
    deleteHabit(habit.id);
    window.dispatchEvent(new Event("habit-updated"));
    onUpdate();
  };

  if (editing) {
    return (
      <HabitForm
        existingHabit={habit}
        onCreate={() => { onUpdate(); setEditing(false); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="rounded-2xl p-5 border transition-all"
      style={{
        background: isCompletedToday
          ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
          : "white",
        borderColor: isCompletedToday ? "#86efac" : "#f3f4f6",
        boxShadow: isCompletedToday
          ? "0 4px 20px rgba(134, 239, 172, 0.2)"
          : "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-gray-900 truncate"
            style={{ fontSize: "1rem" }}
          >
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-gray-500 text-sm mt-0.5 truncate">
              {habit.description}
            </p>
          )}
        </div>

        {/* Streak badge */}
        <div
          data-testid={`habit-streak-${slug}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold shrink-0"
          style={{
            background: streak > 0 ? "linear-gradient(135deg, #f093fb22, #f5576c22)" : "#f9fafb",
            color: streak > 0 ? "#f5576c" : "#9ca3af",
          }}
        >
          <span>🔥</span>
          <span>{streak}</span>
        </div>
      </div>

      {/* Complete button */}
      <button
        data-testid={`habit-complete-${slug}`}
        onClick={toggle}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 focus:outline-none mb-3"
        style={
          isCompletedToday
            ? {
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "white",
                boxShadow: "0 4px 16px rgba(34, 197, 94, 0.3)",
              }
            : {
                background: "linear-gradient(135deg, #f093fb, #f5576c)",
                color: "white",
                boxShadow: "0 4px 16px rgba(245, 87, 108, 0.3)",
              }
        }
      >
        {isCompletedToday ? "✓ Completed Today" : "Mark Complete"}
      </button>

      {/* Edit / Delete row */}
      <div className="flex gap-2">
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => setEditing(true)}
          className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium transition-all hover:bg-gray-50 focus:outline-none"
        >
          Edit
        </button>
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => setShowConfirm(true)}
          className="flex-1 py-2 rounded-xl border border-red-100 text-red-500 text-sm font-medium transition-all hover:bg-red-50 focus:outline-none"
        >
          Delete
        </button>
      </div>

      {/* Delete confirmation */}
      {showConfirm && (
        <div className="mt-3 p-4 rounded-xl bg-red-50 border border-red-100">
          <p className="text-red-700 text-sm font-medium mb-3">
            Delete this habit? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium focus:outline-none"
            >
              Cancel
            </button>
            <button
              data-testid="confirm-delete-button"
              onClick={handleDelete}
              className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold focus:outline-none"
            >
              Yes, delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}