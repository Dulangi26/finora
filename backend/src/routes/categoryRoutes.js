import express from "express";

import protect from "../middleware/auth.js";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { validateCategory } from "../validators/categoryValidator.js";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    validateCategory,
    createCategory
  )
  .get(protect, getCategories);

router
  .route("/:id")
  .put(
    protect,
    validateCategory,
    updateCategory
  )
  .delete(protect, deleteCategory);

export default router;