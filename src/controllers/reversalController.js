const { validationResult } = require("express-validator");
const { Ledger, Reversal, Expense } = require("../models");

const reverseLastOperation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;

    const lastOperation = await Ledger.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    if (!lastOperation) {
      return res.status(404).json({ error: "No operations found" });
    }

    const existingReversal = await Reversal.findOne({
      where: { ledgerId: lastOperation.id },
    });

    if (existingReversal) {
      return res.status(400).json({ error: "Operation already reversed" });
    }

    let reversalType;
    switch (lastOperation.operation) {
      case "create":
        await Expense.update(
          { isDeleted: true },
          { where: { id: lastOperation.entityId } }
        );
        reversalType = "delete";
        break;

      case "update":
        const oldData = lastOperation.data.old;
        await Expense.update(oldData, {
          where: { id: lastOperation.entityId },
        });
        reversalType = "update";
        break;

      case "delete":
        await Expense.update(
          { isDeleted: false },
          { where: { id: lastOperation.entityId } }
        );
        reversalType = "create";
        break;
    }

    await Reversal.create({
      userId,
      ledgerId: lastOperation.id,
      reversalType,
    });

    res.json({
      message: "Operation reversed successfully",
      reversalType,
    });
  } catch (error) {
    console.error("Error in reverseLastOperation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getReversalHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const { count, rows } = await Reversal.findAndCountAll({
      where: { userId },
      order: [["timestamp", "DESC"]],
      include: [
        {
          model: Ledger,
          include: [{ model: Expense }],
        },
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    res.json({
      reversals: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  reverseLastOperation,
  getReversalHistory,
};
