"use client";

import { useState } from "react";
import { validateHabitName } from "@/lib/validator";
import { Habit } from "@/types/habit";

type Props = {
  existingHabit?: Habit;
  onCreate?: () => void;
  onUpdate?: () => void;
};

export default function HabitForm({ existingHabit, onCreate, onUpdate }: Props) {
  const [name, setName] = useState(existingHabit?.name || "");
  const [description, setDescription] = useState(
    existingHabit?.description || ""
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Habit name is required");
      return;
    }

    const validation = validateHabitName(name);

    if (!validation.valid) {
      setError(validation.error || "Habit name is required");
      return;
    }

    setError("");

    const session = JSON.parse(
      localStorage.getItem("habit-tracker-session") || "null"
    );

    const userId = session?.userId;

    const stored: Habit[] = JSON.parse(
      localStorage.getItem("habit-tracker-habits") || "[]"
    );

    if (existingHabit) {
      const updated = stored.map((h) =>
        h.id === existingHabit.id
          ? {
              ...h,
              name: validation.value,
              description,
            }
          : h
      );

      localStorage.setItem("habit-tracker-habits", JSON.stringify(updated));

      onUpdate?.();
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId,
        name: validation.value,
        description,
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      };

      const updated = [...stored, newHabit];

      localStorage.setItem("habit-tracker-habits", JSON.stringify(updated));

      onCreate?.();
    }

    // reset form (important for UI tests)
    setName("");
    setDescription("");
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
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />

      <input
        data-testid="habit-description-input"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2"
      />

      <select
        data-testid="habit-frequency-select"
        className="border p-2"
        defaultValue="daily"
      >
        <option value="daily">Daily</option>
      </select>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

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