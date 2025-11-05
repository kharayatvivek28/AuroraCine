// src/hooks/useAuth.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase/config";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      if (user) console.log("✅ User signed in:", user.displayName);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // sometimes result.user is delayed, so handle that gracefully
      if (!result?.user) {
        console.log("Waiting for auth state update...");
        return new Promise((resolve) => {
          const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
              console.log("Google sign-in confirmed via auth state:", user);
              unsub();
              resolve({ user });
            }
          });
          // safety timeout
          setTimeout(() => {
            unsub();
            resolve(null);
          }, 4000);
        });
      }

      return result;
    } catch (err) {
      console.error("Google sign-in error:", err);

      // ignore benign popup or COOP-related warnings
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      ) {
        toast("Sign-in cancelled.", { icon: "⚠️" });
        return null;
      }

      // only show a real error for true failures
      toast.error("Google sign-in failed. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Sign-out error:", err);
      toast.error("Error logging out.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoading, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
