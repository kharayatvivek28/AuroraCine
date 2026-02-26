import React, { Suspense, lazy, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

// Code splitting — lazy load all page components
const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const Booking = lazy(() => import("./pages/Booking"));
const Success = lazy(() => import("./pages/Success"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback for Suspense
function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      {/* Navbar at top */}
      <Navbar onOpenAuthModal={setIsAuthModalOpen} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Page Routes wrapped in ErrorBoundary + Suspense */}
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies/:category" element={<CategoryPage />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/success" element={<Success />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
