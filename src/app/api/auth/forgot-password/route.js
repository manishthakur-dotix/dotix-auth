import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";
import { sendForgotPasswordEmail } from "@/lib/emailServices";

export async function POST(req, res) {
  const { email } = await req.json();

  try {
    // Check if the user exists
    const [userResult] = await db.query(
      "SELECT id, name, last_password_request FROM t_users WHERE email = ?",
      [email]
    );

    if (userResult.length === 0) {
      return NextResponse.json(
        { msg: "User email not found" },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // Check if the user has requested a password reset in the last hour
    const currentTime = new Date();
    const lastRequestTime = new Date(user.last_password_request);
    const oneHourAgo = new Date(
      currentTime.setHours(currentTime.getHours() - 1)
    );

    if (lastRequestTime > oneHourAgo) {
      return NextResponse.json(
        { msg: "You can only request a password reset once every hour." },
        { status: 429 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    await db.query(
      "UPDATE t_users SET token = ?, last_password_request = now() WHERE email = ?",
      [token, email]
    );

    await sendForgotPasswordEmail(email, user.name, token);

    return NextResponse.json(
      { msg: "Password reset email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
}
