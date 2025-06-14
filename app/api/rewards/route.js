import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rewards] = await db.query(
      "SELECT id, name, cost, stock FROM rewards WHERE stock > 0 ORDER BY cost ASC"
    );
    return NextResponse.json(rewards);
  } catch (err) {
    console.error("Error fetching rewards:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
