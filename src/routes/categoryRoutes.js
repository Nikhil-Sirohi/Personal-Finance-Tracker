const express = require("express");
const { body } = require("express-validator");
const { auth, adminAuth } = require("../middleware/auth");
const {
  addCategoryRule,
  getCategoryRules,
  seedDefaultCategories,
} = require("../controllers/categoryController");

const router = express.Router();

const validateCategoryRule = [
  body("pattern").isString().notEmpty().withMessage("Pattern is required"),
  body("category").isString().notEmpty().withMessage("Category is required"),
];

router.post("/", adminAuth, validateCategoryRule, addCategoryRule);
router.get("/", auth, getCategoryRules);
router.post("/seed", adminAuth, seedDefaultCategories);

module.exports = router;
