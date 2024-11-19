import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  // Check if token exists in the URL
  if (!token) {
    return NextResponse.json(
      {
        msg: "Token is required",
      },
      { status: 400 }
    );
  }

  try {
    // Find the user by token
    const [userResult] = await db.query(
      "SELECT * FROM t_users WHERE token = ?",
      [token]
    );

    if (userResult.length === 0) {
      return NextResponse.json(
        { msg: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const user = userResult[0];

    // Update the 'is_verified' field to true for the user in t_clients
    await db.query(
      "UPDATE t_users SET isVerified = 1, token = ? WHERE id = ?",
      [null, user?.id]
    );

    return NextResponse.json(
      {
        msg: "User verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
}
