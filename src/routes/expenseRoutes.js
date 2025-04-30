const express = require("express");
const { body, query, param } = require("express-validator");
const { auth } = require("../middleware/auth");
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

const validateExpense = [
  body("amount")
    .isDecimal({ min: 0 })
    .withMessage("Amount must be a positive number"),
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  body("date")
    .isISO8601()
    .withMessage("Date must be in ISO format (YYYY-MM-DD)"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("notes").optional().isString().withMessage("Notes must be a string"),
];

const validateExpenseQuery = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be in ISO format"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be in ISO format"),
  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
];

router.post("/", auth, validateExpense, createExpense);
router.get("/", auth, validateExpenseQuery, getExpenses);
router.put("/:id", auth, validateExpense, updateExpense);
router.delete("/:id", auth, deleteExpense);

module.exports = router;
