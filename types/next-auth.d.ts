import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { RoleData } from "./access";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
  }
}