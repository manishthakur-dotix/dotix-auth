import { headers } from "next/headers";
import { NextResponse } from "next/server";
import db from "@/lib/db"; // Assuming you have a database helper file to query the DB

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  const headersList = await headers();
  const apiKey = headersList.get("x-api-key");

  if (!sessionId) {
    return NextResponse.json(
      { message: "Session Id is required" },
      { status: 400 }
    );
  }

  try {
    if (!apiKey) {
      return NextResponse.json(
        { message: "API Key is required" },
        { status: 400 }
      );
    }

    // Query the t_domains table to check if the apiKey and source match
    const [domain] = await db.query(
      `SELECT * FROM t_domains WHERE apiKey = ?`,
      [apiKey]
    );

    if (domain?.length === 0) {
      // If no matching record is found, return an error
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
    }

    console.log(domain[0]?.domain);

    // Step 3: Check if the session exists and if it has expired
    const [session] = await db.query(
      `SELECT * FROM t_sessions WHERE session_id = ?`,
      [sessionId]
    );

    if (session.length === 0) {
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }

    if (session[0]?.domain != domain[0]?.domain) {
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }

    // Step 4: Check if the session has expired by comparing the current time with the expiry_date
    const currentTime = new Date();
    const expiryTime = new Date(session[0].expiry_date);

    if (currentTime > expiryTime) {
      return NextResponse.json(
        { message: "Session has been expired" },
        { status: 401 }
      );
    }

    const userId = session[0].user_id;

    const [user] = await db.query(
      `SELECT name, email, image, auth_provider FROM t_users WHERE id = ?`,
      [userId]
    );

    const userData = {
      ...user[0],
      ip: session[0].ip,
      country: session[0]?.country,
      region: session[0]?.region,
      location: session[0]?.location,
      device: session[0]?.device,
      os: session[0]?.od,
      browser: session[0]?.browser,
    };

    // Step 3: Proceed with the rest of the logic (e.g., verify session, etc.)
    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error("Error during API key validation:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
