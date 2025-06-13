import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "worker") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }



  try {
    const [rows] = await db.query(
      "SELECT tokensEarned FROM tokens WHERE workerId = ?",
      [session.user.id]
    );
      console.log("Worker ID from session:", session.user.id);

    const balance = rows?.tokensEarned || 0;

    return NextResponse.json({ totalTokens: balance });
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

