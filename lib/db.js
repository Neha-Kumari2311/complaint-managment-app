import mysql from "mysql2/promise";

let pool;

if (process.env.DATABASE_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {

  pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "neha#3816",
    database: "resident_complaints_db",
  });
}

export const db = pool;


