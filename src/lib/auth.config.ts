import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is where you'd add your logic to check if the user exists
        // and if the password is correct (e.g., check against a database).
        
        // For our test, we'll "mock" a user.
        if (credentials.email === "test@test.com" && credentials.password === "password") {
          // If auth is successful, return a user object
          return { id: "1", name: "Test User", email: "test@test.com" };
        }
        
        // If auth fails, return null
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Tell NextAuth.js our custom login page is at /login
  },
  callbacks: {
    // These callbacks are used to control what happens during auth
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add the user's ID to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; // Add the user's ID to the session
      }
      return session;
    },
  },
} satisfies NextAuthConfig;