"use client";

import { useState } from "react";
import { validateHabitName } from "@/lib/validator";
import { addHabit, updateHabit } from "@/lib/habits";

type Props = {
  existingHabit?: any;
  onCreate?: () => void;
};

export default function HabitForm({ existingHabit, onCreate }: Props) {
  const [name, setName] = useState(existingHabit?.name || "");
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

    console.log("session from localStorage:", session);

    if (!session) {
      console.log("NO SESSION - bailing out");
      return;
    }

    if (existingHabit) {
      updateHabit({
        ...existingHabit,
        name: result.value,
      });
    } else {
      addHabit({
        id: crypto.randomUUID(),
        userId: session.userId,
        name: result.value,
        description: "",
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      });
    }

    window.dispatchEvent(new Event("habit-updated"));
    if (onCreate) onCreate();
    setName("");
  };

  return (
    <div data-testid="habit-form">
      <input
        data-testid="habit-name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button data-testid="habit-save-button" onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
}