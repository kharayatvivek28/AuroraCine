import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { User as UserIcon, Sun, Moon } from "lucide-react";

export default function Navbar({ onOpenAuthModal }) {
  const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false);
  const { currentUser, logout, isLoading, signInWithGoogle } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const categories = [
    { name: "Popular", path: "/movies/popular" },
    { name: "Now Playing", path: "/movies/now-playing" },
    { name: "Upcoming", path: "/movies/upcoming" },
    { name: "Top Rated", path: "/movies/top-rated" },
  ];

  const handleAuthClick = () => {
    if (currentUser) {
      logout();
    } else if (onOpenAuthModal) {
      onOpenAuthModal(true);
    } else {
      signInWithGoogle();
    }
    setIsMoviesDropdownOpen(false);
  };

  return (
    <nav className="bg-indigo-600 dark:bg-indigo-900 text-white p-4 flex justify-between items-center shadow-2xl sticky top-0 z-50 border-b border-indigo-500/50 dark:border-indigo-700/50">
      <Link
        to="/"
        className="text-3xl font-extrabold tracking-wider hover:text-yellow-400 transition"
      >
        AuroraCine 🎬
      </Link>

      {/* Menu */}
      <ul className="hidden md:flex space-x-6 items-center">
        {/* Movies Dropdown */}
        <li className="relative">
          <button
            onClick={() => setIsMoviesDropdownOpen(!isMoviesDropdownOpen)}
            className="hover:text-yellow-300 cursor-pointer text-lg transition flex items-center space-x-1 p-2 rounded-lg"
          >
            <span>Movies</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isMoviesDropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {/* Dropdown Content */}
          {isMoviesDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-20 border border-gray-200 dark:border-gray-700">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={() => setIsMoviesDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-700 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </li>

        <li>
          <Link
            to="/my-bookings"
            className="hover:text-yellow-300 cursor-pointer text-lg transition"
          >
            My Booking
          </Link>
        </li>
      </ul>

      <div className="flex items-center space-x-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-indigo-500 dark:bg-indigo-800 hover:bg-indigo-400 dark:hover:bg-indigo-700 transition"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun size={20} className="text-yellow-300" />
          ) : (
            <Moon size={20} className="text-white" />
          )}
        </button>

        {/* Auth Button */}
        <button
          onClick={handleAuthClick}
          disabled={isLoading}
          className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 transition duration-200 shadow-md flex items-center space-x-2"
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : currentUser ? (
            <>
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="User"
                  className="w-6 h-6 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon size={20} className="text-indigo-900" />
              )}
              <span className="hidden sm:inline">Logout</span>
            </>
          ) : (
            <>
              <UserIcon size={20} className="text-indigo-900" />
              <span>Sign In / Register</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
