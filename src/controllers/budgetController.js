const { validationResult } = require("express-validator");
const BudgetService = require("../services/budgetService");

const createBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { month, year, totalBudget, categoryLimits } = req.body;
    const userId = req.user.id;

    const budget = await BudgetService.setBudget(
      userId,
      month,
      year,
      totalBudget,
      categoryLimits
    );

    res.status(201).json({
      message: "Budget set successfully",
      budget,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { month, year } = req.query;
    const userId = req.user.id;

    const budget = await BudgetService.getBudget(userId, month, year);

    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    res.json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { month, year, totalBudget, categoryLimits } = req.body;
    const userId = req.user.id;

    const budget = await BudgetService.setBudget(
      userId,
      month,
      year,
      totalBudget,
      categoryLimits
    );

    res.json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await Budget.findOne({ where: { id, userId } });
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    await budget.destroy();
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBudgetSummary = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { month, year } = req.query;
    const userId = req.user.id;

    const summary = await BudgetService.getBudgetSummary(userId, month, year);

    if (!summary) {
      return res.status(404).json({ error: "Budget not found" });
    }

    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
};
