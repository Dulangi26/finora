// app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

// ============================================
// ROUTES
// ============================================
app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/budgets", budgetRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/goals", goalRoutes);

// ============================================
// 404
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// ============================================
// ERROR MIDDLEWARE
// ============================================
app.use(errorMiddleware);

export default app;