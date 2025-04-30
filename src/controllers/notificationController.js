const { validationResult } = require("express-validator");
const { Notification } = require("../models");
const NotificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, type } = req.query;

    const where = { userId };
    if (status) where.status = status;
    if (type) where.type = type;

    const notifications = await Notification.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json(notifications);
  } catch (error) {
    console.error("Error in getNotifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await notification.update({ status: "read" });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error in markAsRead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await notification.destroy();

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNotification:", error);
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
  markAsRead,
  deleteNotification,
  sendNotifications,
};
