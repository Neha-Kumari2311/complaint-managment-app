// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import mysql from "mysql2/promise";
// import bcrypt from "bcryptjs";

// const db = await mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "neha#3816", // Your DB password
//   database: "resident_complaints_db", // Change this if needed
// });

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {},
//       async authorize(credentials) {
//         const { email, password, role, flatNumber, contact } = credentials;

//         try {
//           if (role === "resident") {
//             const [rows] = await db.execute(
//               "SELECT * FROM users WHERE flat_no = ? AND contact_no = ? AND role = ?",
//               [flatNumber, contact, "resident"]
//             );

//             if (rows.length > 0) {
//               return {
//                 id: rows[0].id,
//                 name: rows[0].name,
//                 role: rows[0].role,
//               };
//             } else {
//               throw new Error("Invalid flat number or contact number");
//             }
//           } else {
//             const [rows] = await db.execute(
//               "SELECT * FROM users WHERE email = ? AND role = ?",
//               [email, role]
//             );

//             if (rows.length === 0) {
//               throw new Error("User not found");
//             }

//             const isMatch = await bcrypt.compare(password, rows[0].password);
//             if (!isMatch) {
//               throw new Error("Incorrect password");
//             }

//             return {
//               id: rows[0].id,
//               name: rows[0].name,
//               role: rows[0].role,
//             };
//           }
//         } catch (error) {
//           console.error("AUTH ERROR:", error.message);
//           // Let NextAuth return this to the frontend
//           throw new Error(error.message);
//         }
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions };

