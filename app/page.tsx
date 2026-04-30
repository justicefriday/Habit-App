
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
    }, 1000);
  }, [router]);

  return <SplashScreen />;
}