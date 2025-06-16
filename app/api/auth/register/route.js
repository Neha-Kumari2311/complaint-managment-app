import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, contact, flatNumber, specialisation } =
      body;

    if (
      !name ||
      !role ||
      !contact ||
      !email ||
      !password ||
      (role === "resident" && !flatNumber) ||
      (role === "worker" && !specialisation)
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    let existing=[];
     if (role === "resident") {
       [existing] = await db.query(
        `SELECT * FROM users WHERE flat_no = ? AND contact_no = ?`,
        [flatNumber, contact]
      );
    } else {
       [existing] = await db.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );
    }

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the password too
    const [result] = await db.query(
      `INSERT INTO users (id, name, email, password, flat_no, contact_no, role,specialisation) VALUES (UUID(), ?, ?, ?, ?, ?, ?,?)`,
      [name, email, hashedPassword, flatNumber || "", contact, role,specialisation || null]
    );

    return NextResponse.json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}