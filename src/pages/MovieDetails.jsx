import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SeatGrid from "../components/SeatGrid";
import { fetchMovieDetails, BASE_IMAGE_URL } from "../api/api";
import { BookingContext } from "../context/BookingContext";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

let toastCooldown = false;

const SHOWTIME_SLOTS = [
  { type: "Morning Shows", times: ["9:00 AM", "10:30 AM", "11:30 AM"] },
  { type: "Matinee Shows", times: ["12:30 PM", "2:00 PM", "3:30 PM"] },
  { type: "Evening Shows", times: ["5:00 PM", "6:30 PM", "8:00 PM"] },
  { type: "Night Shows", times: ["9:30 PM", "10:30 PM"] },
];

// ✅ Generate seat layout (A1–H8) with test pricing
const createInitialSeats = () => {
  const rows = "ABCDEFGH".split("");
  const seats = [];

  // A–C ₹1, D–H ₹2
  const rowPrices = {
    A: 1,
    B: 1,
    C: 1,
    D: 2,
    E: 2,
    F: 2,
    G: 2,
    H: 2,
  };

  for (const row of rows) {
    for (let i = 1; i <= 8; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        price: rowPrices[row],
        status: "available",
      });
    }
  }
  return seats;
};

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const {
    setSelectedMovie,
    setSelectedSeats,
    setSelectedShowtime,
    setSelectedDate,
  } = useContext(BookingContext);

  const [movie, setMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [localDate, setLocalDate] = useState(new Date());
  const [seats, setSeats] = useState(createInitialSeats());
  const [chosenSeats, setChosenSeats] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  // 💰 Dynamic total based on selected seat prices
  const totalPrice = chosenSeats.reduce((sum, seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    return seat ? sum + seat.price : sum;
  }, 0);

  const LOCK_DURATION_MS = 2 * 60 * 1000; // 2 minutes

  // ✅ Fetch movie details
  useEffect(() => {
    const loadMovie = async () => {
      const data = await fetchMovieDetails(id);
      setMovie(data);
      setSelectedMovie(data);
    };
    loadMovie();
  }, [id, setSelectedMovie]);

  // 🎥 Fetch trailer video info from TMDB (using Bearer Token v4)
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
          console.warn("No videos found for this movie.");
          setTrailerKey(null);
          return;
        }

        // ✅ Best match order: Official Trailer > Any Trailer > Any YouTube Video
        const trailer =
          data.results.find(
            (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
          ) ||
          data.results.find(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          ) ||
          data.results.find(
            (v) => v.site === "YouTube" && v.type === "Teaser"
          ) ||
          data.results.find((v) => v.site === "YouTube");

        setTrailerKey(trailer ? trailer.key : null);
      } catch (error) {
        console.error("Error fetching trailer:", error);
        setTrailerKey(null);
      }
    };

    fetchTrailer();
  }, [id]);

  // ✅ Real-time Firestore booked seats listener (no double selection)
  useEffect(() => {
    if (!movie || !selectedTime) return;

    const bookedQuery = query(
      collection(db, "bookedSeats"),
      where("movieId", "==", movie.id),
      where("showtime", "==", selectedTime),
      where("date", "==", localDate.toDateString())
    );

    const unsub = onSnapshot(bookedQuery, (snapshot) => {
      const bookedSeats = snapshot.docs.map((doc) => doc.data());
      setSeats((prev) =>
        prev.map((seat) => {
          // Seat is booked → always locked
          if (bookedSeats.some((b) => b.seatId === seat.id)) {
            return { ...seat, status: "locked" };
          }

          // Keep user's current local selections as-is
          if (seat.status === "selected") return seat;

          // Everything else → available
          return { ...seat, status: "available" };
        })
      );
    });

    return () => unsub();
  }, [movie, selectedTime, localDate]); // ❌ removed chosenSeats here

  // ✅ Auto-clean expired booked seats (client-side cleanup)
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      try {
        const q = query(collection(db, "bookedSeats"));
        const snapshot = await getDocs(q);

        snapshot.forEach(async (docSnap) => {
          const data = docSnap.data();

          // Remove expired bookings (past showtime)
          if (data.expiresAt && data.expiresAt < now) {
            await deleteDoc(doc(db, "bookedSeats", docSnap.id));
            console.log(`🧹 Cleaned expired seat: ${data.seatId}`);
          }
        });
      } catch (error) {
        console.error("Error cleaning expired booked seats:", error);
      }
    }, 10 * 60 * 1000); // runs every 10 minutes

    return () => clearInterval(interval);
  }, []);

  // ✅ Seat click logic (production-ready, single toast, no duplicates)
  const handleSeatClick = (seatId) => {
    if (toastCooldown) return; // skip if still cooling down
    toastCooldown = true;
    setTimeout(() => (toastCooldown = false), 250); // reset after ¼ sec

    setChosenSeats((prev) => {
      const isSelected = prev.includes(seatId);
      toast.dismiss();
      if (isSelected) {
        toast("Seat unselected ↩️");
        return prev.filter((id) => id !== seatId);
      } else {
        toast.success(`Seat ${seatId} selected 🎟️`);
        return [...prev, seatId];
      }
    });

    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              status: seat.status === "selected" ? "available" : "selected",
            }
          : seat
      )
    );
  };

  // ✅ Proceed to payment
  const handleProceed = () => {
    if (!currentUser) {
      toast.error("Please sign in to book tickets 🎟️");
      return;
    }
    if (!selectedTime || chosenSeats.length === 0) {
      toast.error("Select showtime and seats.");
      return;
    }
    if (!userName || !userEmail) {
      toast.error("Enter your name and email.");
      return;
    }

    // Prepare seat objects with prices
    const chosenSeatDetails = seats
      .filter((s) => chosenSeats.includes(s.id))
      .map((s) => ({ id: s.id, price: s.price }));

    setSelectedSeats(chosenSeatDetails);
    setSelectedShowtime(selectedTime);
    setSelectedDate(localDate);

    navigate("/booking", { state: { name: userName, email: userEmail } });
  };

  if (!movie)
    return (
      <div className="text-yellow-400 text-center py-20 text-xl">
        Loading movie details...
      </div>
    );

  const poster = movie.poster_path
    ? `${BASE_IMAGE_URL}w500${movie.poster_path}`
    : "https://placehold.co/500x750?text=No+Poster";

  const director =
    movie.credits?.crew?.find((c) => c.job === "Director")?.name || "N/A";
  const cast =
    movie.credits?.cast
      ?.slice(0, 4)
      .map((a) => a.name)
      .join(", ") || "N/A";

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      <div className="max-w-6xl mx-auto p-6">
        {/* 🎥 Movie Header */}
        <div className="flex flex-col md:flex-row gap-8 bg-gray-800 p-6 rounded-xl shadow-2xl mb-10">
          <img
            src={poster}
            alt={movie.title}
            className="w-56 rounded-lg shadow-lg"
          />
          <div className="flex-grow">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="text-yellow-400 mt-2 text-lg">
              ⭐ {movie.vote_average?.toFixed(1)} / 10
            </p>
            <p className="mt-2 text-gray-400">🎬 Directed by {director}</p>
            <p className="text-gray-400 mb-4">🎭 Cast: {cast}</p>
            <p className="text-gray-300 leading-relaxed text-sm">
              {movie.overview || "No description available."}
            </p>
            {/* 🎥 Trailer Button */}
            <div className="mt-4">
              <button
                onClick={() => setShowTrailer(true)}
                className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-semibold px-5 py-2 rounded-lg shadow-md transition"
              >
                ▶ Watch Trailer
              </button>
            </div>
          </div>
        </div>

        {/* 🎞️ Date + Showtime */}
        <div className="bg-gray-800 rounded-xl p-6 mb-10 shadow-xl">
          <h2 className="text-2xl font-semibold mb-5 text-yellow-400 text-center">
            Select Date & Showtime
          </h2>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
            <DatePicker
              selected={localDate}
              onChange={(d) => setLocalDate(d)}
              className="bg-gray-900 text-white p-3 rounded-lg border border-gray-700 cursor-pointer w-48 sm:w-56 text-center"
              minDate={new Date()}
              dateFormat="dd MMM yyyy"
            />
            <div className="flex flex-wrap gap-3 justify-center">
              {SHOWTIME_SLOTS.flatMap((slot) =>
                slot.times.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedTime === time
                        ? "bg-yellow-400 text-indigo-900 ring-2 ring-yellow-300"
                        : "bg-indigo-700 hover:bg-indigo-600"
                    }`}
                  >
                    {time}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 🪑 Seats + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 p-8 rounded-xl shadow-xl border border-indigo-700">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-5 text-center">
              Select Your Seats
            </h2>
            <SeatGrid seats={seats} onSeatClick={handleSeatClick} />
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-indigo-700 shadow-xl">
            <h3 className="text-2xl font-semibold text-yellow-400 mb-4">
              Your Booking
            </h3>
            <p>Showtime: {selectedTime || "---"}</p>
            <p>Date: {localDate.toDateString()}</p>
            <p>Seats: {chosenSeats.join(", ") || "---"}</p>
            <p className="mt-3 font-bold text-lg text-white">
              Total: ₹{totalPrice.toFixed(2)}
            </p>

            <div className="mt-5 space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
              />
            </div>

            <button
              onClick={handleProceed}
              className="mt-6 w-full bg-yellow-400 text-indigo-900 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition"
            >
              Proceed to Payment
            </button>
            <div className="mt-6 text-sm text-gray-300 bg-gray-900/40 border border-gray-700 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold text-center mb-3">
                Before You Proceed 🎬
              </h4>

              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>
                  ⏰ Seats are locked for{" "}
                  <span className="text-yellow-400 font-semibold">
                    2 minutes
                  </span>
                  . Complete payment to confirm your booking!
                </li>
                <li>
                  🎟️ Your tickets will be confirmed instantly after successful
                  payment.
                </li>
                <li>
                  🔒 Secure payment powered by{" "}
                  <span className="text-yellow-400 font-semibold">
                    Razorpay
                  </span>
                  .
                </li>
                <li>
                  💡 Sign in to view or download your tickets later from{" "}
                  <span className="text-yellow-400 font-semibold">
                    My Bookings
                  </span>
                  .
                </li>
                <li>
                  📧 A confirmation email will be sent once your booking is
                  successful.
                </li>
                <li>
                  🎫 Show your booking QR at the theatre entrance for entry.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* 🎬 Trailer Popup */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl relative">
            {/* Close button */}
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              aria-label="Close Trailer"
            >
              ✕
            </button>

            {/* YouTube Video */}
            <iframe
              width="100%"
              height="450"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-b-xl"
            ></iframe>
          </div>
        </div>
      )}

      {/* 🎬 Fallback: if no trailer available */}
      {showTrailer && !trailerKey && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 text-center rounded-xl shadow-2xl p-8 max-w-md">
            <h3 className="text-xl text-yellow-400 font-semibold mb-4">
              No Trailer Available 😞
            </h3>
            <button
              onClick={() => setShowTrailer(false)}
              className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-semibold px-6 py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
