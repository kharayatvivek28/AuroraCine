import axios from "axios";

// Key loaded from .env (VITE_TMDB_API_KEY)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
export const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/";

// Helper to handle missing API Key defensively and set params
const getParams = (page = 1, query = null) => {
  if (!API_KEY) {
    console.error(
      "VITE_TMDB_API_KEY is missing. Check .env file and Vercel ENV."
    );
    return null;
  }
  const params = { api_key: API_KEY, language: "en-US", page };
  if (query) {
    params.query = query;
  }
  return params;
};

// 🌟 NEW FUNCTION: Handles all category fetches (popular, now_playing, upcoming, top_rated)
export const fetchMoviesByCategory = async (category, page = 1) => {
  // The category string (e.g., 'top_rated') is directly used in the endpoint
  const endpoint = `/movie/${category}`;
  const params = getParams(page);
  if (!params) return { results: [], total_pages: 1 };

  try {
    const res = await axios.get(`${BASE_URL}${endpoint}`, { params });
    return res.data; // Includes results and total_pages
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error);
    return { results: [], total_pages: 1 };
  }
};

// 🌟 UPDATED: fetchPopularMovies now uses fetchMoviesByCategory for consistency
export const fetchPopularMovies = (page = 1) =>
  fetchMoviesByCategory("popular", page);

// Searches movies by query. Returns full data object { results, total_pages } for pagination.
export const searchMovies = async (query, page = 1) => {
  const params = getParams(page, query);
  if (!params) return { results: [], total_pages: 1 };

  try {
    const res = await axios.get(`${BASE_URL}/search/movie`, { params });
    return res.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    return { results: [], total_pages: 1 };
  }
};

// Fetches details for a single movie ID, including credits for director/cast.
export const fetchMovieDetails = async (id) => {
  const params = getParams();
  if (!params) return null;

  try {
    const res = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        ...params,
        // Append credits to get director/cast info in a single call
        append_to_response: "credits",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};
