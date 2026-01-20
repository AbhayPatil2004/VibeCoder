export const runtime = "nodejs";

import NextAuth from "next-auth";
import authConfig from "./auth.config.js";

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Account from "@/models/Account";

import {
  getAccountByUserId,
  getUserByAuthId
} from "@/modules/auth/actions";

/**
 * NextAuth with Mongoose (NO PrismaAdapter)
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    /**
     * Runs on OAuth sign-in (Google, GitHub, etc.)
     */
    async signIn({ user, account }) {
      try {
        if (!account) return false;

        await connectToDatabase();

        // 🔑 GitHub may not return email
        const email =
          user.email ??
          `${user.id}@${account.provider}.oauth`;

        // 1️⃣ Find or create user
        let existingUser = await User.findOne({ email });

        if (!existingUser) {
          existingUser = await User.create({
            email,
            name: user.name || null,
            image: user.image || null,
          });
        }

        // 2️⃣ Find or create account
        const existingAccount = await Account.findOne({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        });

        if (!existingAccount) {
          await Account.create({
            userId: existingUser._id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refreshToken: account.refresh_token ?? null,
            accessToken: account.access_token ?? null,
            expiresAt: account.expires_at ?? null,
            tokenType: account.token_type ?? null,
            scope: account.scope ?? null,
            idToken: account.id_token ?? null,
            sessionState: account.session_state ?? null,
          });
        }

        return true; // ✅ IMPORTANT
      } catch (error) {
        console.error("SIGN IN ERROR:", error);
        return false;
      }
    }
    ,

    /**
     * JWT callback
     */
    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await getUserByAuthId(token.sub);

      if (dbUser) {
        token.role = dbUser.role;
      }

      return token;
    },

    /**
     * Session callback
     */
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },

  ...authConfig,
});
