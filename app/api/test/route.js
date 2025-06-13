// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { v4 as uuidv4 } from "uuid";
// import mysql from "mysql2/promise";
// import path from "path";
// import { writeFile } from "fs/promises";

// export async function POST(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "resident") {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     const data = await req.formData();
//     const category = data.get("category");
//     const description = data.get("description");
//     const image = data.get("image");

//     const userId = session.user.id;
//     const complaintCode = uuidv4();

//     // Save image
//     let imagePath = "";
//     if (image && image.name) {
//       const bytes = await image.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const fileName = `${Date.now()}-${image.name}`;
//       const filePath = path.join(process.cwd(), "public/uploads", fileName);
//       await writeFile(filePath, buffer);
//       imagePath = `/uploads/${fileName}`;
//     }

//     // Connect to DB
//     const db = await mysql.createConnection({
//       host: "localhost",
//       user: "root",
//       password: "neha#3816",
//       database: "resident_complaints_db",
//     });

//     const [result] = await db.execute(
//       "INSERT INTO complaints (id, userId, category, description, imageUrl, complaintCode, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
//       [uuidv4(), userId, category, description, imagePath, complaintCode, "pending"]
//     );

//     return Response.json({ message: "Complaint submitted", complaintCode });
//   } catch (err) {
//     console.error("❌ API ERROR:", err); // <== important
//     return new Response("Something went wrong", { status: 500 });
//   }
// }