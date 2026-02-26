import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { User as UserIcon, Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ onOpenAuthModal }) {
  const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout, isLoading, signInWithGoogle } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  const categories = [
    { name: "Popular", path: "/movies/popular" },
    { name: "Now Playing", path: "/movies/now-playing" },
    { name: "Upcoming", path: "/movies/upcoming" },
    { name: "Top Rated", path: "/movies/top-rated" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMoviesDropdownOpen(false);
  }, [location.pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleAuthClick = () => {
    if (currentUser) {
      logout();
    } else if (onOpenAuthModal) {
      onOpenAuthModal(true);
    } else {
      signInWithGoogle();
    }
    setIsMoviesDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav ref={mobileMenuRef} className="bg-indigo-600 dark:bg-indigo-900 text-white shadow-2xl sticky top-0 z-50 border-b border-indigo-500/50 dark:border-indigo-700/50">
      <div className="p-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wider hover:text-yellow-400 transition"
        >
          AuroraCine 🎬
        </Link>

        {/* Desktop Menu */}
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

            {/* Desktop Dropdown Content */}
            <AnimatePresence>
              {isMoviesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-20 border border-gray-200 dark:border-gray-700"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
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

          {/* Auth Button — hidden on small screens when mobile menu is closed */}
          <button
            onClick={handleAuthClick}
            disabled={isLoading}
            className="hidden md:flex bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 transition duration-200 shadow-md items-center space-x-2"
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
                <span>Logout</span>
              </>
            ) : (
              <>
                <UserIcon size={20} className="text-indigo-900" />
                <span>Sign In / Register</span>
              </>
            )}
          </button>

          {/* Hamburger Button — mobile only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-indigo-500 dark:hover:bg-indigo-800 transition"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-indigo-500/30 dark:border-indigo-700/30"
          >
            <div className="px-4 py-4 space-y-2 bg-indigo-700/50 dark:bg-indigo-950/50 backdrop-blur-sm">
              {/* Movie Categories */}
              <p className="text-xs uppercase tracking-wider text-indigo-300 dark:text-indigo-400 font-semibold px-3 pt-1">
                Browse Movies
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className="block px-3 py-2.5 rounded-lg text-white hover:bg-indigo-500/50 dark:hover:bg-indigo-700/50 transition font-medium"
                >
                  {cat.name}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-indigo-500/30 dark:border-indigo-700/30 my-2" />

              {/* My Bookings */}
              <Link
                to="/my-bookings"
                className="block px-3 py-2.5 rounded-lg text-white hover:bg-indigo-500/50 dark:hover:bg-indigo-700/50 transition font-medium"
              >
                🎟️ My Bookings
              </Link>

              {/* Divider */}
              <div className="border-t border-indigo-500/30 dark:border-indigo-700/30 my-2" />

              {/* Auth Button — mobile */}
              <button
                onClick={handleAuthClick}
                disabled={isLoading}
                className="w-full bg-yellow-400 text-indigo-900 px-4 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition duration-200 shadow-md flex items-center justify-center space-x-2"
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
                    <span>Logout</span>
                  </>
                ) : (
                  <>
                    <UserIcon size={20} className="text-indigo-900" />
                    <span>Sign In / Register</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
