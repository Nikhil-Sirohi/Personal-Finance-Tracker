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

    let result;
    switch (lastOperation.operation) {
      case "create":
        if (lastOperation.entityType === "expense") {
          await Expense.update(
            { isDeleted: true },
            { where: { id: lastOperation.entityId } }
          );
        }
        break;

      case "update":
        if (lastOperation.entityType === "expense") {
          const oldData = lastOperation.details.old;
          await Expense.update(oldData, {
            where: { id: lastOperation.entityId },
          });
        }
        break;

      case "delete":
        if (lastOperation.entityType === "expense") {
          await Expense.update(
            { isDeleted: false },
            { where: { id: lastOperation.entityId } }
          );
        }
        break;
    }

    await Reversal.create({
      userId,
      ledgerId: lastOperation.id,
      operation: lastOperation.operation,
      entityType: lastOperation.entityType,
      entityId: lastOperation.entityId,
    });

    res.json({
      message: "Operation reversed successfully",
      operation: lastOperation.operation,
      entityType: lastOperation.entityType,
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
    const history = await ReversalService.getReversalHistory(
      userId,
      page,
      limit
    );
    res.json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  reverseLastOperation,
  getReversalHistory,
};
