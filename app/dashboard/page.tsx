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
    const all = JSON.parse(localStorage.getItem("habit-tracker-habits") || "[]");
    setHabits(all.filter((h: any) => h.userId === sessionData.userId));
  };

  useEffect(() => {
    const sessionRaw = localStorage.getItem("habit-tracker-session");
    if (!sessionRaw) {
      router.replace("/login");
      return;
    }
    setSession(JSON.parse(sessionRaw));
    loadHabits();
    setLoading(false);

    const sync = () => loadHabits();
    window.addEventListener("habit-updated", sync);
    return () => window.removeEventListener("habit-updated", sync);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "#f5576c", borderTopColor: "transparent" }} />
    </div>
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const completedToday = habits.filter((h) =>
    h.completions?.includes(new Date().toISOString().split("T")[0])
  ).length;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#f8f7ff" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-4 py-4"
        style={{
          background: "rgba(248, 247, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">Habit Tracker</span>
          </div>
          <button
            data-testid="auth-logout-button"
            onClick={() => {
              localStorage.removeItem("habit-tracker-session");
              router.replace("/login");
            }}
            className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors focus:outline-none px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-lg mx-auto px-4 py-6" data-testid="dashboard-page">
        {/* Greeting */}
        <div className="mb-6">
          <p className="text-gray-500 text-sm">{today}</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">
            {session?.email?.split("@")[0]}'s habits
          </h1>

          {/* Progress summary */}
          {habits.length > 0 && (
            <div
              className="mt-3 px-4 py-3 rounded-xl flex items-center justify-between"
              style={{
                background: "linear-gradient(135deg, #f093fb18, #f5576c18)",
                border: "1px solid rgba(245,87,108,0.15)",
              }}
            >
              <span className="text-sm text-gray-600">
                {completedToday} of {habits.length} completed today
              </span>
              <div className="flex-1 mx-4 h-1.5 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: habits.length > 0 ? `${(completedToday / habits.length) * 100}%` : "0%",
                    background: "linear-gradient(90deg, #f093fb, #f5576c)",
                  }}
                />
              </div>
              <span className="text-sm font-semibold" style={{ color: "#f5576c" }}>
                {habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%
              </span>
            </div>
          )}
        </div>

        {/* Create habit button */}
        {!showForm && (
          <button
            data-testid="create-habit-button"
            onClick={() => setShowForm(true)}
            className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all active:scale-95 focus:outline-none mb-6 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #f093fb, #f5576c)",
              boxShadow: "0 4px 20px rgba(245, 87, 108, 0.35)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            New habit
          </button>
        )}

        {/* Habit form */}
        {showForm && (
          <div className="mb-6">
            <HabitForm
              onCreate={() => {
                loadHabits();
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Empty state */}
        {habits.length === 0 && !showForm && (
          <div
            data-testid="empty-state"
            className="text-center py-16 px-6"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #f093fb22, #f5576c22)" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  stroke="#f5576c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No habits yet</h3>
            <p className="text-gray-500 text-sm">
              Create your first habit to start building a better routine.
            </p>
          </div>
        )}

        {/* Habits list */}
        <div className="flex flex-col gap-3">
          {habits.map((h) => (
            <HabitCard key={h.id} habit={h} onUpdate={loadHabits} />
          ))}
        </div>
      </main>
    </div>
  );
}
















