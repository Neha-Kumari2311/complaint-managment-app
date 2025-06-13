import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // adjust if your DB file path is different

export async function PATCH(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "worker") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, priority } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    // Update complaint status
    const [result] = await db.execute(
      `UPDATE complaints SET status = ?, assignedAt = IF(? = 'resolved', NOW(), assignedAt) WHERE id = ? AND assignedTo = ?`,
      [status, status, id, session.user.id]
    );

    if (status === "resolved") {
      // Fetch the complaint to get userId (the resident who raised it)
      const [rows] = await db.execute(
        "SELECT userId FROM complaints WHERE id = ?",
        [id]
      );
      const userId = rows[0]?.userId;

      if (userId) {
        // Determine token amount based on priority
        let tokenEarned = 1;
        if (priority === "Medium") tokenEarned = 3;
        else if (priority === "High") tokenEarned = 5;

        // Insert into the tokens table
        await db.execute(
          "INSERT INTO tokens (userId, tokensEarned) VALUES (?, ?)",
          [userId, tokenEarned]
        );
      }
    }

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

