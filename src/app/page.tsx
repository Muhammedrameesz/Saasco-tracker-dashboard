"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/loading/Spinner";
import { useCookiebot } from "@/hooks/useCookieBot";

export default function Home() {
  const router = useRouter();
  const [cookiebotReady, setCookiebotReady] = useState(false);

  useCookiebot(() => {
    setCookiebotReady(true);
  });

  useEffect(() => {
    if (cookiebotReady) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [cookiebotReady]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Spinner />
    </main>
  );
}
