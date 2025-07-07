"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/loading/Spinner";
import { useCookiebot } from "@/hooks/useCookieBot";

export default function Home() {
  const router = useRouter();
  const [consentGiven, setConsentGiven] = useState(false);

  useCookiebot(() => {
    if (window.Cookiebot?.consents?.marketing) {
      console.log("✅ Cookie consent granted");
      setConsentGiven(true);
    } else {
      console.log("❌ Cookie consent not granted");
    }
  });

  useEffect(() => {
    if (consentGiven) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [consentGiven]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Spinner />
    </main>
  );
}
