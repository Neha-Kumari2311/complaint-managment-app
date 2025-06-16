import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "neha#3816",
  database: "resident_complaints_db",
});

export { db };





