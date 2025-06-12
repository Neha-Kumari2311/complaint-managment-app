import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "manager") {
    return new Response(JSON.stringify({ message: "Unauthorized!" }), { status: 403 });
  }

  const [complaints] = await db.execute("SELECT * FROM complaints ORDER BY created_at DESC");

  return new Response(JSON.stringify({ complaints }), { status: 200 });
}
