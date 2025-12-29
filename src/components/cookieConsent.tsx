"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCookie, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdClose, MdCheck } from "react-icons/md";

type CookiePreferenceKey =
  | "necessary"
  | "functional"
  | "analytics"
  | "marketing";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<
    Record<CookiePreferenceKey, boolean>
  >({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const consent = sessionStorage.getItem("cookie_consent");
      if (!consent) {
        setShowConsent(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    sessionStorage.setItem("cookie_consent", JSON.stringify(allAccepted));
    document.cookie = `userConsent=all; path=/; max-age=31536000; SameSite=Lax; Secure`;
    setShowConsent(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    sessionStorage.setItem("cookie_consent", JSON.stringify(necessaryOnly));
    document.cookie = `userConsent=necessary; path=/; max-age=31536000; SameSite=Lax; Secure`;
    setShowConsent(false);
  };

  const savePreferences = () => {
    const customPreferences = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    sessionStorage.setItem("cookie_consent", JSON.stringify(customPreferences));
    const consentValue = Object.entries(preferences)
      .filter(([key, value]) => value)
      .map(([key]) => key)
      .join(",");
    document.cookie = `userConsent=${consentValue}; path=/; max-age=31536000; SameSite=Lax; Secure`;
    setShowConsent(false);
  };

  const togglePreference = (key: CookiePreferenceKey) => {
    if (key === "necessary") return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieCategories: {
    id: CookiePreferenceKey;
    title: string;
    description: string;
    required: boolean;
  }[] = [
    {
      id: "necessary",
      title: "Necessary Cookies",
      description:
        "Essential for the website to function properly. These cannot be disabled.",
      required: true,
    },
    {
      id: "functional",
      title: "Functional Cookies",
      description:
        "Enable enhanced functionality and personalization, such as language preferences.",
      required: false,
    },
    {
      id: "analytics",
      title: "Analytics Cookies",
      description:
        "Help us understand how visitors interact with our website by collecting anonymous data.",
      required: false,
    },
    {
      id: "marketing",
      title: "Marketing Cookies",
      description:
        "Used to track visitors across websites to display relevant advertisements.",
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {showConsent && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
            onClick={() => setShowConsent(false)}
          />

          {/* Cookie Consent Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl z-[9999] overflow-hidden"
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-description"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <FaCookie className="text-white text-xl" />
                </div>
                <div>
                  <h2
                    id="cookie-consent-title"
                    className="text-white font-semibold text-lg leading-tight"
                  >
                    Cookie Preferences
                  </h2>
                  <p className="text-blue-100 text-xs">
                    Manage your privacy settings
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConsent(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                aria-label="Close cookie consent"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="px-6 py-5">
                <p
                  id="cookie-consent-description"
                  className="text-gray-700 text-sm leading-relaxed mb-4"
                >
                  We use cookies to enhance your browsing experience, serve
                  personalized content, and analyze our traffic. By clicking
                  &quot;Accept All&quot;, you consent to our use of cookies.
                </p>

                {/* Cookie Details Toggle */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm mb-4 transition-colors"
                  aria-expanded={showDetails}
                >
                  <span>Customize Settings</span>
                  {showDetails ? (
                    <FaChevronUp size={14} />
                  ) : (
                    <FaChevronDown size={14} />
                  )}
                </button>

                {/* Cookie Categories */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3 mb-5 overflow-hidden"
                    >
                      {cookieCategories.map((category) => (
                        <div
                          key={category.id}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                {category.title}
                              </h3>
                              <p className="text-gray-600 text-xs leading-relaxed">
                                {category.description}
                              </p>
                            </div>
                            <button
                              onClick={() => togglePreference(category.id)}
                              disabled={category.required}
                              className={`flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 relative ${
                                preferences[category.id]
                                  ? "bg-blue-600"
                                  : "bg-gray-300"
                              } ${
                                category.required
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                              role="switch"
                              aria-checked={preferences[category.id]}
                              aria-label={`Toggle ${category.title}`}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${
                                  preferences[category.id]
                                    ? "translate-x-6"
                                    : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                          {category.required && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              Always Active
                            </span>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Privacy Policy Link */}
                <p className="text-xs text-gray-500 mb-5">
                  Read our{" "}
                  <a
                    href="/privacy-policy"
                    className="text-blue-600 hover:text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/cookie-policy"
                    className="text-blue-600 hover:text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie Policy
                  </a>{" "}
                  for more information.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3">
                {showDetails ? (
                  <>
                    <button
                      onClick={acceptNecessary}
                      className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                    >
                      Necessary Only
                    </button>
                    <button
                      onClick={savePreferences}
                      className="flex-1 px-4 py-2.5 bg-gray-800 text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <MdCheck size={18} />
                      Save Preferences
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={acceptNecessary}
                      className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                    >
                      Necessary Only
                    </button>
                    <button
                      onClick={acceptAll}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                    >
                      <MdCheck size={18} />
                      Accept All
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
