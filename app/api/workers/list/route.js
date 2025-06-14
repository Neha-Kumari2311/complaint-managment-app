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

    const [rows] = await db.execute(
      "SELECT id, name, specialisation FROM users WHERE role = 'worker'"
    );

    return Response.json(rows); 
  } catch (err) {
    console.error("❌ Worker list fetch error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
