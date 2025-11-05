import React from "react";

export default function SearchBar({
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-4 rounded-full border-2 border-indigo-500 shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 focus:border-yellow-400 text-lg text-white text-gray-900 transition duration-300 placeholder:text-gray-500"
      />
      <svg
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Search Icon Path */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
  );
}
