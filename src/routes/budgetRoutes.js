const express = require("express");
const { body, query } = require("express-validator");
const { auth } = require("../middleware/auth");
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
} = require("../controllers/budgetController");

const router = express.Router();

const validateBudget = [
  body("month")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),
  body("year")
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be between 2000 and 2100"),
  body("totalBudget")
    .isFloat({ min: 0 })
    .withMessage("Total budget must be a positive number"),
  body("categoryLimits")
    .isObject()
    .withMessage("Category limits must be an object")
    .custom((value) => {
      for (const [key, val] of Object.entries(value)) {
        if (typeof key !== "string" || key.trim() === "") {
          throw new Error("Category names must be non-empty strings");
        }
        if (typeof val !== "number" || val < 0) {
          throw new Error("Category limits must be positive numbers");
        }
      }
      return true;
    }),
];

const validateBudgetQuery = [
  query("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),
  query("year")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be between 2000 and 2100"),
];

router.post("/", auth, validateBudget, createBudget);
router.get("/", auth, validateBudgetQuery, getBudgets);
router.put("/:id", auth, validateBudget, updateBudget);
router.delete("/:id", auth, deleteBudget);
router.get("/reports/summary", auth, validateBudgetQuery, getBudgetSummary);

module.exports = router;