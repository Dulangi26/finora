import jwt from "jsonwebtoken";
import pool from "../db/database.js";
import { config } from "../config/env.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // Check authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        config.jwtSecret
      );

      // Find user
      const [users] = await pool.query(
        "SELECT id, name, email FROM users WHERE id = ?",
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // Attach user to request
      req.user = users[0];

      next();

    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Token failed",
    });
  }
};

export default protect;