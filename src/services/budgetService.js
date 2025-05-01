const { Budget } = require("../models");
const { Op } = require("sequelize");

class BudgetService {
  static async setBudget(userId, month, year, totalBudget, categoryLimits) {
    try {
      let budget = await Budget.findOne({
        where: { userId, month, year },
      });

      if (budget) {
        budget = await budget.update({ totalBudget, categoryLimits });
      } else {
        budget = await Budget.create({
          userId,
          month,
          year,
          totalBudget,
          categoryLimits,
        });
      }

      return budget;
    } catch (error) {
      throw error;
    }
  }

  static async getBudget(userId, month, year) {
    try {
      const where = { userId };
      if (month) where.month = month;
      if (year) where.year = year;

      const budgets = await Budget.findAll({ where });
      return budgets;
    } catch (error) {
      throw error;
    }
  }

  static async getBudgetSummary(userId, month, year) {
    try {
      const budget = await Budget.findOne({
        where: { userId, month, year },
      });

      if (!budget) {
        throw new Error("Budget not found");
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

      const spendingByCategory = expenses.reduce((acc, expense) => {
        const category = expense.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
        return acc;
      }, {});

      const summary = {
        totalBudget: parseFloat(budget.totalBudget),
        totalSpent: expenses.reduce(
          (sum, expense) => sum + parseFloat(expense.amount),
          0
        ),
        spendingByCategory,
        categoryLimits: budget.categoryLimits,
      };

      return summary;
    } catch (error) {
      throw error;
    }
  }

  static async deleteBudget(userId, budgetId) {
    try {
      const budget = await Budget.findOne({
        where: { id: budgetId, userId },
      });

      if (!budget) {
        throw new Error("Budget not found");
      }

      await budget.destroy();
      return { message: "Budget deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BudgetService;
