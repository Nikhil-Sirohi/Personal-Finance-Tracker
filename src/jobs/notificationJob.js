const cron = require("node-cron");
const { User } = require("../models");
const notificationService = require("../services/notificationService");

class NotificationJob {
  static start() {
    // Run at midnight every day
    cron.schedule("0 0 * * *", async () => {
      try {
        await this.checkOverspending();
        await this.checkInactivity();

        await notificationService.sendNotifications();
      } catch (error) {
        console.error("Error in notification job:", error);
      }
    });
  }

  static async checkOverspending() {
    try {
      const users = await User.findAll({
        where: { isActive: true },
      });

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      for (const user of users) {
        await notificationService.checkOverspending(
          user.id,
          currentMonth,
          currentYear
        );
      }
    } catch (error) {
      throw error;
    }
  }

  static async checkInactivity() {
    try {
      const users = await User.findAll({
        where: { isActive: true },
      });

      for (const user of users) {
        await notificationService.checkInactivity(user.id);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificationJob;
