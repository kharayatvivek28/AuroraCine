import React from "react";

export default function SeatGrid({ seats, onSeatClick }) {
  const groupedByPrice = seats.reduce((acc, seat) => {
    if (!acc[seat.price]) acc[seat.price] = new Set();
    acc[seat.price].add(seat.row);
    return acc;
  }, {});

  const sections = Object.entries(groupedByPrice)
    .map(([price, rows]) => ({
      price,
      rows: Array.from(rows).sort(), // A → H order
    }))
    .sort((a, b) => a.price - b.price); // ₹1 section near screen

  const getSeatsForRow = (row) => seats.filter((s) => s.row === row);

  return (
    <div className="flex flex-col items-center text-white">
      {/* 🎬 Screen */}
      <div className="w-full flex justify-center mb-4">
        <div className="bg-gradient-to-r from-indigo-400 to-blue-400 h-3 w-3/4 rounded-full shadow-lg" />
      </div>
      <p className="text-gray-400 mb-8 italic">All eyes this way please 👇</p>

      {sections.map((section) => (
        <div key={section.price} className="w-full max-w-4xl mb-10">
          <div className="flex justify-center mb-3">
            <span className="text-yellow-400 font-semibold tracking-wide">
              ₹{section.price} CLASSIC
            </span>
          </div>

          {section.rows.map((row) => {
            const rowSeats = getSeatsForRow(row);
            return (
              <div
                key={row}
                className="flex items-center justify-center mb-2 space-x-2"
              >
                {/* Row Label Left */}
                <div className="w-6 text-gray-400 font-semibold text-center">
                  {row}
                </div>

                {/* Seat Buttons */}
                <div className="flex flex-wrap justify-center gap-2">
                  {rowSeats.map((seat) => {
                    let seatStyle = "";
                    switch (seat.status) {
                      case "locked": // Now used for permanently booked seats
                        seatStyle =
                          "bg-gray-600 text-gray-300 cursor-not-allowed opacity-70";
                        break;
                      case "selected":
                        seatStyle =
                          "bg-yellow-400 text-indigo-900 scale-110 ring-2 ring-yellow-300";
                        break;
                      default:
                        seatStyle =
                          "bg-green-500 hover:bg-green-400 text-white hover:scale-105";
                    }

                    return (
                      <button
                        key={seat.id}
                        onClick={() => onSeatClick(seat.id)}
                        disabled={seat.status === "locked"}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md font-semibold shadow-md transition-transform duration-200 ${seatStyle}`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>

                {/* Row Label Right */}
                <div className="w-6 text-gray-400 font-semibold text-center">
                  {row}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* 🎨 Legend */}
      <div className="flex flex-wrap justify-center mt-6 gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded" /> Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-yellow-400 rounded" /> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-600 rounded opacity-70" /> Booked
        </div>
      </div>
    </div>
  );
}
