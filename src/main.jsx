import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import "./index.css";
import BookingProvider from "./context/BookingContext";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ToasterProvider from "./components/ToasterProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BookingProvider>
        <Router>
          <App />
          <ToasterProvider />
        </Router>
      </BookingProvider>
    </AuthProvider>
  </React.StrictMode>
);
