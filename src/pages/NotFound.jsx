import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
          className="text-9xl font-extrabold text-indigo-600 dark:text-indigo-400 drop-shadow-lg"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
            Looks like this scene was cut from the movie. The page you're
            looking for doesn't exist or has been moved.
          </p>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-yellow-400 text-indigo-900 px-6 py-3 rounded-xl font-bold text-lg hover:bg-yellow-300 transition duration-200 shadow-xl"
          >
            <span>🎬</span>
            <span>Return to Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
