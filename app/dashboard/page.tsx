"use client";

import HabitForm from "@/components/habits/HabitForm";
import HabitCard from "@/components/habits/HabitCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [habits, setHabits] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadHabits = () => {
    const sessionRaw = localStorage.getItem("habit-tracker-session");
    if (!sessionRaw) return;

    const sessionData = JSON.parse(sessionRaw);

    const all = JSON.parse(
      localStorage.getItem("habit-tracker-habits") || "[]"
    );

    const userHabits = all.filter(
      (h: any) => h.userId === sessionData.userId
    );

    setHabits(userHabits);
  };

  useEffect(() => {
    const sessionRaw = localStorage.getItem("habit-tracker-session");

    if (!sessionRaw) {
      router.replace("/login");
      return;
    }

    const parsed = JSON.parse(sessionRaw);

    setSession(parsed);
    loadHabits();
    setLoading(false);

    const sync = () => loadHabits();
    window.addEventListener("habit-updated", sync);

    return () => window.removeEventListener("habit-updated", sync);
  }, []);

  if (loading) return <div data-testid="dashboard-loading">Loading...</div>;

  return (
    <div data-testid="dashboard-page">
      <h1>Welcome, {session?.email}</h1>

      <button
        data-testid="auth-logout-button"
        onClick={() => {
          localStorage.removeItem("habit-tracker-session");
          router.replace("/login");
        }}
      >
        Logout
      </button>

      <button
        data-testid="create-habit-button"
        onClick={() => setShowForm(true)}
      >
        Create Habit
      </button>

      {showForm && (
        <div data-testid="habit-form-wrapper">
          <HabitForm
            onCreate={() => {
              loadHabits();
              setShowForm(false); // IMPORTANT FIX
            }}
          />
        </div>
      )}

      {habits.length === 0 && (
        <div data-testid="empty-state">No habits yet. Create one!</div>
      )}

      {habits.map((h) => (
        <HabitCard key={h.id} habit={h} onUpdate={loadHabits} />
      ))}
    </div>
  );
}