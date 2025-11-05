import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { fetchMoviesByCategory } from "../api/api";

export default function CategoryPage() {
  // Reads the ':category' part of the URL (e.g., 'popular', 'top-rated')
  const { category } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Converts URL format (e.g., 'now-playing') to TMDB API format (e.g., 'now_playing')
  const apiCategory = category.replace("-", "_");

  // Function to title-case the category for display (e.g., 'now-playing' -> 'Now Playing')
  const getPageTitle = (param) => {
    return param
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // 1. Reset page state to 1 when the category in the URL changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  // 2. Fetch data whenever the category or page changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch data using the specific TMDB category endpoint
      const resData = await fetchMoviesByCategory(apiCategory, currentPage);

      setMovies(resData.results || []);
      // Limit total pages to 500 (TMDB restriction)
      setTotalPages(Math.min(resData.total_pages, 500) || 1);
      setIsLoading(false);

      window.scrollTo(0, 0); // Scroll to the top on new content load
    };
    fetchData();
  }, [apiCategory, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-yellow-400">
        {getPageTitle(category)} Movies
      </h1>

      {/* Loading/Error States */}
      {isLoading && (
        <div className="text-center text-purple-400 text-xl py-10">
          Loading {getPageTitle(category)}...
        </div>
      )}

      {!isLoading && movies.length === 0 && (
        <div className="text-center text-gray-500 text-xl py-10">
          No results found in this category.
        </div>
      )}

      {/* Movie Grid: Renders movies with name, image, and rating */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-12">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            // Navigate to the details page upon click
            onClick={() => navigate(`/movie/${movie.id}`)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
