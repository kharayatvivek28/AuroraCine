import React from "react";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
];

export default function GenreFilter({ selectedGenres = [], onGenreChange }) {
  const toggleGenre = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      onGenreChange(selectedGenres.filter((id) => id !== genreId));
    } else {
      onGenreChange([...selectedGenres, genreId]);
    }
  };

  const clearAll = () => {
    onGenreChange([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 mr-1">
        Genres:
      </span>
      {GENRES.map((genre) => {
        const isSelected = selectedGenres.includes(genre.id);
        return (
          <button
            key={genre.id}
            onClick={() => toggleGenre(genre.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              isSelected
                ? "bg-yellow-400 text-indigo-900 border-yellow-400 shadow-md scale-105"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            {genre.name}
          </button>
        );
      })}
      {selectedGenres.length > 0 && (
        <button
          onClick={clearAll}
          className="px-3 py-1.5 rounded-full text-sm font-medium text-red-500 hover:text-red-400 border border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
