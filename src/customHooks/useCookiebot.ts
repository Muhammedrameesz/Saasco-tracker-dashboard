// hooks/useCookiebot.ts
import { useEffect } from "react";

export const useCookiebot = (onConsentReady: () => void) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleConsent = () => {
      if (window.Cookiebot?.consents?.marketing) {
        onConsentReady?.();
      }
    };

    const script = document.createElement("script");
    script.id = "Cookiebot";
    script.src =
      "https://consent.cookiebot.com/uc.js?cbid=cff002cf-1823-4975-af51-2b6d7a538f3e";
    script.setAttribute("data-blockingmode", "auto");
    script.async = true;
    script.type = "text/javascript";

    // Listen when Cookiebot is fully loaded
    script.onload = () => {
      if (window.Cookiebot) {
        // If already accepted
        handleConsent();

        // Or wait for event
        window.addEventListener("CookieConsentDeclaration", handleConsent);
      }
    };

    document.head.appendChild(script);

    return () => {
      window.removeEventListener("CookieConsentDeclaration", handleConsent);
    };
  }, [onConsentReady]);
};
