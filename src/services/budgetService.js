const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const { Op } = require("sequelize");

class BudgetService {
  static async setBudget(userId, month, year, totalBudget, categoryLimits) {
    try {
      const [budget, created] = await Budget.findOrCreate({
        where: { userId, month, year },
        defaults: {
          totalBudget,
          categoryLimits,
        },
      });

      if (!created) {
        await budget.update({
          totalBudget,
          categoryLimits,
        });
      }

      return budget;
    } catch (error) {
      console.error("Error setting budget:", error);
      throw error;
    }
  }

  static async getBudget(userId, month, year) {
    try {
      const budget = await Budget.findOne({
        where: { userId, month, year },
      });

      return budget;
    } catch (error) {
      console.error("Error getting budget:", error);
      throw error;
    }
  }

  static async getBudgetSummary(userId, month, year) {
    try {
      const budget = await this.getBudget(userId, month, year);
      if (!budget) {
        return null;
      }

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

      const categories = Object.entries(budget.categoryLimits).map(
        ([name, limit]) => {
          const spent = categorySpending[name] || 0;
          return {
            name,
            budget: limit,
            spent,
            remaining: Math.max(0, limit - spent),
          };
        }
      );

      const totalSpent = Object.values(categorySpending).reduce(
        (sum, amount) => sum + amount,
        0
      );

      return {
        totalBudget: budget.totalBudget,
        totalSpent,
        categories,
      };
    } catch (error) {
      console.error("Error getting budget summary:", error);
      throw error;
    }
  }
}

module.exports = BudgetService;
