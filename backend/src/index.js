import app from "./app.js";
import { config } from "./config/env.js";
import pool from "./db/database.js";

const startServer = async () => {
  try {

    const connection =
      await pool.getConnection();

    console.log("✅ MySQL Connected");

    connection.release();

    app.listen(config.port, () => {

      console.log(
        `🚀 Server running on http://localhost:${config.port}`
      );
    });

  } catch (error) {

    console.error(
      "❌ Database connection failed"
    );

    console.error(error);
  }
};

startServer();