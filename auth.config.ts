import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe base config — no Prisma/bcrypt imports here. Consumed by both
 * middleware.ts (Edge runtime, JWT verification only) and the full auth.ts
 * (Node runtime, adds the DB-backed Credentials provider).
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  trustHost: true,
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};
