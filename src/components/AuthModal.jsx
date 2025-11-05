import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../firebase/config";
import googleIcon from "../assets/google-icon.svg";
import toast from "react-hot-toast";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { X, Mail, Lock, ArrowLeft } from "lucide-react";

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, signInWithGoogle, isLoading } = useAuth();

  const [mode, setMode] = useState("login"); // login | register | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || currentUser) return null;

  // Handle Email / Password flows
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back! 🎬");
        onClose();
      } else if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully! 🎉");
        onClose();
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent! 📧");
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        toast.success(`Welcome ${result.user.displayName || "back"}! 🌟`);
        onClose();
      } else {
        toast("Google sign-in cancelled or failed.", { icon: "⚠️" });
      }
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        toast("Google sign-in cancelled.", { icon: "⚠️" });
      } else {
        toast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Back Button (for Register/Forgot modes) */}
        {mode !== "login" && (
          <button
            onClick={() => setMode("login")}
            className="absolute top-3 left-3 text-gray-400 hover:text-white transition"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "login"
            ? "Sign In"
            : mode === "register"
            ? "Create Account"
            : "Forgot Password"}
        </h2>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2">
            <Mail size={18} className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent w-full outline-none text-white placeholder-gray-400"
            />
          </div>

          {mode !== "forgot" && (
            <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent w-full outline-none text-white placeholder-gray-400"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : mode === "register"
              ? "Register"
              : "Send Reset Email"}
          </button>
        </form>

        {/* Mode Switch Links */}
        <div className="text-center mt-4 text-sm text-gray-400 space-y-2">
          {mode === "login" && (
            <>
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-indigo-400 hover:underline"
                >
                  Register
                </button>
              </p>
              <button
                onClick={() => setMode("forgot")}
                className="text-indigo-400 hover:underline"
              >
                Forgot password?
              </button>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-gray-700" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-700" />
        </div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading || loading}
          className="w-full bg-white text-black py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition hover:bg-gray-200 disabled:opacity-60"
        >
          {loading ? (
            <span className="text-gray-600 animate-pulse">Connecting...</span>
          ) : (
            <>
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
