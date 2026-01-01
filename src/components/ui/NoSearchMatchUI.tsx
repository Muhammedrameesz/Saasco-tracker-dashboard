"use client";

import { BiSearchAlt2 } from "react-icons/bi";
import { motion } from "framer-motion";

export default function NoSearchMatch() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center w-full p-10"
    >
      <motion.div
        initial={{ scale: 0.6 }}
        animate={{ scale: [1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="p-6 bg-gradient-to-tr from-pink-100 via-red-50 to-yellow-100 rounded-full shadow-xl"
      >
        <BiSearchAlt2 className="text-red-500 w-16 h-16 drop-shadow-lg" />
      </motion.div>

      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl mt-6 font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-500 to-pink-500"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        No Match Found
      </motion.h1>

      <motion.p
        className="text-center mt-3 text-sm sm:text-base text-gray-500 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Oops! We couldn&apos;t find anything. Try searching with a different keyword.
      </motion.p>
    </motion.div>
  );
}
