// app/api/decode-jwt/route.js
import { NextResponse } from "next/server";

// Function to decode the base64 URL encoded JWT without verification
const decodeJWT = (token) => {
  const [header, payload, signature] = token.split(".");

  // Decode base64 URL encoded strings (the payload part)
  const decodedPayload = Buffer.from(payload, "base64").toString("utf-8");
  return JSON.parse(decodedPayload); // Return the decoded payload
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  try {
    // Decode the JWT token
    const decoded = decodeJWT(token);

    // Return the decoded data
    return NextResponse.json({ success: true, decoded }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }
}
