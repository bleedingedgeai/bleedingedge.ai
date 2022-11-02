// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_OAUTH2_CLIENT_ID,
      clientSecret: process.env.TWITTER_OAUTH2_CLIENT_SECRET,
      version: "2.0",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log({ token, user, account, profile });
      if (profile) {
        token["userProfile"] = {
          followersCount: profile.followers_count,
          twitterHandle: profile.screen_name,
          userID: profile.id,
        };
      }
      if (account) {
        token["credentials"] = {
          authToken: account.oauth_token,
          authSecret: account.oauth_token_secret,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.id = user?.id;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: "/error", // Error code passed in query string as ?error=
  },
};

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, authOptions);

export default authHandler;
