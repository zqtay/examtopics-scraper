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
    session: async ({ session, user, token }) => {
      console.log(session, user,token)
      session.user.role = user?.role;
      return session;
    }
  }
};

export default NextAuth(authOptions);