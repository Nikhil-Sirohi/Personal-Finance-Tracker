const express = require("express");
const { query, param } = require("express-validator");
const { auth, adminAuth } = require("../middleware/auth");
const {
  getNotifications,
  markNotificationAsRead,
  sendNotifications,
} = require("../controllers/notificationController");

const router = express.Router();

const validateNotificationQuery = [
  query("status")
    .optional()
    .isIn(["pending", "sent", "read"])
    .withMessage("Status must be pending, sent, or read"),
];

router.get("/", auth, validateNotificationQuery, getNotifications);
router.put("/:id/read", auth, markNotificationAsRead);
router.post("/send", adminAuth, sendNotifications);

module.exports = router;
