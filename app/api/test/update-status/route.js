// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/route";
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db"; // adjust if your DB file path is different

// export async function PATCH(req) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "worker") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { id, status, priority } = await req.json();

//     if (!id || !status) {
//       return NextResponse.json(
//         { error: "Missing id or status" },
//         { status: 400 }
//       );
//     }

//     // Update complaint status
//     const [result] = await db.execute(
//       `UPDATE complaints SET status = ?, assignedAt = IF(? = 'resolved', NOW(), assignedAt) WHERE id = ? AND assignedTo = ?`,
//       [status, status, id, session.user.id]
//     );

//     if (status === "resolved") {
//       // Fetch the complaint to get userId (the resident who raised it)
//       const [rows] = await db.execute(
//         "SELECT userId FROM complaints WHERE id = ?",
//         [id]
//       );
//       const userId = rows[0]?.userId;

//       if (userId) {
//         // Determine token amount based on priority
//         let tokenEarned = 1;
//         if (priority === "Medium") tokenEarned = 3;
//         else if (priority === "High") tokenEarned = 5;

//         // Insert into the tokens table
//         await db.execute(
//           "INSERT INTO tokens (workerId, tokensEarned) VALUES (?, ?)",
//           [session.user.id, tokenEarned]
//         );
//       }
//     }

//     return NextResponse.json({ message: "Status updated successfully" });
//   } catch (err) {
//     console.error("Error updating status:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    // ✅ Step 1: Update complaint status (and assignedAt if resolved)
    await db.execute(
      `UPDATE complaints 
       SET status = ?, 
           assignedAt = IF(? = 'resolved', NOW(), assignedAt) 
       WHERE id = ? AND assignedTo = ?`,
      [status, status, id, session.user.id]
    );

    // ✅ Step 2: If resolved, insert tokens for the worker
    if (status === "resolved") {
      const [rows] = await db.execute(
        "SELECT userId, priority FROM complaints WHERE id = ?",
        [id]
      );

      const userId = rows[0]?.userId;
      const complaintPriority = rows[0]?.priority;

      console.log("Resolved by worker:", session.user.id);
      console.log("Complaint priority:", complaintPriority);

      if (userId) {
        let tokenEarned = 1;
        if (complaintPriority === "Medium") tokenEarned = 3;
        else if (complaintPriority === "High") tokenEarned = 5;

        await db.execute(
          "INSERT INTO tokens (workerId, tokensEarned) VALUES (?, ?)",
          [session.user.id, tokenEarned]
        );
      }
    }

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
