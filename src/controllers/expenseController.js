const { validationResult } = require("express-validator");
const { Expense, Ledger } = require("../models");
const CategorizationService = require("../services/categorizationService");

const createExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, description, date, category } = req.body;
    const userId = req.user.id;

    let expenseCategory = category;
    if (!expenseCategory) {
      expenseCategory = await CategorizationService.categorizeExpense(
        description
      );
    }

    const expense = await Expense.create({
      userId,
      amount,
      description,
      date,
      category: expenseCategory,
    });

    await Ledger.create({
      userId,
      operation: "create",
      entityType: "expense",
      entityId: expense.id,
      details: {
        amount,
        description,
        date,
        category: expenseCategory,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Error in createExpense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, category, page = 1, limit = 10 } = req.query;

    const where = { userId, isDeleted: false };
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }
    if (category) {
      where.category = category;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Expense.findAndCountAll({
      where,
      order: [["date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      expenses: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error in getExpenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { amount, description, date, category } = req.body;
    const userId = req.user.id;

    const expense = await Expense.findOne({
      where: { id, userId, isDeleted: false },
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const oldExpense = { ...expense.get() };

    await expense.update({
      amount,
      description,
      date,
      category,
    });

    await Ledger.create({
      userId,
      operation: "update",
      entityType: "expense",
      entityId: expense.id,
      details: {
        old: oldExpense,
        new: expense.get(),
      },
    });

    res.json(expense);
  } catch (error) {
    console.error("Error in updateExpense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const expense = await Expense.findOne({
      where: { id, userId, isDeleted: false },
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await expense.update({ isDeleted: true });

    await Ledger.create({
      userId,
      operation: "delete",
      entityType: "expense",
      entityId: expense.id,
      details: expense.get(),
    });

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error in deleteExpense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
