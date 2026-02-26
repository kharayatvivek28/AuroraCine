import React from "react";
import { motion } from "framer-motion";
import { BASE_IMAGE_URL } from "../api/api";
import { Ticket } from "lucide-react";
import toast from "react-hot-toast";

function getRatingColor(rating) {
  if (rating >= 7) return "bg-green-500";
  if (rating >= 5) return "bg-yellow-500";
  return "bg-red-500";
}

export default function MovieCard({ movie, onClick }) {
  const posterUrl = movie.poster_path
    ? `${BASE_IMAGE_URL}w300${movie.poster_path}`
    : `https://placehold.co/300x450/4f46e5/FFFFFF?text=No+Poster`;

  const handleBookNow = (e) => {
    e.stopPropagation();
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-slideUpAndFade" : "opacity-0"
          } flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white px-5 py-3 rounded-xl shadow-lg border border-indigo-400/40 backdrop-blur-sm`}
        >
          <Ticket size={18} className="text-yellow-300" />
          <span className="font-medium text-sm">
            🎬 Opening movie details...
          </span>
        </div>
      ),
      {
        duration: 1000,
        position: "bottom-center",
      }
    );

    setTimeout(() => {
      onClick();
    }, 700);
  };

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 shadow-xl"
      onClick={onClick}
    >
      {/* Movie poster with rating overlay */}
      <div className="relative">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-72 md:h-80 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/300x450/4f46e5/FFFFFF?text=No+Poster";
          }}
        />
        {/* Rating badge overlay */}
        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-white shadow-lg backdrop-blur-sm ${getRatingColor(
            movie.vote_average || 0
          )}`}
        >
          ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </span>
      </div>

      {/* Movie info */}
      <div className="p-3 text-gray-900 dark:text-white">
        <h2 className="text-sm font-semibold truncate mb-2">{movie.title}</h2>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBookNow}
          className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2 rounded-lg transition duration-200 shadow-md"
        >
          <Ticket size={14} />
          <span>Book Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
