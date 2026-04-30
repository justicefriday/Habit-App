
"use client";

import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#f8f7ff" }}
    >
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}


