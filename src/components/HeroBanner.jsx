import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { BASE_IMAGE_URL } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

const IMAGE_SIZE = "original";
const FALLBACK_IMAGE =
  "https://placehold.co/1920x1080/1f2937/FFFFFF?text=AuroraCine";

export default function HeroBanner({ movies, search, onSearchChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cycleDuration = 8000;

  const backdropMovies = movies.filter((m) => m.backdrop_path).slice(0, 5);
  const currentMovie = backdropMovies[currentIndex];

  useEffect(() => {
    if (backdropMovies.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % backdropMovies.length);
      }, cycleDuration);

      return () => clearInterval(timer);
    }
  }, [backdropMovies.length, cycleDuration]);

  const backgroundImageUrl = currentMovie?.backdrop_path
    ? `${BASE_IMAGE_URL}${IMAGE_SIZE}${currentMovie.backdrop_path}`
    : FALLBACK_IMAGE;

  return (
    <div className="relative h-[70vh] md:h-[75vh] w-full overflow-hidden">
      {/* Background image with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundImageUrl}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
      </AnimatePresence>

      {/* Gradient overlays — lighter on top, stronger at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-2xl tracking-tight text-white text-center"
        >
          Experience Cinema Like Never Before
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/70 text-base md:text-lg mb-8 text-center max-w-2xl"
        >
          Browse the latest blockbusters, pick your seats, and book instantly
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-xl"
        >
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search thousands of movies..."
            className="search-bar-hero"
          />
        </motion.div>

        {/* Navigation dots */}
        {backdropMovies.length > 1 && (
          <div className="flex items-center gap-2 mt-6">
            {backdropMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentIndex
                    ? "w-6 h-2 bg-yellow-400"
                    : "w-2 h-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
