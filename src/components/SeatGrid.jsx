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
      rows: Array.from(rows).sort(),
    }))
    .sort((a, b) => a.price - b.price);

  const getSeatsForRow = (row) => seats.filter((s) => s.row === row);

  const sectionLabels = {
    1: { name: "CLASSIC", color: "text-emerald-400" },
    2: { name: "PREMIUM", color: "text-yellow-400" },
  };

  return (
    <div className="flex flex-col items-center text-gray-900 dark:text-white">
      {/* 🎬 Curved Screen */}
      <div className="w-full flex flex-col items-center mb-6">
        <div
          className="w-4/5 h-2 rounded-b-[50%] shadow-lg shadow-indigo-400/40"
          style={{
            background:
              "linear-gradient(90deg, #818cf8, #60a5fa, #818cf8)",
          }}
        />
        <div
          className="w-3/5 h-1 mt-0.5 rounded-b-[50%] opacity-50"
          style={{
            background:
              "linear-gradient(90deg, transparent, #818cf8, transparent)",
          }}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest font-semibold">
          Screen
        </p>
      </div>

      {sections.map((section, sectionIdx) => {
        const label = sectionLabels[section.price] || {
          name: `₹${section.price}`,
          color: "text-gray-400",
        };

        return (
          <React.Fragment key={section.price}>
            {/* Section Divider (between sections) */}
            {sectionIdx > 0 && (
              <div className="w-full max-w-4xl flex items-center my-4">
                <div className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" />
                <span className="px-3 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Premium Section
                </span>
                <div className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" />
              </div>
            )}

            <div className="w-full max-w-4xl mb-6">
              {/* Section Label */}
              <div className="flex justify-center mb-3">
                <span
                  className={`${label.color} font-bold tracking-wider text-sm flex items-center space-x-2`}
                >
                  <span>{label.name}</span>
                  <span className="text-xs font-normal opacity-75">
                    — ₹{section.price}/seat
                  </span>
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
                    <div className="w-6 text-gray-500 dark:text-gray-400 font-semibold text-center text-sm">
                      {row}
                    </div>

                    {/* Seat Buttons */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {rowSeats.map((seat) => {
                        let seatStyle = "";
                        switch (seat.status) {
                          case "locked":
                            seatStyle =
                              "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-300 cursor-not-allowed opacity-70";
                            break;
                          case "selected":
                            seatStyle =
                              "bg-yellow-400 text-indigo-900 scale-110 ring-2 ring-yellow-300";
                            break;
                          default:
                            seatStyle =
                              section.price >= 2
                                ? "bg-indigo-500 hover:bg-indigo-400 text-white hover:scale-105"
                                : "bg-green-500 hover:bg-green-400 text-white hover:scale-105";
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
                    <div className="w-6 text-gray-500 dark:text-gray-400 font-semibold text-center text-sm">
                      {row}
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        );
      })}

      {/* 🎨 Legend */}
      <div className="flex flex-wrap justify-center mt-6 gap-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded" /> Classic
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-500 rounded" /> Premium
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-yellow-400 rounded" /> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-400 dark:bg-gray-600 rounded opacity-70" />{" "}
          Booked
        </div>
      </div>
    </div>
  );
}
