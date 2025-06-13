import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // Only manager can assign
    if (!session || session.user.role !== "manager") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { complaintId, workerId, priority } = await req.json();

    if (!complaintId || !workerId || !priority) {
      return new Response("Missing required fields", { status: 400 });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "neha#3816",
      database: "resident_complaints_db",
    });

    const [result] = await db.execute(
      `UPDATE complaints 
       SET assignedTo = ?, 
           assignedAt = NOW(), 
           priority = ?, 
           status = 'assigned' 
       WHERE id = ?`,
      [workerId, priority, complaintId]
    );
    const [existing] = await db.execute(
      "SELECT status FROM complaints WHERE id = ?",
      [complaintId]
    );
    if (existing[0]?.status !== "assigned") {
      return new Response("Complaint already assigned", { status: 400 });
    }

    return Response.json({ message: "Complaint assigned successfully." });
  } catch (err) {
    console.error("❌ Assignment error:", err);
    return new Response("Something went wrong", { status: 500 });
  }
}
