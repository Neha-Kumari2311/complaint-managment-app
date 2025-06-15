import { db } from "@/lib/db";
import NextAuth from "next-auth";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, flat_no, contact_no, role } = await req.json();
    
    if (!name || !email || !flat_no || !contact_no || !role) {
      return new Response(JSON.stringify({ message: "All fields are required!" }), { status: 400 });
    }

    const id = uuidv4();

    await db.execute(
      "INSERT INTO users (id, name, email, flat_no, contact_no, role) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, email, flat_no, contact_no, role]
    );

    return new Response(JSON.stringify({ message: "User registered successfully!" }), { status: 201 });

  } catch (err) {
    console.error("❌ User registration error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
