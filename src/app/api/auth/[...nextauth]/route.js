import md5 from "md5";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { headers } from "next/headers";
import db from "@/lib/db";

// Define your custom PREFIX and SUFFIX
const PREFIX = process.env.PASS_PREFIX;
const SUFFIX = process.env.PASS_SUFFIX;

// Function to hash a password using md5 with PREFIX and SUFFIX
const hashPassword = (password) => {
  const concatenatedPassword = PREFIX + password + SUFFIX;
  return md5(concatenatedPassword);
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const { email, password } = credentials;
        const headersList = headers();
        const forwarded = headersList.get("x-forwarded-for");
        const ip = forwarded
          ? forwarded.split(/, /)[0]
          : headersList.get("host");

        const hashedPassword = hashPassword(password);

        try {
          const [userData] = await db.query("CALL sp_SignIn(?, ?)", [
            email,
            hashedPassword,
          ]);

          const user = userData[0][0];

          await db.query(
            "UPDATE t_users SET status = ?, lastSession = now(), lastIp = ? WHERE email = ?",
            [1, ip, email]
          );

          // Simulate an authorized user with additional information
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day session
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const email = profile.email;
        const name = profile.name;
        const image = profile.picture;

        // Find existing user by email
        let [existingUser] = await db.query(
          `SELECT * FROM t_users WHERE email = ?`,
          [email]
        );

        // Check if the user is blocked
        if (existingUser.length > 0 && existingUser[0].isBlock == 1) {
          throw new Error("You are blocked. Please contact your admin.");
        }

        // Return the user for the jwt callback
        user.id = existingUser[0]?.id;
        user.image = existingUser[0]?.image;
        user.name = existingUser[0]?.name;
      }

      if (account.provider === "github") {
        const name = user?.name;
        const email = user?.email;
        const image = user?.image;
        console.log(name, email, image);

        // Find existing user by email
        let [existingUser] = await db.query(
          `SELECT * FROM t_users WHERE email = ?`,
          [email]
        );

        // Check if the user is blocked
        if (existingUser.length > 0 && existingUser[0].isBlock == 1) {
          throw new Error("You are blocked. Please contact your admin.");
        }

        console.log(existingUser);

        // Return the user for the jwt callback
        user.id = existingUser[0]?.id;
        user.image = existingUser[0]?.image;
        user.name = existingUser[0]?.name;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = (req, res) => NextAuth(req, res, authOptions);

export const GET = handler;
export const POST = handler;
