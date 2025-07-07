"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCookieBite,
  FaShieldAlt,
  FaRegTimesCircle,
  FaBan,
} from "react-icons/fa";
import { MdPrivacyTip } from "react-icons/md";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

 useEffect(() => {
  const timer = setTimeout(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, 6000); 

  return () => clearTimeout(timer);
}, []);


  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    document.cookie = `userConsent=true; path=/; max-age=31536000; SameSite=Lax`;
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 border  bg-white shadow-base border-b-4 border-[#cd2b1a]/50 rounded-2xl max-w-lg mx-auto px-6 py-6 z-[9999] text-center "
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-2 px-3 py-2 rounded-md ">
            <motion.div
              className="flex items-center gap-3 text-[#cd2b1a]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="bg-[#cd2b1a]/10 p-2 rounded-full"
              >
                <FaCookieBite size={28} className="text-[#cd2b1a]" />
              </motion.div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#cd2b1a] to-[#ff6600]">
                Cookies & Privacy
              </span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowConsent(false)}
              className="text-gray-400 hover:text-red-500 transition duration-200 cursor-pointer"
              aria-label="Close"
            >
              <FaRegTimesCircle size={22} />
            </motion.button>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-300 mb-5" />

          {/* Message */}
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            This website uses cookies to ensure you get the best experience.
            Click <strong className="text-[#cd2b1a]">&quot;Allow&quot;</strong>{" "}
            to consent to storing cookies for personalization and analytics.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <button
              onClick={acceptCookies}
              className="cursor-pointer group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <span className="absolute -inset-px rounded-full bg-gradient-to-r from-blue-200 to-blue-400 blur-md opacity-50 group-hover:opacity-70 transition" />
              <FaShieldAlt className="animate-pulse z-10" />
              <span className="z-10 font-semibold tracking-wide text-sm">
                Allow Cookies
              </span>
            </button>

            <button
              onClick={() => setShowConsent(false)}
              className="cursor-pointer group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <span className="absolute -inset-px rounded-full bg-gradient-to-r from-red-400 to-red-500 blur-md opacity-50 group-hover:opacity-70 transition" />
              <FaBan className="group-hover:rotate-180 transition-transform duration-500 z-10" />
              <span className="z-10 font-semibold tracking-wide text-sm">
                Decline
              </span>
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-5 flex items-center justify-center text-xs text-gray-400 gap-1">
            <MdPrivacyTip className="text-blue-400" />
            <span>Your privacy is our priority.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
