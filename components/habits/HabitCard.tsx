"use client";

import { useMemo, useState } from "react";
import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { toggleHabitCompletion } from "@/lib/habits";
import { calculateCurrentStreak } from "@/lib/streaks";

type Props = {
  habit: Habit;
  onUpdate: () => void;
};

export default function HabitCard({ habit, onUpdate }: Props) {
  const slug = useMemo(() => getHabitSlug(habit.name), [habit.name]);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const isCompletedToday = habit.completions?.includes(today);

  const streak = useMemo(
    () => calculateCurrentStreak(habit.completions || []),
    [habit.completions]
  );

  // ✅ TOGGLE COMPLETE (FIXED FOR E2E)
  const handleToggle = () => {
    const habits = JSON.parse(
      localStorage.getItem("habit-tracker-habits") || "[]"
    );

    const updated = habits.map((h: Habit) => {
      if (h.id === habit.id) {
        const newHabit = toggleHabitCompletion(h, today);
        return { ...newHabit };
      }
      return h;
    });

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify(updated)
    );

    // IMPORTANT: force UI refresh immediately
    onUpdate();
  };

  // ✅ SAVE EDIT (FIXED)
  const handleSave = () => {
    const habits = JSON.parse(
      localStorage.getItem("habit-tracker-habits") || "[]"
    );

    const updated = habits.map((h: Habit) =>
      h.id === habit.id
        ? {
            ...h,
            name: name.trim(),
            description: description.trim(),
          }
        : h
    );

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify(updated)
    );

    setEditing(false);

    onUpdate();
  };

  // ✅ DELETE (UNCHANGED BUT SAFE)
  const handleDelete = () => {
    const habits = JSON.parse(
      localStorage.getItem("habit-tracker-habits") || "[]"
    );

    const updated = habits.filter((h: Habit) => h.id !== habit.id);

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify(updated)
    );

    onUpdate();
  };

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="border p-3 rounded flex flex-col gap-2"
    >
      {editing ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-1"
            data-testid={`edit-name-${slug}`}
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-1"
            data-testid={`edit-desc-${slug}`}
          />

          <button
            onClick={handleSave}
            className="bg-black text-white p-1"
            data-testid={`save-${slug}`}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <h2 className="font-bold">{habit.name}</h2>
          <p className="text-sm text-gray-500">
            {habit.description}
          </p>
        </>
      )}

      {/* STREAK (FIXED REACTIVITY) */}
      <div data-testid={`habit-streak-${slug}`}>
        Streak: {streak}
      </div>

      {/* COMPLETE BUTTON */}
      <button
        data-testid={`habit-complete-${slug}`}
        onClick={handleToggle}
        className={`px-3 py-1 rounded text-white ${
          isCompletedToday ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        {isCompletedToday ? "Completed Today" : "Mark Complete"}
      </button>

      {/* EDIT */}
      <button
        data-testid={`habit-edit-${slug}`}
        onClick={() => setEditing(true)}
        className="bg-yellow-500 text-white px-2 py-1"
      >
        Edit
      </button>

      {/* DELETE */}
      {!confirmDelete ? (
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => setConfirmDelete(true)}
          className="bg-red-500 text-white px-2 py-1"
        >
          Delete
        </button>
      ) : (
        <button
          data-testid="confirm-delete-button"
          onClick={handleDelete}
          className="bg-red-700 text-white px-2 py-1"
        >
          Confirm Delete
        </button>
      )}
    </div>
  );
}