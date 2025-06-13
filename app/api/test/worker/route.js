import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "worker") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        c.*, 
        u.name AS residentName, 
        u.contact_no AS residentContact, 
        u.flat_no AS residentFlat
      FROM complaints c
      JOIN users u ON u.id = c.userId
      WHERE c.assignedTo = ?
      ORDER BY 
        CASE c.priority
          WHEN 'High' THEN 1
          WHEN 'Medium' THEN 2
          WHEN 'Low' THEN 3
        END
      `,
      [session.user.id]
    );

    return NextResponse.json({ complaints: rows });
  } catch (error) {
    console.error("Error fetching complaints for worker:", error);
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}


