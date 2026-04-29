"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import SplashScreen from "@/components/shared/SplashScreen";

export default function HomePage() {
  const router = useRouter();

  useLayoutEffect(() => {
    const session = localStorage.getItem("habit-tracker-session");

    setTimeout(() => {
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 1000); // raised from 300ms to 1000ms — within the required 800–2000ms window
  }, [router]);

  return <SplashScreen />;
}