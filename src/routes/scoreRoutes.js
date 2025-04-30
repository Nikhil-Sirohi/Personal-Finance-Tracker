const express = require("express");
const { query } = require("express-validator");
const { auth } = require("../middleware/auth");
const { getScore, getScoreHistory } = require("../controllers/scoreController");

const router = express.Router();

const validateScoreQuery = [
  query("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),
  query("year")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be between 2000 and 2100"),
];

const validateScoreHistoryQuery = [
  query("startMonth")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Start month must be between 1 and 12"),
  query("startYear")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Start year must be between 2000 and 2100"),
  query("endMonth")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("End month must be between 1 and 12"),
  query("endYear")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("End year must be between 2000 and 2100"),
];

router.get("/", auth, validateScoreQuery, getScore);
router.get("/history", auth, validateScoreHistoryQuery, getScoreHistory);

module.exports = router;
