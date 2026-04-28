"use client";

import { useState } from "react";

export default function HabitForm({ onCreate }: { onCreate: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    const sessionRaw = localStorage.getItem("habit-tracker-session");
    if (!sessionRaw) return;

    const session = JSON.parse(sessionRaw);

    const habitsRaw = localStorage.getItem("habit-tracker-habits");
    const habits = habitsRaw ? JSON.parse(habitsRaw) : [];

    const newHabit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: name.trim(),
      description,
      frequency: "daily",
      createdAt: new Date().toISOString(),
      completions: [],
    };

    const updatedHabits = [...habits, newHabit];

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify(updatedHabits)
    );

    setName("");
    setDescription("");

    onCreate(); // notify dashboard
  };

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 mb-4"
    >
      <input
        data-testid="habit-name-input"
        placeholder="Habit name"
        className="border p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        data-testid="habit-description-input"
        placeholder="Description (optional)"
        className="border p-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        data-testid="habit-frequency-select"
        className="border p-2"
      >
        <option value="daily">Daily</option>
      </select>

      <button
        data-testid="habit-save-button"
        type="submit"
        className="bg-black text-white p-2"
      >
        Save Habit
      </button>
    </form>
  );
}