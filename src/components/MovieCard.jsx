import React from "react";
import { BASE_IMAGE_URL } from "../api/api";
import { Ticket } from "lucide-react";
import toast from "react-hot-toast";

export default function MovieCard({ movie, onClick }) {
  const posterUrl = movie.poster_path
    ? `${BASE_IMAGE_URL}w300${movie.poster_path}`
    : `https://placehold.co/300x450/4f46e5/FFFFFF?text=No+Poster`;

  const handleBookNow = (e) => {
    e.stopPropagation(); // Prevent card click
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
    <div
      className="cursor-pointer transform hover:scale-105 transition duration-300 ease-in-out shadow-xl rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-yellow-400"
      onClick={onClick}
    >
      {/* Movie poster */}
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

      {/* Movie info */}
      <div className="p-3 text-white">
        <h2 className="text-base font-semibold truncate">{movie.title}</h2>

        {/* ⭐ Rating + Book Now */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-yellow-400 font-medium text-sm flex items-center space-x-1">
            <span>⭐</span>
            <span>
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </p>

          {/* 🎟️ Book Now button */}
          <button
            onClick={handleBookNow}
            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full transition duration-200 shadow-md"
          >
            <Ticket size={14} />
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
