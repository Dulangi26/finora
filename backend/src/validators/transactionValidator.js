import { body } from "express-validator";

export const transactionValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number"),

  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),

  body("date")
    .notEmpty()
    .withMessage("Date is required"),
];