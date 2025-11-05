// src/components/ToasterProvider.jsx
import React from "react";
import { Toaster, toast } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        // 🌟 Base Toast Styles
        style: {
          background: "linear-gradient(135deg, #1e1b4b, #312e81)", // Indigo gradient
          color: "#fff",
          border: "1px solid rgba(79,70,229,0.5)", // Indigo glow
          borderRadius: "12px",
          padding: "14px 18px",
          boxShadow: "0 4px 20px rgba(79,70,229,0.35)", // soft indigo glow
          transition: "all 0.4s ease-in-out",
          fontFamily: "Inter, sans-serif",
        },

        // 🌈 Animations
        className:
          "transform-gpu transition-all duration-500 ease-out data-[state=visible]:translate-x-0 data-[state=visible]:opacity-100 data-[state=hidden]:translate-x-10 data-[state=hidden]:opacity-0",

        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
