const express = require("express");
const { body, query, param } = require("express-validator");
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

const validateExpense = [
  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
];

const validateExpenseQuery = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date"),
  query("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

router.post("/", validateExpense, createExpense);
router.get("/", validateExpenseQuery, getExpenses);
router.put("/:id", validateExpense, updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
