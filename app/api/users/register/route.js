import { db } from "@/lib/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/app/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email]
          );

          if (rows.length === 0) {
            throw new Error("No user found");
          }

          const user = rows[0];

          //  hash & compare passwords!**
          if (credentials.password !== user.password) {
            throw new Error("Invalid password");
          }

          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch (err) {
          console.error("❌ Authentication Error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };



import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { name, email, flat_no, contact_no, role } = await req.json();
    
    if (!name || !email || !flat_no || !contact_no || !role) {
      return new Response(JSON.stringify({ message: "All fields are required!" }), { status: 400 });
    }

    const id = uuidv4();

    await db.execute(
      "INSERT INTO users (id, name, email, flat_no, contact_no, role) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, email, flat_no, contact_no, role]
    );

    return new Response(JSON.stringify({ message: "User registered successfully!" }), { status: 201 });

  } catch (err) {
    console.error("❌ User registration error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
