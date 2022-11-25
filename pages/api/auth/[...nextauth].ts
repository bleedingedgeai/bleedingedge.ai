// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import TwitterProvider, { TwitterProfile } from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_OAUTH2_CLIENT_ID,
      clientSecret: process.env.TWITTER_OAUTH2_CLIENT_SECRET,
      version: "2.0",
      profile(profile: TwitterProfile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          username: profile.data.username,
          image: profile.data.profile_image_url,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user, ...rest }) {
      session.user.id = user?.id;
      session.user.username = user?.username;
      delete session.user.email;
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
