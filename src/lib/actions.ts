"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * DEPRECATED: This file is being replaced with Firebase Authentication
 * Keep for backward compatibility during migration
 *
 * TODO: Remove this file once Firebase Authentication is fully integrated
 */

export async function handleLogin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // SECURITY WARNING: This is a temporary fallback solution
  // Firebase Authentication should be used instead
  // See: src/lib/firebase/auth.ts

  // This will be replaced with Firebase authentication
  // For now, it returns an error to force Firebase setup
  redirect("/login?error=Please configure Firebase Authentication");
}

export async function handleLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}
