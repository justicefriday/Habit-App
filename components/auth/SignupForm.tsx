"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

    const existingUser = users.find(
      (user: any) => user.email === email
    );

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

    const updatedUsers = [...users, newUser];

    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify(updatedUsers)
    );

    const session = {
      userId: newUser.id,
      email: newUser.email,
    };

    localStorage.setItem(
      "habit-tracker-session",
      JSON.stringify(session)
    );

    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm"
    >
      <input
        data-testid="auth-signup-email"
        type="email"
        placeholder="Email"
        className="border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        data-testid="auth-signup-password"
        type="password"
        placeholder="Password"
        className="border p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        data-testid="auth-signup-submit"
        type="submit"
        className="bg-black text-white p-2"
      >
        Sign Up
      </button>
    </form>
  );
}