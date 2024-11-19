import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  // Check if token exists in the URL
  if (!domain) {
    return NextResponse.json(
      {
        msg: "Domain is required",
      },
      { status: 400 }
    );
  }

  try {
    // Find the user by token
    const [result] = await db.query(
      "SELECT * FROM t_domains WHERE domain = ?",
      [domain]
    );

    if (result.length === 0) {
      return NextResponse.json({ msg: "Invalid domain" }, { status: 400 });
    }

    const domainInfo = result[0];

    return NextResponse.json(
      {
        domain: domainInfo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
}
