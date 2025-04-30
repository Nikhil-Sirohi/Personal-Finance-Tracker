const Score = require("../models/Score");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const { Op } = require("sequelize");

class ScoringService {
  static async calculateBudgetAdherence(userId, month, year) {
    try {
      const budget = await Budget.findOne({
        where: { userId, month, year },
      });

      if (!budget) return 0;

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

      let totalScore = 0;
      let categoryCount = 0;

      for (const [category, spent] of Object.entries(categorySpending)) {
        const limit = budget.categoryLimits[category] || 0;
        if (limit > 0) {
          const adherence = Math.max(0, 100 - ((spent - limit) / limit) * 100);
          totalScore += adherence;
          categoryCount++;
        }
      }

      return categoryCount > 0 ? totalScore / categoryCount : 0;
    } catch (error) {
      console.error("Error calculating budget adherence:", error);
      return 0;
    }
  }

  static async calculateUsageFrequency(userId, month, year) {
    try {
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

      const daysWithExpenses = new Set(
        expenses.map((expense) => expense.date.toISOString().split("T")[0])
      ).size;

      const daysInMonth = new Date(year, month, 0).getDate();
      return (daysWithExpenses / daysInMonth) * 100;
    } catch (error) {
      console.error("Error calculating usage frequency:", error);
      return 0;
    }
  }

  static async calculateTrackingDiscipline(userId, month, year) {
    try {
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

      const uncategorizedExpenses = expenses.filter(
        (expense) => !expense.category
      ).length;

      return expenses.length > 0
        ? ((expenses.length - uncategorizedExpenses) / expenses.length) * 100
        : 0;
    } catch (error) {
      console.error("Error calculating tracking discipline:", error);
      return 0;
    }
  }

  static async calculateScore(userId, month, year) {
    try {
      const [budgetAdherence, usageFrequency, trackingDiscipline] =
        await Promise.all([
          this.calculateBudgetAdherence(userId, month, year),
          this.calculateUsageFrequency(userId, month, year),
          this.calculateTrackingDiscipline(userId, month, year),
        ]);

      const overallScore =
        budgetAdherence * 0.5 + usageFrequency * 0.3 + trackingDiscipline * 0.2;

      await Score.create({
        userId,
        month,
        year,
        score: overallScore,
        budgetAdherence,
        usageFrequency,
        trackingDiscipline,
      });

      return {
        overallScore,
        budgetAdherence,
        usageFrequency,
        trackingDiscipline,
      };
    } catch (error) {
      console.error("Error calculating score:", error);
      throw error;
    }
  }
}

module.exports = ScoringService;
