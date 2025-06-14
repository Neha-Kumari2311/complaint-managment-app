import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "worker") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { tokensToRedeem } = await req.json();

  if (!tokensToRedeem || isNaN(tokensToRedeem) || tokensToRedeem <= 0) {
    return NextResponse.json({ message: "Invalid token amount" }, { status: 400 });
  }

  try {
    const workerId = session.user.id;

    // Fetch current token balance
    const [result] = await db.query(
      "SELECT SUM(tokensEarned) as total FROM tokens WHERE workerId = ?",
      [workerId]
    );

    const currentTokens = result?.[0]?.total || 0;

    if (tokensToRedeem > currentTokens) {
      return NextResponse.json({ message: "Not enough tokens" }, { status: 400 });
    }

    // Insert negative token entry to redeem
    const redeemId = uuidv4();
    await db.query(
      "INSERT INTO tokens (id, workerId, tokensEarned, updatedAt) VALUES (?, ?, ?, NOW())",
      [redeemId, workerId, -tokensToRedeem]
    );

    return NextResponse.json({
      message: "Tokens redeemed successfully",
      remaining: currentTokens - tokensToRedeem,
    });
  } catch (err) {
    console.error("Redeem error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


