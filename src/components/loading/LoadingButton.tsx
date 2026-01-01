'use client';

import { motion } from 'framer-motion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

type LoadingButtonProps = {
  text?: string;
  loading?: boolean;
};

export default function LoadingButton({ text = "Submitting", loading = true }: LoadingButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      disabled={loading}
      className="relative inline-flex items-center gap-3 rounded-xl px-6 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all duration-300 disabled:cursor-not-allowed"
    >
      {loading && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
          className="text-lg"
        >
          <AiOutlineLoading3Quarters className="animate-spin-slow" />
        </motion.span>
      )}
      {text}
    </motion.button>
  );
}
