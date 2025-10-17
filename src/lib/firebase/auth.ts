import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./config";
import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./config";

export type UserRole = "ADMIN" | "BURSAR" | "TEACHER" | "VIEW_ONLY";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User; profile: UserProfile }> {
  try {
    // Check if Firebase Auth is initialized
    if (!auth) {
      throw new Error(
        "Firebase Authentication is not initialized. Please check your configuration."
      );
    }

    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update last login
    await setDoc(
      doc(db, "users", userCredential.user.uid),
      {
        lastLogin: new Date().toISOString(),
      },
      { merge: true }
    );

    // Get user profile
    const profile = await getUserProfile(userCredential.user.uid);

    return { user: userCredential.user, profile };
  } catch (error: any) {
    console.error("Firebase Auth Error:", error);

    // If it's a Firebase error, use the error code
    if (error.code) {
      throw new Error(getAuthErrorMessage(error.code));
    }

    // Otherwise, throw the original error message
    throw new Error(
      error.message || "Authentication failed. Please try again."
    );
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error("Failed to sign out");
  }
}

/**
 * Create new user account
 */
export async function createUser(
  email: string,
  password: string,
  displayName: string,
  role: UserRole = "VIEW_ONLY"
): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update display name
    await updateProfile(userCredential.user, { displayName });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: userCredential.user.uid,
      email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userProfile);

    return userCredential.user;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile> {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      throw new Error("User profile not found");
    }
  } catch (error) {
    throw new Error("Failed to fetch user profile");
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  uid: string,
  role: UserRole
): Promise<void> {
  try {
    await setDoc(doc(db, "users", uid), { role }, { merge: true });
  } catch (error) {
    throw new Error("Failed to update user role");
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Check if user has required role
 */
export function hasRole(
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<{
  user: User;
  profile: UserProfile;
  isNewUser: boolean;
}> {
  try {
    if (!auth) {
      throw new Error("Firebase Authentication is not initialized.");
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Check if user profile exists
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    const isNewUser = !userDoc.exists();

    if (isNewUser) {
      // Create new user profile with default role
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || "User",
        role: "VIEW_ONLY",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", result.user.uid), userProfile);
      return { user: result.user, profile: userProfile, isNewUser: true };
    } else {
      // Update last login
      await setDoc(
        doc(db, "users", result.user.uid),
        { lastLogin: new Date().toISOString() },
        { merge: true }
      );
      const profile = await getUserProfile(result.user.uid);
      return { user: result.user, profile, isNewUser: false };
    }
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in cancelled. Please try again.");
    }
    if (error.code === "auth/popup-blocked") {
      throw new Error("Pop-up blocked. Please enable pop-ups and try again.");
    }
    throw new Error(error.message || "Failed to sign in with Google");
  }
}

/**
 * Register new user with email and password
 */
export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  confirmPassword: string
): Promise<{ user: User; profile: UserProfile }> {
  try {
    // Validation
    if (!email || !password || !displayName || !confirmPassword) {
      throw new Error("All fields are required");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new Error(
        "Password must contain uppercase, lowercase, and numbers"
      );
    }

    if (displayName.length < 2) {
      throw new Error("Display name must be at least 2 characters");
    }

    // Check if display name is already taken
    const displayNameQuery = query(
      collection(db, "users"),
      where("displayName", "==", displayName)
    );
    const displayNameSnapshot = await getDocs(displayNameQuery);

    if (!displayNameSnapshot.empty) {
      throw new Error("Display name is already taken");
    }

    // Create user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update display name
    await updateProfile(userCredential.user, { displayName });

    // Create user profile
    const userProfile: UserProfile = {
      uid: userCredential.user.uid,
      email,
      displayName,
      role: "VIEW_ONLY", // Default role
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userProfile);

    // Send verification email
    await sendEmailVerification(userCredential.user);

    return { user: userCredential.user, profile: userProfile };
  } catch (error: any) {
    console.error("Registration Error:", error);

    if (error.code) {
      throw new Error(getAuthErrorMessage(error.code));
    }

    throw new Error(error.message || "Registration failed. Please try again.");
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Password Reset Error:", error);

    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email address");
    }

    throw new Error(error.message || "Failed to send password reset email");
  }
}

/**
 * Get user-friendly error messages
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address";
    case "auth/wrong-password":
      return "Incorrect password. Please try again";
    case "auth/email-already-in-use":
      return "This email is already registered. Please sign in instead";
    case "auth/weak-password":
      return "Password is too weak. Use at least 8 characters with uppercase, lowercase, and numbers";
    case "auth/invalid-email":
      return "Invalid email address format";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled. Please contact support";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support";
    default:
      return "Authentication failed. Please try again";
  }
}

// Alias for backward compatibility
export const loginUser = signInWithEmail;
