import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Only Routes & Route, no Router
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Booking from "./pages/Booking";
import Success from "./pages/Success";
import CategoryPage from "./pages/CategoryPage";
import MyBookings from "./pages/MyBookings";

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

      {/* Page Routes */}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:category" element={<CategoryPage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/success" element={<Success />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </>
  );
}
