import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer";
import { fetchPopularMovies, searchMovies } from "../api/api";
import { useDebounce } from "../hooks/useDebounce";

const DEBOUNCE_DELAY = 500;
const TMDB_MAX_PAGES = 500;

export default function Home() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 🌟 Now only used for pagination UI
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce the search term
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);

  // 🌟 FIX: useEffect now depends on debouncedSearch and currentPage
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Reset page to 1 if the search term changes (user started typing/searching)
      const pageToFetch =
        search !== "" && debouncedSearch === search ? 1 : currentPage;

      // If the search term just changed, ensure we are on page 1 before fetching
      if (debouncedSearch && pageToFetch === currentPage && currentPage !== 1) {
        // This ensures the pagination state aligns with the new search
        setCurrentPage(1);
        // We return here to let the next render cycle execute the fetch with page 1
        return;
      }

      const page = debouncedSearch ? pageToFetch : currentPage;

      try {
        const endpointFunction = debouncedSearch
          ? searchMovies
          : fetchPopularMovies;

        // Fetch data using the debounced term or fetch popular
        const resData = await endpointFunction(
          debouncedSearch || page, // searchMovies expects query, fetchPopularMovies expects page, but they all return data
          page
        );

        // Update state with results and total pages from the API
        setMovies(resData.results || []);
        setTotalPages(
          resData.total_pages > TMDB_MAX_PAGES
            ? TMDB_MAX_PAGES
            : resData.total_pages || 1
        );

        if (resData.total_results === 0 && debouncedSearch) {
          setError(`No movies found for "${debouncedSearch}".`);
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError(
          "Failed to fetch movies. Check API key and network connection."
        );
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Execute fetch whenever search or page changes
    fetchData();
  }, [debouncedSearch, currentPage]); // Re-run effect only when these dependencies change

  // Handler for MovieCard click
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    // Add flex-col to enable the footer to push to the bottom
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* 1. Hero Banner with dynamic background and integrated SearchBar */}
      <HeroBanner
        movies={movies}
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      {/* Main Content Area - flex-grow ensures it takes up available space */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <h3 className="text-3xl font-bold mb-8 text-white">
          {debouncedSearch
            ? `Search Results for "${debouncedSearch}"`
            : "Popular Movies"}
        </h3>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-xl text-center text-yellow-400">
            Loading cinema listings...
          </div>
        )}
        {error && (
          <div className="text-xl text-center text-red-500">{error}</div>
        )}

        {!isLoading && movies.length === 0 && !error && (
          <div className="text-xl text-center text-gray-500 py-10">
            No movies found. Try a different search!
          </div>
        )}

        {/* 2. Movie Grid */}
        {!isLoading && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </div>
        )}

        {/* 3. Pagination */}
        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* 4. Professional Footer - Renders below all content */}
      <Footer />
    </div>
  );
}
