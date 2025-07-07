// hooks/useCookiebot.ts
import { useEffect } from "react";

export const useCookiebot = (onReady?: () => void) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("Cookiebot")) return;

    const script = document.createElement("script");
    script.id = "Cookiebot";
    script.src = "https://consent.cookiebot.com/uc.js";
    script.type = "text/javascript";
    script.setAttribute("data-cbid", "cff002cf-1823-4975-af51-2b6d7a538f3e");
    script.setAttribute("data-blockingmode", "auto");
    script.async = true;

    script.onload = () => {
      console.log("✅ Cookiebot loaded");

      
      if (window?.Cookiebot?.renew) {
        window.Cookiebot.renew();
      }

      onReady?.(); 
    };

    document.head.appendChild(script);
  }, [onReady]);
};
