import express from "express";

import protect from "../middleware/auth.js";

import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  allocateSavingsToGoals,
} from "../controllers/goalController.js";

const router = express.Router();


// ======================================
// GET ALL GOALS
// ======================================
router.get(
  "/",
  protect,
  getGoals
);


// ======================================
// CREATE GOAL
// ======================================
router.post(
  "/",
  protect,
  createGoal
);


// ======================================
// UPDATE GOAL
// ======================================
router.put(
  "/:id",
  protect,
  updateGoal
);


// ======================================
// DELETE GOAL
// ======================================
router.delete(
  "/:id",
  protect,
  deleteGoal
);


// ======================================
// MANUAL GOAL RECALCULATION
// ======================================
router.post(
  "/allocate",
  protect,
  allocateSavingsToGoals
);

export default router;