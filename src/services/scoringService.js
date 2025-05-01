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

      let categoriesWithinBudget = 0;
      let totalCategories = 0;

      for (const [category, spent] of Object.entries(categorySpending)) {
        const limit = budget.categoryLimits[category] || 0;
        if (limit > 0) {
          totalCategories++;
          if (spent <= limit) {
            categoriesWithinBudget++;
          }
        }
      }

      return totalCategories > 0
        ? (categoriesWithinBudget / totalCategories) * 30
        : 0;
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
      return (daysWithExpenses / daysInMonth) * 30;
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
        order: [["date", "ASC"]],
      });

      if (expenses.length === 0) return 0;

      let maxGap = 0;
      for (let i = 1; i < expenses.length; i++) {
        const prevDate = new Date(expenses[i - 1].date);
        const currDate = new Date(expenses[i].date);
        const gap = (currDate - prevDate) / (1000 * 60 * 60 * 24);
        maxGap = Math.max(maxGap, gap);
      }

      const disciplineScore = Math.max(0, (30 - maxGap) / 30) * 40;
      return disciplineScore;
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

      const score = budgetAdherence + usageFrequency + trackingDiscipline;

      await Score.create({
        userId,
        month,
        year,
        score,
        components: {
          budgetAdherence,
          usageFrequency,
          trackingDiscipline,
        },
      });

      return {
        score,
        components: {
          budgetAdherence,
          usageFrequency,
          trackingDiscipline,
        },
      };
    } catch (error) {
      console.error("Error calculating score:", error);
      throw error;
    }
  }
}

module.exports = ScoringService;
