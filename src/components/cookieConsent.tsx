// components/CookieConsent.tsx
"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    // ✅ Store the consent flag
    localStorage.setItem("cookie_consent", "true");
    setShowConsent(false);

    // ✅ Set a test cookie to verify Safari/incognito behavior
    document.cookie = `userConsent=true; path=/; max-age=31536000; SameSite=Lax`;
  };

  return showConsent ? (
    <div className="fixed bottom-4 left-4 right-4 bg-white border shadow-lg p-4 rounded-md z-50 max-w-md mx-auto text-center text-sm md:text-base">
      <p className="mb-3">
        We use cookies to improve your experience. By clicking &quot;Allow&quot;, you
        agree to store cookies on this device.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={acceptCookies}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Allow Cookies
        </button>
        {/* Optional Decline Button
        <button
          onClick={() => setShowConsent(false)}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Decline
        </button>
        */}
      </div>
    </div>
  ) : null;
}
