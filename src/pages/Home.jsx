import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer";
import { fetchPopularMovies, searchMovies, fetchMoviesByGenre } from "../api/api";
import { useDebounce } from "../hooks/useDebounce";
import { PageTransition, StaggerContainer, StaggerItem, FadeInView } from "../components/AnimationWrappers";
import { SkeletonGrid } from "../components/SkeletonCard";
import GenreFilter from "../components/GenreFilter";

const DEBOUNCE_DELAY = 500;
const TMDB_MAX_PAGES = 500;

export default function Home() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const pageToFetch =
        search !== "" && debouncedSearch === search ? 1 : currentPage;

      if (debouncedSearch && pageToFetch === currentPage && currentPage !== 1) {
        setCurrentPage(1);
        return;
      }

      const page = debouncedSearch ? pageToFetch : currentPage;

      try {
        let resData;
        if (debouncedSearch) {
          resData = await searchMovies(debouncedSearch, page);
        } else if (selectedGenres.length > 0) {
          resData = await fetchMoviesByGenre(selectedGenres, page);
        } else {
          resData = await fetchPopularMovies(page);
        }

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

    fetchData();
  }, [debouncedSearch, currentPage, selectedGenres]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <PageTransition className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* 1. Hero Banner */}
      <HeroBanner
        movies={movies}
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      {/* Genre Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <GenreFilter
          selectedGenres={selectedGenres}
          onGenreChange={(genres) => {
            setSelectedGenres(genres);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <FadeInView>
          <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {debouncedSearch
              ? `Search Results for "${debouncedSearch}"`
              : "Popular Movies"}
          </h3>
        </FadeInView>

        {/* Loading and Error States */}
        {isLoading && <SkeletonGrid count={12} />}
        {error && (
          <div className="text-xl text-center text-red-500">{error}</div>
        )}

        {!isLoading && movies.length === 0 && !error && (
          <div className="text-xl text-center text-gray-500 py-10">
            No movies found. Try a different search!
          </div>
        )}

        {/* 2. Movie Grid with staggered animation */}
        {!isLoading && movies.length > 0 && (
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <StaggerItem key={movie.id}>
                <MovieCard
                  movie={movie}
                  onClick={() => handleMovieClick(movie.id)}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
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

      {/* 4. Footer */}
      <Footer />
    </PageTransition>
  );
}
