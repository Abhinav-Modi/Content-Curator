// src/lib/auth.ts

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

// Define the config object
export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Mock user logic
        if (credentials.email === "test@test.com" && credentials.password === "password") {
          return { id: "1", name: "Test User", email: "test@test.com" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Our custom login page
  },
  callbacks: {
    // These callbacks add the user ID to the session object
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // This is the critical part we were missing!
  // NextAuth MUST have the secret here to function.
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig

// Initialize NextAuth.js with the config
// and export the handlers and auth function
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)