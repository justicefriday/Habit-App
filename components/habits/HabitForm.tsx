"use client";

import { useState } from "react";
import { validateHabitName } from "@/lib/validator";
import { addHabit, updateHabit } from "@/lib/habits";

type Props = {
  existingHabit?: any;
  onCreate?: () => void;
  onCancel?: () => void;
};

export default function HabitForm({ existingHabit, onCreate, onCancel }: Props) {
  const [name, setName] = useState(existingHabit?.name || "");
  const [description, setDescription] = useState(existingHabit?.description || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const result = validateHabitName(name);

    if (!result.valid) {
      setError(result.error || "");
      return;
    }

    setError("");

    const sessionRaw = localStorage.getItem("habit-tracker-session");
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;

    if (!session) return;

    if (existingHabit) {
      updateHabit({
        ...existingHabit,
        name: result.value,
        description,
      });
    } else {
      addHabit({
        id: crypto.randomUUID(),
        userId: session.userId,
        name: result.value,
        description,
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      });
    }

    window.dispatchEvent(new Event("habit-updated"));
    if (onCreate) onCreate();
    setName("");
    setDescription("");
  };

  return (
    <div
      data-testid="habit-form"
      className="rounded-2xl p-5 border border-gray-100 bg-white shadow-sm"
    >
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        {existingHabit ? "Edit habit" : "New habit"}
      </h3>

      <div className="flex flex-col gap-3">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="habit-name" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Habit name *
          </label>
          <input
            id="habit-name"
            data-testid="habit-name-input"
            type="text"
            placeholder="e.g. Drink 8 glasses of water"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all text-sm"
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(240,147,251,0.2)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="habit-description" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Description (optional)
          </label>
          <input
            id="habit-description"
            data-testid="habit-description-input"
            type="text"
            placeholder="Why does this habit matter to you?"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all text-sm"
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(240,147,251,0.2)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Frequency */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="habit-frequency" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:bg-white transition-all text-sm appearance-none"
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(240,147,251,0.2)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            defaultValue="daily"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm transition-all hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
          )}
          <button
            data-testid="habit-save-button"
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95 focus:outline-none"
            style={{
              background: "linear-gradient(135deg, #f093fb, #f5576c)",
              boxShadow: "0 4px 16px rgba(245, 87, 108, 0.3)",
            }}
          >
            {existingHabit ? "Save changes" : "Add habit"}
          </button>
        </div>
      </div>
    </div>
  );
}