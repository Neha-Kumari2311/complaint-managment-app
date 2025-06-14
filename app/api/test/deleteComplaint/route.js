// app/api/test/deleteComplaint/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mysql from "mysql2/promise";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "resident") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const complaintId = searchParams.get("id");

    if (!complaintId) {
      return new Response("Missing complaint ID", { status: 400 });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "neha#3816",
      database: "resident_complaints_db",
    });

    await db.execute("DELETE FROM complaints WHERE id = ?", [complaintId]);
    
    return new Response("Deleted successfully", { status: 200 });
  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    return new Response("Server Error", { status: 500 });
  }
}
