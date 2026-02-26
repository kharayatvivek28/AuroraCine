import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { fetchMoviesByCategory } from "../api/api";
import { PageTransition, StaggerContainer, StaggerItem, FadeInUp } from "../components/AnimationWrappers";
import { SkeletonGrid } from "../components/SkeletonCard";

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const apiCategory = category.replace("-", "_");

  const getPageTitle = (param) => {
    return param
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const resData = await fetchMoviesByCategory(apiCategory, currentPage);

      setMovies(resData.results || []);
      setTotalPages(Math.min(resData.total_pages, 500) || 1);
      setIsLoading(false);

      window.scrollTo(0, 0);
    };
    fetchData();
  }, [apiCategory, currentPage]);

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FadeInUp>
        <h1 className="text-4xl font-extrabold mb-8 text-yellow-500 dark:text-yellow-400">
          {getPageTitle(category)} Movies
        </h1>
      </FadeInUp>

      {/* Loading State */}
      {isLoading && <SkeletonGrid count={10} />}

      {!isLoading && movies.length === 0 && (
        <div className="text-center text-gray-500 text-xl py-10">
          No results found in this category.
        </div>
      )}

      {/* Movie Grid */}
      {!isLoading && movies.length > 0 && (
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {movies.map((movie) => (
            <StaggerItem key={movie.id}>
              <MovieCard
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </PageTransition>
  );
}
