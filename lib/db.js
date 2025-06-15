import mysql from "mysql2/promise";
import { parse } from "url";

let pool;

if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL);
  pool = mysql.createPool({
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace(/^\//, ""), // remove leading /
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} else {
  pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "neha#3816",
    database: "resident_complaints_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export const db = pool;



