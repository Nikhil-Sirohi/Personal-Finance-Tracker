const Notification = require("../models/Notification");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const { Op } = require("sequelize");

class NotificationService {
  static async checkOverspending(userId, month, year) {
    try {
      const budget = await Budget.findOne({
        where: { userId, month, year },
      });

      if (!budget) return null;

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const expenses = await Expense.findAll({
        where: {
          userId,
          date: {
            [Op.between]: [startDate, endDate],
          },
          isDeleted: false,
        },
      });

      const categorySpending = expenses.reduce((acc, expense) => {
        const category = expense.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
        return acc;
      }, {});

      const overspendingCategories = [];
      for (const [category, spent] of Object.entries(categorySpending)) {
        const limit = budget.categoryLimits[category] || 0;
        if (spent > limit) {
          overspendingCategories.push({
            category,
            spent,
            limit,
            over: spent - limit,
          });
        }
      }

      if (overspendingCategories.length > 0) {
        const message = overspendingCategories
          .map(
            ({ category, over }) =>
              `You have overspent in ${category} by $${over.toFixed(2)}.`
          )
          .join(" ");

        await Notification.create({
          userId,
          type: "overspending",
          message,
          status: "pending",
        });

        return message;
      }

      return null;
    } catch (error) {
      console.error("Error checking overspending:", error);
      return null;
    }
  }

  static async checkInactivity(userId) {
    try {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      const lastExpense = await Expense.findOne({
        where: {
          userId,
          date: {
            [Op.gte]: fiveDaysAgo,
          },
          isDeleted: false,
        },
        order: [["date", "DESC"]],
      });

      if (!lastExpense) {
        const message = "You haven't logged any expenses in the last 5 days.";
        await Notification.create({
          userId,
          type: "inactivity",
          message,
          status: "pending",
        });
        return message;
      }

      return null;
    } catch (error) {
      console.error("Error checking inactivity:", error);
      return null;
    }
  }

  static async sendNotifications() {
    try {
      const notifications = await Notification.findAll({
        where: { status: "pending" },
      });

      for (const notification of notifications) {
        await notification.update({ status: "sent" });
      }

      return notifications;
    } catch (error) {
      console.error("Error sending notifications:", error);
      return [];
    }
  }
}

module.exports = NotificationService;
