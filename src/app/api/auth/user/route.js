import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    NextResponse.json(
      {
        msg: "Token is required",
      },
      { status: 400 }
    );
  }

  try {
    // Find user by token
    const [userResult] = await db.query(
      "SELECT email, name FROM t_users WHERE token = ?",
      [token]
    );

    if (userResult.length === 0) {
      return NextResponse.json({ msg: "Invalid token" }, { status: 400 });
    }

    const user = userResult[0];
    return NextResponse.json(
      { name: user?.name, email: user?.email },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
}
