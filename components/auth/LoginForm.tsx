"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const usersRaw = localStorage.getItem("habit-tracker-users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const foundUser = users.find(
      (user: any) =>
        user.email === email && user.password === password
    );

    if (!foundUser) {
      setError("Invalid email or password");
      return;
    }

    const session = {
      userId: foundUser.id,
      email: foundUser.email,
    };

    localStorage.setItem(
      "habit-tracker-session",
      JSON.stringify(session)
    );

    router.push("/dashboard");
  };

  return (
    <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleSubmit}>
      <input
        data-testid="auth-login-email"   // ✅ FIXED
        type="email"
        placeholder="Email"
        className="border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        data-testid="auth-login-password" // ✅ FIXED
        type="password"
        placeholder="Password"
        className="border p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        data-testid="auth-login-submit"
        type="submit"
        className="bg-black text-white p-2"
      >
        Login
      </button>
    </form>
  );
}