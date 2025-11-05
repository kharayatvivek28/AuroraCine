import React, { createContext, useState, useEffect } from "react";

export const BookingContext = createContext();

export default function BookingProvider({ children }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const pricePerSeat = 1; // Base price for calculation

  // ✅ Load context data from sessionStorage on first render
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("bookingContext");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.selectedMovie) setSelectedMovie(data.selectedMovie);
        if (data.selectedShowtime) setSelectedShowtime(data.selectedShowtime);
        if (Array.isArray(data.selectedSeats))
          setSelectedSeats(data.selectedSeats);
        if (data.selectedDate) setSelectedDate(new Date(data.selectedDate));
      }
    } catch (error) {
      console.error("Error restoring booking context:", error);
    }
  }, []);

  // ✅ Save to sessionStorage whenever state changes
  useEffect(() => {
    try {
      const data = {
        selectedMovie,
        selectedShowtime,
        selectedSeats,
        selectedDate,
      };
      sessionStorage.setItem("bookingContext", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving booking context:", error);
    }
  }, [selectedMovie, selectedShowtime, selectedSeats, selectedDate]);

  // ✅ Context value
  const bookingValue = {
    selectedMovie,
    setSelectedMovie,
    selectedShowtime,
    setSelectedShowtime,
    selectedSeats,
    setSelectedSeats,
    selectedDate,
    setSelectedDate,
    pricePerSeat,
  };

  return (
    <BookingContext.Provider value={bookingValue}>
      {children}
    </BookingContext.Provider>
  );
}
