const express = require("express");
const { query } = require("express-validator");
const { auth } = require("../middleware/auth");
const {
  getAuditLogs,
  getRecentActions,
} = require("../controllers/auditController");

const router = express.Router();

const validateAuditQuery = [
  query("action").optional().isString().withMessage("Action must be a string"),
  query("status")
    .optional()
    .isIn(["success", "failure"])
    .withMessage("Status must be success or failure"),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

router.get("/", auth, validateAuditQuery, getAuditLogs);
router.get("/recent", auth, getRecentActions);

module.exports = router;
