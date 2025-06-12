import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, contact, flatNumber } = body;

    if (!name || !role || !contact || !email || !password || (role === "resident" && !flatNumber)) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists by email
    const [existing] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Store the password too
    const [result] = await db.query(
      `INSERT INTO users (id, name, email, password, flat_no, contact_no, role) VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, flatNumber || "", contact, role]
    );

    return NextResponse.json({ message: "User registered successfully", userId: result.insertId });
  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

