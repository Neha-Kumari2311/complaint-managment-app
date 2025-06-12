import mysql from 'mysql2/promise';

export const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: "neha#3816",
  database: 'resident_complaints_db',
});

