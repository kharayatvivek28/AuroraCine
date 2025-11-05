import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import { useAuth } from "../hooks/useAuth";
import { BASE_IMAGE_URL } from "../api/api";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config/env";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isLoading: authLoading } = useAuth();

  const {
    selectedMovie,
    selectedSeats,
    selectedShowtime,
    selectedDate,
    pricePerSeat,
  } = useContext(BookingContext);

  // user details from previous step
  const { name, email } = location.state || {};

  const [activeBookings, setActiveBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const totalCost = Array.isArray(selectedSeats)
    ? selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0)
    : 0;

  // 🧠 Prevent crash if context is empty or user refreshed
  useEffect(() => {
    if (
      !selectedMovie ||
      !Array.isArray(selectedSeats) ||
      selectedSeats.length === 0 ||
      !selectedShowtime ||
      !name ||
      !email
    ) {
      toast.error("Booking details missing. Redirecting...");
      navigate("/");
    }
  }, [selectedMovie, selectedSeats, selectedShowtime, name, email, navigate]);

  // 🧾 Fetch active bookings
  useEffect(() => {
    const loadBookings = async () => {
      if (!currentUser) return;
      try {
        const allBookingsSnapshot = await getDocs(collection(db, "bookings"));
        const now = Date.now();

        const myBookings = allBookingsSnapshot.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .filter((b) => b.userId === currentUser.uid);

        const active = myBookings.filter((b) => b.expiresAt > now);
        setActiveBookings(active);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    };
    loadBookings();
  }, [currentUser]);

  // ✅ Save booking in Firestore
  const saveBookingToFirestore = async (paymentId) => {
    try {
      await addDoc(collection(db, "bookings"), {
        userId: currentUser.uid,
        userName: name || currentUser.displayName || "Guest",
        userEmail: email || currentUser.email || "unknown",
        movieId: String(selectedMovie.id),
        movieTitle: selectedMovie.title || "Untitled Movie",
        seats: Array.isArray(selectedSeats) ? selectedSeats : [],
        showtime: String(selectedShowtime || ""),
        date: String(selectedDate?.toDateString() || new Date().toDateString()),
        totalPaid: Number(totalCost || 0),
        paymentId: paymentId || "N/A",
        createdAt: serverTimestamp(),
        expiresAt:
          Number(selectedDate?.getTime() || Date.now()) + 6 * 60 * 60 * 1000, // 6 hrs after show
      });
      console.log("✅ Booking saved successfully!");
    } catch (error) {
      console.error("❌ Error saving booking:", error);
      toast.error(
        "Failed to save booking — check Firestore rules or permissions."
      );
      throw error; // <-- make sure this bubbles up to the handler
    }
  };

  // ✅ Handle Razorpay payment (clean version — no seatLocks)
  const handleConfirm = async () => {
    try {
      // ✅ Guard: Ensure context and user are valid
      if (!selectedMovie || !selectedSeats?.length) {
        toast.error("Please select a movie and seats first!");
        navigate("/");
        return;
      }

      toast.loading("Creating order...");

      const res = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalCost }),
      });

      const order = await res.json();
      toast.dismiss();

      if (!order.id) {
        toast.error("Failed to create order. Try again.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "AuroraCine",
        description: "Movie Ticket Booking",
        order_id: order.id,

        handler: async function (response) {
          toast.success("Payment Successful! 🎬");
          try {
            await saveBookingToFirestore(response.razorpay_payment_id);

            // ✅ Redirect to success page only after booking save success
            navigate("/success", {
              state: {
                movieTitle: selectedMovie.title,
                seats: selectedSeats,
                name,
                email,
                totalPaid: totalCost,
                paymentId: response.razorpay_payment_id,
              },
            });
          } catch (error) {
            console.error("❌ Booking save failed after payment:", error);
            toast.error("Payment succeeded, but booking save failed.");
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled or failed.");
          },
        },

        prefill: {
          name: name || currentUser.displayName || "Movie Fan",
          email: email || currentUser.email,
        },
        theme: { color: "#4f46e5" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.dismiss();
      toast.error("Something went wrong. Try again.");
    }
  };

  if (authLoading)
    return (
      <div className="text-xl text-center p-20 text-yellow-400">
        Loading user session...
      </div>
    );

  if (!currentUser)
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-red-900/40 rounded-xl shadow-2xl text-center border border-red-700">
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-gray-300 mb-6">
          You must sign in to complete your booking.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-yellow-400 text-indigo-900 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          Back to Home
        </button>
      </div>
    );

  if (!selectedMovie)
    return (
      <div className="text-center text-gray-400 py-20">
        No booking data found. Redirecting...
      </div>
    );

  const posterUrl = selectedMovie.poster_path
    ? `${BASE_IMAGE_URL}w300${selectedMovie.poster_path}`
    : `https://placehold.co/300x450/4f46e5/FFFFFF?text=No+Poster`;

  return (
    <div className="min-h-screen bg-gray-900 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-8 text-white text-center">
          Review & Confirm Booking
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          {/* Movie Poster */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-indigo-700">
              <img
                src={posterUrl}
                alt={selectedMovie.title}
                className="w-full h-auto object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white truncate">
                  {selectedMovie.title}
                </h3>

                {/* ⭐ Added Movie Rating */}
                <p className="text-yellow-400 mt-1 text-sm">
                  ⭐ {selectedMovie.vote_average?.toFixed(1) || "N/A"} / 10
                </p>

                <p className="text-gray-400 text-sm">
                  {selectedMovie.release_date
                    ? new Date(selectedMovie.release_date).getFullYear()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="md:col-span-2 space-y-8">
            {/* 🧑‍💼 Customer & Show Details */}
            <div className="bg-gray-800 p-6 rounded-xl border border-indigo-700 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                Customer & Show Details
              </h2>

              <div className="space-y-2 text-lg">
                <p>
                  <span className="font-semibold text-white">Name:</span>{" "}
                  <span className="text-gray-300">{name || "N/A"}</span>
                </p>
                <p>
                  <span className="font-semibold text-white">Email:</span>{" "}
                  <span className="text-gray-300">{email || "N/A"}</span>
                </p>
                <p>
                  <span className="font-semibold text-white">Date:</span>{" "}
                  <span className="text-gray-300">
                    {selectedDate ? selectedDate.toDateString() : "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-white">Showtime:</span>{" "}
                  <span className="text-gray-300">
                    {selectedShowtime || "N/A"}
                  </span>
                </p>
              </div>
            </div>

            {/* 🎟️ Order Summary */}
            <div className="bg-gray-800 p-6 rounded-xl border border-indigo-700 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                Order Summary
              </h2>
              <p className="text-lg text-gray-300">
                <span className="font-semibold text-white">
                  Seats ({selectedSeats?.length || 0}):
                </span>{" "}
                {selectedSeats?.map((s) => s.id).join(", ") || "---"}
              </p>
              <p className="text-lg font-bold text-yellow-400 mt-3">
                Total: ₹{totalCost.toFixed(2)}
              </p>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full p-4 rounded-lg font-bold text-lg bg-yellow-400 text-indigo-900 hover:bg-yellow-300 transition duration-300 shadow-2xl"
            >
              Proceed to Payment ₹{totalCost.toFixed(2)}
            </button>

            <button
              onClick={() => navigate(`/movie/${selectedMovie.id}`)}
              className="w-full p-3 rounded-lg font-semibold text-lg bg-gray-700 text-white hover:bg-gray-600 transition"
            >
              Go Back & Change Seats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
