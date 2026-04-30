"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    const usersRaw = localStorage.getItem("habit-tracker-users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      setError("User already exists");
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("habit-tracker-users", JSON.stringify([...users, newUser]));
    localStorage.setItem(
      "habit-tracker-session",
      JSON.stringify({ userId: newUser.id, email: newUser.email })
    );

    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="text-gray-500 text-sm mt-1">Start building better habits today</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="signup-email"
            data-testid="auth-signup-email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-all text-sm"
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(240,147,251,0.2)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="signup-password"
            data-testid="auth-signup-password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-all text-sm"
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(240,147,251,0.2)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          data-testid="auth-signup-submit"
          type="submit"
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95 focus:outline-none mt-1"
          style={{
            background: "linear-gradient(135deg, #f093fb, #f5576c)",
            boxShadow: "0 4px 20px rgba(245, 87, 108, 0.35)",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.boxShadow =
              "0 6px 24px rgba(245, 87, 108, 0.5)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.boxShadow =
              "0 4px 20px rgba(245, 87, 108, 0.35)")
          }
        >
          Create account
        </button>

        <p className="text-center text-sm text-gray-500 mt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "#f5576c" }}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}