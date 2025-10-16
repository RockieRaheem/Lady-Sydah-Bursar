import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "./config";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
    throw new Error(getAuthErrorMessage(error.code));
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
 * Get user-friendly error messages
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password";
    case "auth/email-already-in-use":
      return "Email is already registered";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later";
    case "auth/network-request-failed":
      return "Network error. Please check your connection";
    default:
      return "Authentication failed. Please try again";
  }
}
