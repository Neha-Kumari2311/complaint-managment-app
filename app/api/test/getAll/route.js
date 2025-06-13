import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "manager") {
      return new Response("Unauthorized", { status: 401 });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "neha#3816",
      database: "resident_complaints_db",
    });

    const [rows] = await db.execute(`
      SELECT c.*, u.name AS residentName
      FROM complaints c
      JOIN users u ON c.userId = u.id
      ORDER BY c.createdAt DESC
    `);

    return Response.json(rows);
  } catch (err) {
    console.error("❌ GET COMPLAINTS ERROR:", err);
    return new Response("Failed to fetch complaints", { status: 500 });
  }
}
