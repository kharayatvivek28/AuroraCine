import React from "react";

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl animate-pulse">
      {/* Poster skeleton */}
      <div className="w-full h-72 md:h-80 bg-gray-300 dark:bg-gray-700" />

      {/* Info skeleton */}
      <div className="p-3 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />

        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12" />
          {/* Book button */}
          <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function MovieDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 animate-pulse">
      <div className="max-w-6xl mx-auto p-6">
        {/* Movie Header skeleton */}
        <div className="flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl mb-10">
          <div className="w-56 h-80 bg-gray-300 dark:bg-gray-700 rounded-lg flex-shrink-0" />
          <div className="flex-grow space-y-4 py-2">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-56" />
            <div className="space-y-2 mt-4">
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full" />
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full" />
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
            </div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg w-40 mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
