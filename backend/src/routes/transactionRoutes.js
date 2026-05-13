import express from "express";

import protect from "../middleware/auth.js";

import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

import validate from "../middleware/validate.js";
import { transactionValidation } from "../validators/transactionValidator.js";

const router = express.Router();


// Create + Get
router
  .route("/")
  .post(
    protect,
    transactionValidation,
    validate,
    createTransaction
  )
  .get(protect, getTransactions);


// Update + Delete
router
  .route("/:id")
  .put(
    protect,
    transactionValidation,
    validate,
    updateTransaction
  )
  .delete(protect, deleteTransaction);

export default router;