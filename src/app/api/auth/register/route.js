import { NextResponse } from "next/server";
import db from "@/lib/db";
import { checkEmailMXRecords, validateEmailFormat } from "@/lib/emailValidator";
import md5 from "md5";
import crypto from "crypto";
import { sendWelcomeEmail } from "@/lib/emailServices";

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
    // Check if the email format is valid
    if (!validateEmailFormat(email)) {
      return NextResponse.json(
        { msg: "Invalid email address format" },
        { status: 400 }
      );
    }

    // Check if the email's domain has valid MX records
    const isDomainValid = await checkEmailMXRecords(email);
    if (!isDomainValid) {
      return NextResponse.json(
        { msg: "Email address is not valid" },
        { status: 400 }
      );
    }

    // Check if email already exists in Users table
    const [existingUser] = await db.query(
      `SELECT COUNT(*) AS count FROM t_users WHERE email = ?`,
      [email]
    );

    if (existingUser[0].count > 0) {
      return NextResponse.json(
        { msg: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPass = hashPassword(password);
    const token = generateToken();

    sendWelcomeEmail(email, name, token);

    // Call the stored procedure
    const [result] = await db.query(`CALL sp_CreateAccount(?, ?, ?, ?, ?, ?)`, [
      name,
      email,
      null,
      hashedPass,
      "email",
      token,
    ]);

    return NextResponse.json(
      { msg: "Account Created Successfully. Verify your email" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: error?.sqlMessage || "Server Error" },
      { status: 500 }
    );
  }
}

// Helper function to generate an MD5 token
const generateToken = () => {
  // Generate a random UUID and hash it using MD5
  return crypto.createHash("md5").update(crypto.randomUUID()).digest("hex");
};
