// hooks/useCookiebot.ts
import { useEffect } from "react";

declare global {
  interface Window {
    Cookiebot?: {
      consents: Record<string, unknown>;
      onconsent: () => void;
      renew: () => void;
    };
  }
}

export const useCookiebot = (onConsentReady: () => void) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const existingScript = document.getElementById("Cookiebot");
    if (existingScript) return;

    const script = document.createElement("script");
    script.id = "Cookiebot";
    script.src = "https://consent.cookiebot.com/uc.js";
    script.setAttribute("data-cbid", "cff002cf-1823-4975-af51-2b6d7a538f3e");
    script.setAttribute("data-blockingmode", "auto");
    script.async = true;
    script.type = "text/javascript";

    document.head.appendChild(script);

    // Wait for Cookiebot to be ready and listen for consent callback
    const interval = setInterval(() => {
      if (window.Cookiebot && typeof window.Cookiebot.consents === "object") {
        clearInterval(interval);
        if (typeof window.Cookiebot.onconsent === "function") {
          window.Cookiebot.onconsent = () => {
            onConsentReady?.();
          };
        } else {
          onConsentReady?.();
        }
      }
    }, 100);
  }, [onConsentReady]);
};
