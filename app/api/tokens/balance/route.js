import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "worker") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId=session.user.id;
  console.log("Worker userId:", userId);


  try {
    const [rows] = await db.query(
      "SELECT SUM(tokensEarned) as totalTokens FROM tokens WHERE workerId = ?",
      [userId]
    );
      console.log("Worker ID from session:", session.user.id);

    const totalTokens = rows[0]?.totalTokens || 0;

    return NextResponse.json({ totalTokens });
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

