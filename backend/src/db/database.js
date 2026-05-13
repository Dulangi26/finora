import mysql from "mysql2/promise";
import { config } from "../config/env.js";

const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;