import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { PageTransition, FadeInUp, StaggerContainer, StaggerItem } from "../components/AnimationWrappers";
import { jsPDF } from "jspdf";

export default function MyBookings() {
  const { currentUser, isLoading } = useAuth();
  const [activeBookings, setActiveBookings] = useState([]);
  const [expiredBookings, setExpiredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const now = Date.now();

        const myBookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("📦 Real-time My Bookings:", myBookings);

        const active = myBookings.filter((b) => {
          const exp =
            typeof b.expiresAt === "number"
              ? b.expiresAt
              : b.expiresAt?.toMillis?.() || 0;
          return exp > now;
        });

        const expired = myBookings.filter((b) => {
          const exp =
            typeof b.expiresAt === "number"
              ? b.expiresAt
              : b.expiresAt?.toMillis?.() || 0;
          return exp <= now;
        });

        setActiveBookings(active);
        setExpiredBookings(expired);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Real-time listener error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  if (isLoading || loading)
    return (
      <div className="text-yellow-500 dark:text-yellow-400 text-center py-20 text-xl">
        Loading your bookings...
      </div>
    );

  if (!currentUser)
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-20 text-lg">
        Please sign in to view your bookings.
      </div>
    );

  if (activeBookings.length === 0 && expiredBookings.length === 0)
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-20 text-lg">
        You have no bookings yet.
      </div>
    );

  const handleDownloadPDF = (b) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const bookingId = `AC${b.id?.slice(-8) || Date.now().toString().slice(-8)}`;

    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, pageWidth, 297, "F");

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 45, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("AuroraCine", pageWidth / 2, 25, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Movie Ticket", pageWidth / 2, 37, { align: "center" });

    doc.setDrawColor(79, 70, 229);
    doc.setLineDashPattern([3, 3]);
    doc.line(20, 55, pageWidth - 20, 55);
    doc.setLineDashPattern([]);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(250, 204, 21);
    doc.text(b.movieTitle || "Movie", pageWidth / 2, 72, { align: "center" });

    const details = [
      ["Booking ID", bookingId],
      ["Date", b.date || "N/A"],
      ["Showtime", b.showtime || "N/A"],
      ["Seats", b.seats?.map((s) => `${s.id}`).join(", ") || "N/A"],
      ["Amount Paid", `Rs. ${(b.totalPaid || 0).toFixed(2)}`],
    ];

    doc.setFontSize(12);
    let y = 90;
    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(156, 163, 175);
      doc.text(label + ":", 30, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(String(value), pageWidth - 30, y, { align: "right" });
      y += 14;
    });

    doc.setLineDashPattern([3, 3]);
    doc.line(20, y + 5, pageWidth - 20, y + 5);
    doc.setLineDashPattern([]);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Show this ticket at the theatre entrance.", pageWidth / 2, y + 18, { align: "center" });

    doc.save(`AuroraCine_Ticket_${bookingId}.pdf`);
  };

  return (
    <PageTransition className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-10">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-yellow-500 dark:text-yellow-400 text-center mb-8">
          🎬 My Bookings
        </h1>

        {/* ✅ Active Bookings */}
        {activeBookings.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-green-500 dark:text-green-400 mb-4">
              Active Bookings
            </h2>
            <div className="space-y-6 mb-10">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-green-300 dark:border-green-700"
                >
                  <h2 className="text-xl font-bold text-yellow-500 dark:text-yellow-400 mb-2">
                    🎬 {b.movieTitle || "Untitled Movie"}
                  </h2>
                  <p>📅 {b.date}</p>
                  <p>🕒 Showtime: {b.showtime}</p>
                  <p>
                    🎟️ Seats:{" "}
                    {b.seats && b.seats.length > 0
                      ? b.seats.map((s) => `${s.id} (₹${s.price})`).join(", ")
                      : "N/A"}
                  </p>
                  <p className="text-green-500 dark:text-green-400 font-bold mt-2">
                    💰 Paid ₹{(b.totalPaid || 0).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDownloadPDF(b)}
                    className="mt-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-md"
                  >
                    📄 Download Ticket PDF
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ✅ Expired Bookings */}
        {expiredBookings.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-4">
              Past / Expired Bookings
            </h2>
            <div className="space-y-6">
              {expiredBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-300 dark:border-gray-600"
                >
                  <h2 className="text-xl font-bold text-yellow-500 dark:text-yellow-400 mb-2">
                    🎬 {b.movieTitle || "Untitled Movie"}
                  </h2>
                  <p>📅 {b.date}</p>
                  <p>🕒 Showtime: {b.showtime}</p>
                  <p>🎟️ Seats: {b.seats && b.seats.length > 0 ? b.seats.map((s) => `${s.id} (₹${s.price})`).join(", ") : "N/A"}</p>
                  <p className="text-gray-500 dark:text-gray-400 font-bold mt-2">
                    💰 Paid ₹{(b.totalPaid || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
