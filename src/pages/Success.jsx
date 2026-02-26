import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition, ScaleIn, FadeInUp } from "../components/AnimationWrappers";
import { jsPDF } from "jspdf";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    name,
    email,
    seats,
    totalPaid,
    movieTitle,
  } = location.state || {};

  const bookingId = `AC${Date.now().toString().slice(-8)}`;

  if (!movieTitle || !totalPaid) {
    return (
      <div className="text-xl text-center p-20 text-red-500">
        Booking data lost. Please return to the{" "}
        <a href="/" className="text-indigo-500 dark:text-indigo-400 hover:underline">
          Home Page
        </a>
        .
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Background
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, pageWidth, 297, "F");

    // Header bar
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 45, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("AuroraCine", pageWidth / 2, 25, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Movie Ticket", pageWidth / 2, 37, { align: "center" });

    // Dashed line
    doc.setDrawColor(79, 70, 229);
    doc.setLineDashPattern([3, 3]);
    doc.line(20, 55, pageWidth - 20, 55);
    doc.setLineDashPattern([]);

    // Movie title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(250, 204, 21);
    doc.text(movieTitle, pageWidth / 2, 72, { align: "center" });

    // Booking details
    const details = [
      ["Booking ID", bookingId],
      ["Customer", name || "N/A"],
      ["Email", email || "N/A"],
      ["Seats", seats ? seats.map((s) => s.id || s).join(", ") : "N/A"],
      ["Amount Paid", `Rs. ${totalPaid.toFixed(2)}`],
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

    // Footer
    doc.setLineDashPattern([3, 3]);
    doc.setDrawColor(79, 70, 229);
    doc.line(20, y + 5, pageWidth - 20, y + 5);
    doc.setLineDashPattern([]);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Show this ticket at the theatre entrance.", pageWidth / 2, y + 18, { align: "center" });
    doc.text("Enjoy the movie! :)", pageWidth / 2, y + 28, { align: "center" });

    doc.save(`AuroraCine_Ticket_${bookingId}.pdf`);
  };

  return (
    <PageTransition className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-8 rounded-2xl border border-green-300/50 dark:border-green-500/50 shadow-2xl text-center space-y-8">
        {/* Success Icon — scale up celebration */}
        <ScaleIn>
          <div className="flex justify-center">
            <motion.div
              className="bg-green-600 p-4 rounded-full shadow-lg"
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
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
            </motion.div>
          </div>
        </ScaleIn>

        {/* Confirmation Message */}
        <FadeInUp delay={0.2}>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your seats for <span className="text-yellow-500 dark:text-yellow-400">{movieTitle}</span>{" "}
            have been successfully reserved.
          </p>
        </FadeInUp>

        {/* Summary Details */}
        <FadeInUp delay={0.4}>
          <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl space-y-4 text-left border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Confirmation ID:</span>
              <span className="text-gray-900 dark:text-white font-mono font-bold text-lg">
                {bookingId}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Customer:</span>
                <span className="text-gray-900 dark:text-white font-semibold">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Seats:</span>
                <span className="text-gray-900 dark:text-white">
                  {seats ? seats.map(s => s.id || s).join(", ") : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="text-gray-900 dark:text-white break-all">{email}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-300 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white text-xl">Total Amount Paid:</span>
                <motion.span
                  className="text-green-500 text-3xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                >
                  ₹{totalPaid.toFixed(2)}
                </motion.span>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Action Button */}
        <FadeInUp delay={0.6}>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            A detailed e-ticket will be sent to your email address shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadPDF}
              className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-500 transition-all shadow-xl"
            >
              📄 Download Ticket PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="flex-1 bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl"
            >
              Return to Home Page
            </motion.button>
          </div>
        </FadeInUp>
      </div>
    </PageTransition>
  );
}
