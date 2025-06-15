import mysql from "mysql2/promise";

let pool;

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL in format: mysql://user:pass@host:port/dbname
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = process.env.DATABASE_URL.match(regex);

  if (!match) {
    throw new Error("Invalid DATABASE_URL format");
  }

  const [, user, password, host, port, database] = match;

  pool = mysql.createPool({
    host,
    user,
    password,
    port: Number(port),
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} else {
  // Local fallback for development only
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




