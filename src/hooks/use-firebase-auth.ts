"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getUserProfile, UserProfile } from "@/lib/firebase/auth";

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setUser(user);
        setLoading(true);
        setError(null);

        if (user) {
          try {
            const userProfile = await getUserProfile(user.uid);
            setProfile(userProfile);
          } catch (err) {
            setError("Failed to load user profile");
            console.error("Error loading profile:", err);
          }
        } else {
          setProfile(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setError("Authentication error occurred");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
  };
}
