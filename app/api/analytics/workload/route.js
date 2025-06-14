import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT u.specialization, COUNT(c.id) AS pendingCount
      FROM users u
      LEFT JOIN complaints c 
        ON u.id = c.assignedTo 
        AND c.status IN ('submitted', 'assigned')
      WHERE u.role = 'worker'
      GROUP BY u.specialisation
      ORDER BY pendingCount DESC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Workload fetch error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
