import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { BASE_IMAGE_URL } from "../api/api";

const IMAGE_SIZE = "original";
const FALLBACK_IMAGE =
  "https://placehold.co/1920x1080/1f2937/FFFFFF?text=AuroraCine";

export default function HeroBanner({ movies, search, onSearchChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cycleDuration = 15000; // 15 seconds per user request

  // Use the top 5 movies with backdrops for the dynamic background
  const backdropMovies = movies.filter((m) => m.backdrop_path).slice(0, 5);
  const currentMovie = backdropMovies[currentIndex];

  // Auto-cycle logic
  useEffect(() => {
    if (backdropMovies.length > 0) {
      const timer = setInterval(() => {
        // Cycle to the next index, wrapping around to 0
        setCurrentIndex((prevIndex) => (prevIndex + 1) % backdropMovies.length);
      }, cycleDuration);

      // Cleanup: Clear the interval when the component unmounts or dependencies change
      return () => clearInterval(timer);
    }
  }, [backdropMovies, cycleDuration]); // Re-run effect when movie list changes

  // Construct the background image URL, falling back if necessary
  const backgroundImageUrl = currentMovie?.backdrop_path
    ? `${BASE_IMAGE_URL}${IMAGE_SIZE}${currentMovie.backdrop_path}`
    : FALLBACK_IMAGE;

  return (
    <div
      className="relative h-[65vh] w-full flex items-center justify-center text-white  transition-opacity duration-1000 ease-in-out"
      style={{
        // Use a background gradient overlay to ensure text is readable
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 text-center px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-10 drop-shadow-2xl tracking-tight">
          Experience Cinema Like Never Before
        </h2>

        {/* Search Bar is centered over the banner */}
        <div className="max-w-xl mx-auto">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search thousands of movies..."
            className="search-bar-hero"
          />
        </div>
      </div>
    </div>
  );
}
