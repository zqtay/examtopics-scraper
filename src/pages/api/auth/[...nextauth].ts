import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const adminUser = process.env.NEXTAUTH_ADMIN_USER;
const adminPassword = process.env.NEXTAUTH_ADMIN_PASSWORD;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (credentials?.username === adminUser && credentials?.password === adminPassword) {
          return { id: "admin", name: adminUser, role: "admin" };
        } else {
          return null;
        }
      },
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.user.role = token?.role;
      return session;
    },
    jwt: async ({ token, user, trigger }) => {
      if (trigger === "signIn") {
        // This will run when user signs in
        if (user) {
          token.role = user.role;
        }
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
  }
};

export default NextAuth(authOptions);