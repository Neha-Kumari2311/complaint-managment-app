import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Use your correct DB import
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Missing complaint ID" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await db.query(
      "SELECT complaintCode, priority FROM complaints WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching complaint:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
