'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function handleLogin(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // In a real app, you'd validate these against a database.
  if (email === 'bursar@ladysydah.com' && password === 'password123') {
    cookies().set('auth_token', 'user-is-logged-in', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect('/dashboard');
  } else {
    // Redirect back to login with an error message
    redirect('/login?error=Invalid credentials');
  }
}

export async function handleLogout() {
  cookies().delete('auth_token');
  redirect('/login');
}
