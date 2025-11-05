// src/config/env.js

export const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // ✅ local backend (npm start)
    : "https://auroracine-backend.onrender.com"; // ✅ your Render backend URL
