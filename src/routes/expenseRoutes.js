const express = require("express");
const { body, query } = require("express-validator");
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
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),
  body("date").isISO8601().withMessage("Invalid date format"),
  body("notes").optional().isString().withMessage("Notes must be a string"),
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (!tags.every((tag) => typeof tag === "string" && tag.trim() !== "")) {
        throw new Error("Tags must be non-empty strings");
      }
      return true;
    }),
];

const validateExpenseQuery = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date format"),
  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
];

router.post("/", auth, validateExpense, createExpense);
router.get("/", auth, validateExpenseQuery, getExpenses);
router.put("/:id", auth, validateExpense, updateExpense);
router.delete("/:id", auth, deleteExpense);

module.exports = router;
