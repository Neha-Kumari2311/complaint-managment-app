
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code"); // 🟡 changed from 'id' to 'code'

  console.log("Received complaintCode in API:", code);

  if (!code) {
    return NextResponse.json(
      { message: "Missing complaint code" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await db.query(
      `
      SELECT id, complaintCode, priority, status, assignedTo
      FROM complaints
      WHERE complaintCode = ?
      `,
      [code]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    const complaint = rows[0];

    // Check assigned and in progress
    if (
      complaint.status !== "in progress" ||
      complaint.assignedTo !== session.user.id
    ) {
      return NextResponse.json(
        { message: "Invalid QR or unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error("Error fetching complaint:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
