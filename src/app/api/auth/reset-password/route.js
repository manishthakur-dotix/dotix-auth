import { NextResponse } from "next/server";
import db from "@/lib/db";
import md5 from "md5";
import { sendPasswordResetSuccessEmail } from "@/lib/emailServices";

// Define your custom PREFIX and SUFFIX
const PREFIX = process.env.PASS_PREFIX;
const SUFFIX = process.env.PASS_SUFFIX;

// Function to hash a password using md5 with PREFIX and SUFFIX
const hashPassword = (password) => {
  const concatenatedPassword = PREFIX + password + SUFFIX;
  return md5(concatenatedPassword);
};

export async function POST(req, res) {
  const { name, email, password } = await req.json();

  try {
    // Hash the password
    const hashedPassword = hashPassword(password);

    // Update the user's password and clear the token
    await db.query(
      "UPDATE t_users SET password = ?, token = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    await sendPasswordResetSuccessEmail(email, name);

    return NextResponse.json(
      { msg: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
}
