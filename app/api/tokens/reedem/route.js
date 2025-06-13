import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";

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

    // Fetch current balance
    const [result] = await db.query(
      "SELECT tokensEarned FROM tokens WHERE workerId = ?",
      [workerId]
    );

    const currentTokens = result?.[0]?.tokensEarned;

    if (currentTokens === undefined) {
      return NextResponse.json({ message: "Token data not found" }, { status: 404 });
    }

    if (tokensToRedeem > currentTokens) {
      return NextResponse.json({ message: "Not enough tokens" }, { status: 400 });
    }

    // Deduct tokens
    await db.query(
      "UPDATE tokens SET tokensEarned = tokensEarned - ? WHERE workerId = ?",
      [tokensToRedeem, workerId]
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

