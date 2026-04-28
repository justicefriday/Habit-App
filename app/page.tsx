"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("habit-tracker-session");

    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return <SplashScreen />;
}