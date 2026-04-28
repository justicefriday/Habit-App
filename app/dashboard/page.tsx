"use client";

import HabitForm from "@/components/habits/HabitForm";
import HabitCard from "@/components/habits/HabitCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{
    userId: string;
    email: string;
  } | null>(null);

  const [habits, setHabits] = useState<any[]>([]);

  // Load habits for logged-in user
  const loadHabits = () => {
    const sessionRaw = localStorage.getItem("habit-tracker-session");
    if (!sessionRaw) return;

    const sessionData = JSON.parse(sessionRaw);

    const habitsRaw = localStorage.getItem("habit-tracker-habits");
    const allHabits = habitsRaw ? JSON.parse(habitsRaw) : [];

    const userHabits = allHabits.filter(
      (h: any) => h.userId === sessionData.userId
    );

    setHabits(userHabits);
  };

  useEffect(() => {
    const sessionRaw = localStorage.getItem("habit-tracker-session");

    if (!sessionRaw) {
      router.push("/login");
      return;
    }

    const parsedSession = JSON.parse(sessionRaw);

    setSession(parsedSession);
    loadHabits();
    setLoading(false);
  }, [router]);

  const handleHabitCreated = () => {
    loadHabits();      // refresh list
    setShowForm(false); // close form
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen flex flex-col items-center p-4"
    >
      <div className="w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">
          Welcome, {session?.email}
        </h1>



<button
  data-testid="auth-logout-button"
  onClick={() => {
    localStorage.removeItem("habit-tracker-session");
    router.push("/login");
  }}
  className="w-full bg-black text-white px-4 py-2 mb-4 rounded"
>
  Logout
</button>

        {/* CREATE BUTTON */}
        <button
          data-testid="create-habit-button"
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        >
          Create Habit
        </button>

        {/* FORM */}
        {showForm && (
          <HabitForm onCreate={handleHabitCreated} />
        )}

        {/* EMPTY STATE */}
        {habits.length === 0 && (
          <div
            data-testid="empty-state"
            className="text-center text-gray-500 mt-4"
          >
            No habits yet. Create one!
          </div>
        )}

        {/* HABITS LIST */}
       <div className="flex flex-col gap-3 mt-4">
  {habits.map((habit) => (
    <HabitCard
      key={habit.id}
      habit={habit}
      onUpdate={loadHabits}
    />
  ))}
</div>
      </div>
    </div>
  );
}