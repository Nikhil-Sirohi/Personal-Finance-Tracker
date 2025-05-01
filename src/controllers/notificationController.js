const { validationResult } = require("express-validator");
const NotificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, type } = req.query;

    const notifications = await NotificationService.getNotifications(
      userId,
      status,
      type
    );

    res.json(notifications);
  } catch (error) {
    console.error("Error in getNotifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.sendNotifications();
    res.json({ message: "Notifications sent", count: notifications.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getNotifications,
  sendNotifications,
};
