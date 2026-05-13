import express from "express";

import protect from "../middleware/auth.js";

import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";

const router = express.Router();


// Create + Get
router
  .route("/")
  .post(protect, createBudget)
  .get(protect, getBudgets);


// Update + Delete
router
  .route("/:id")
  .put(protect, updateBudget)
  .delete(protect, deleteBudget);

export default router;