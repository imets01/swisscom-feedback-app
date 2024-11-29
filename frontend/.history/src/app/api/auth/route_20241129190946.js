import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();

          if (res.ok && user.token) {
            return user; // Return user object if login succeeds
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error("Authorization error:", error);
          return null; // If login fails, return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Redirect to your custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add the user token to the JWT
      if (user) {
        token.id = user.id;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      // Include the token in the session object
      session.user = {
        id: token.id,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Set a secure secret
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
