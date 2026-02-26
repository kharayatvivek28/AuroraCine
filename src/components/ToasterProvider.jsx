// src/components/ToasterProvider.jsx
import React from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

export default function ToasterProvider() {
  const { isDark } = useTheme();

  const toastStyle = isDark
    ? {
        background: "linear-gradient(135deg, #1e1b4b, #312e81)",
        color: "#fff",
        border: "1px solid rgba(79,70,229,0.5)",
        boxShadow: "0 4px 20px rgba(79,70,229,0.35)",
      }
    : {
        background: "linear-gradient(135deg, #ffffff, #f0f0ff)",
        color: "#1e1b4b",
        border: "1px solid rgba(79,70,229,0.25)",
        boxShadow: "0 4px 20px rgba(79,70,229,0.15)",
      };

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          ...toastStyle,
          borderRadius: "12px",
          padding: "14px 18px",
          transition: "all 0.4s ease-in-out",
          fontFamily: "Inter, sans-serif",
        },

        className:
          "transform-gpu transition-all duration-500 ease-out data-[state=visible]:translate-x-0 data-[state=visible]:opacity-100 data-[state=hidden]:translate-x-10 data-[state=hidden]:opacity-0",

        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: isDark ? "#fff" : "#1e1b4b",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: isDark ? "#fff" : "#1e1b4b",
          },
        },
      }}
    />
  );
}
