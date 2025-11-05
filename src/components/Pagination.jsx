import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxPagesToShow = 7;

  // Do not render if there is only one page or no pages
  if (totalPages <= 1) return null;

  // Calculate the range of pages to display to keep the current page centered
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Adjust startPage if we reached the end boundary
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  // Create an array of page numbers to map over
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex space-x-2 justify-center mt-8 p-4">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full bg-indigo-700 text-white font-semibold hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-400 transition"
      >
        Prev
      </button>

      {/* Page numbers: Hidden on small screens to save space */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`hidden sm:block px-4 py-2 rounded-full font-semibold transition ${
            page === currentPage
              ? "bg-yellow-400 text-gray-900 shadow-md ring-2 ring-yellow-400/50"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full bg-indigo-700 text-white font-semibold hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-400 transition"
      >
        Next
      </button>
    </div>
  );
}
