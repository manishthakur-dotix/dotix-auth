import md5 from "md5";
import crypto from "crypto";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { headers } from "next/headers";
import db from "@/lib/db";
import { getLocationFromIP } from "@/lib/getLocationFromIP";

// Define your custom PREFIX and SUFFIX
const PREFIX = process.env.PASS_PREFIX;
const SUFFIX = process.env.PASS_SUFFIX;

// Function to hash a password using md5 with PREFIX and SUFFIX
const hashPassword = (password) => {
  const concatenatedPassword = PREFIX + password + SUFFIX;
  return md5(concatenatedPassword);
};

// Helper function to generate an UUID
const generateUUID = () => {
  return crypto.createHash("md5").update(crypto.randomUUID()).digest("hex");
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
        const device = headersList.get("user-agent");

        const { country, city, region } = await getLocationFromIP(ip);
        const location = `${city}, ${region}, ${country}`;

        const hashedPassword = hashPassword(password);

        try {
          const [userData] = await db.query("CALL sp_SignIn(?, ?)", [
            email,
            hashedPassword,
          ]);

          const user = userData[0][0];

          // Generate a UUID for the session
          const sessionId = generateUUID();

          // Get the current time for last session and calculate expiry (24 hours later)
          const lastSession = new Date();
          const expiryDate = new Date(
            lastSession.getTime() + 24 * 60 * 60 * 1000
          ); // 24 hours later

          // Insert session data into the t_sessions table
          await db.query(
            `INSERT INTO t_sessions (session_id, user_id, ip, location, device, last_session, expiry_date)
  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sessionId, user?.id, ip, location, device, lastSession, expiryDate]
          );

          // Simulate an authorized user with additional information
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            sessionId: sessionId,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/v0/signin",
    error: "/v0/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day session
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const headersList = headers();
      const forwarded = headersList.get("x-forwarded-for");

      const ip = forwarded ? forwarded.split(/, /)[0] : headersList.get("host");
      const device = headersList.get("user-agent");

      const { country, city, region } = await getLocationFromIP(ip);
      const location = `${city}, ${region}, ${country}`;

      try {
        const userExist = async (email) => {
          // Find existing user by email
          let [existingUser] = await db.query(
            `SELECT * FROM t_users WHERE email = ?`,
            [email]
          );

          return existingUser[0]; // Returns the first user or undefined
        };

        let email, name, image, provider;
        let userId;

        // Determine user info based on the provider
        if (account.provider === "google") {
          email = profile.email;
          name = profile.name;
          image = profile.picture;
          provider = "google"; // Provider is google
        }

        if (account.provider === "github") {
          email = user?.email;
          name = user?.name;
          image = user?.image;
          provider = "github"; // Provider is github
        }

        // Check if the user exists
        const existingUser = await userExist(email);

        if (existingUser) {
          // User exists, check if they are blocked
          if (existingUser.isBlock === 1) {
            throw new Error("You are blocked. Please contact your admin.");
          }

          userId = existingUser?.id;
          name = existingUser?.name;
          email = existingUser?.email;
          image = existingUser?.image;
        } else {
          if (account?.provider == "google" || account?.provider == "github") {
            // User doesn't exist, create a new user
            const hashedPass = null;
            const token = null;

            // Call the stored procedure to create a new user
            const [result] = await db.query(
              `CALL sp_CreateAccount(?, ?, ?, ?, ?, ?, ?)`,
              [name, email, image, 1, hashedPass, provider, token]
            );
            userId = result[0][0].user_id;
          }
        }

        if (account?.provider == "google" || account?.provider == "github") {
          // Generate a UUID for the session
          const sessionId = generateUUID();

          // Get the current time for last session and calculate expiry (24 hours later)
          const lastSession = new Date();
          const expiryDate = new Date(
            lastSession.getTime() + 24 * 60 * 60 * 1000
          ); // 24 hours later

          // Insert session data into the t_sessions table
          await db.query(
            `INSERT INTO t_sessions (session_id, user_id, ip, location, device, last_session, expiry_date)
  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sessionId, userId, ip, location, device, lastSession, expiryDate]
          );

          user.sessionId = sessionId;
          user.id = userId;
          user.image = image;
          user.name = name;
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in callback:", error);
        throw new Error(error.message);
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
        token.sessionId = user.sessionId;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.sessionId = token.sessionId;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = (req, res) => NextAuth(req, res, authOptions);

export const GET = handler;
export const POST = handler;
