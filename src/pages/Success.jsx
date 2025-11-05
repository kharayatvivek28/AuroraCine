import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Match property names from Booking.jsx
  const {
    name,
    email,
    seats,
    totalPaid, // <-- changed from totalCost
    movieTitle,
  } = location.state || {};

  const bookingId = `AC${Date.now().toString().slice(-8)}`;

  if (!movieTitle || !totalPaid) {
    return (
      <div className="text-xl text-center p-20 text-red-500">
        Booking data lost. Please return to the{" "}
        <a href="/" className="text-indigo-400 hover:underline">
          Home Page
        </a>
        .
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl border border-green-500/50 shadow-2xl text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-600 p-4 rounded-full shadow-lg">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>

        {/* Confirmation Message */}
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-gray-300 text-lg">
            Your seats for <span className="text-yellow-400">{movieTitle}</span>{" "}
            have been successfully reserved.
          </p>
        </div>

        {/* Summary Details */}
        <div className="bg-gray-900 p-6 rounded-xl space-y-4 text-left border border-gray-700">
          <div className="flex justify-between items-center pb-4 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Confirmation ID:</span>
            <span className="text-white font-mono font-bold text-lg">
              {bookingId}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Customer:</span>
              <span className="text-white font-semibold">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Seats:</span>
              <span className="text-white">
                {seats ? seats.join(", ") : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-white break-all">{email}</span>
            </div>

            <div className="flex justify-between pt-3 border-t border-gray-700">
              <span className="text-white text-xl">Total Amount Paid:</span>
              <span className="text-green-500 text-3xl font-bold">
                ₹{totalPaid.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            A detailed e-ticket will be sent to your email address shortly.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl"
          >
            Return to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}
