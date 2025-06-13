import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "resident") {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "neha#3816", // your actual password
      database: "resident_complaints_db",
    });

    
    const [rows] = await db.execute(
      "SELECT * FROM complaints WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );

    return Response.json(rows);
  } catch (err) {
    console.error("❌ GET complaint error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
