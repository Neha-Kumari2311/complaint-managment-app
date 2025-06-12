import { db } from "@/lib/db";


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ message: "User ID is required!" }), { status: 400 });
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    return new Response(JSON.stringify({ complaints: rows }), { status: 200 });

  } catch (err) {
    console.error("❌ Fetch complaints error:", err);
    return new Response(JSON.stringify({ message: "Server error fetching complaints!" }), { status: 500 });
  }
}
