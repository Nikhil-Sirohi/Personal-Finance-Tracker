const { Reversal, Ledger, Expense } = require("../models");
const { Op } = require("sequelize");

class ReversalService {
  static async reverseLastOperation(userId) {
    try {
      const lastOperation = await Ledger.findOne({
        where: { userId },
        order: [["timestamp", "DESC"]],
        include: [
          {
            model: Expense,
            where: { isDeleted: false },
            required: true,
          },
        ],
      });

      if (!lastOperation) {
        throw new Error("No operation to reverse");
      }

      const existingReversal = await Reversal.findOne({
        where: { ledgerId: lastOperation.id },
      });

      if (existingReversal) {
        throw new Error("Operation already reversed");
      }

      let reversalType;
      switch (lastOperation.operation) {
        case "create":
          await Expense.update(
            { isDeleted: true },
            { where: { id: lastOperation.expenseId } }
          );
          reversalType = "delete";
          break;

        case "update":
          await Expense.update(lastOperation.data, {
            where: { id: lastOperation.expenseId },
          });
          reversalType = "update";
          break;

        case "delete":
          await Expense.update(
            { isDeleted: false },
            { where: { id: lastOperation.expenseId } }
          );
          reversalType = "create";
          break;

        default:
          throw new Error("Invalid operation type");
      }

      const reversal = await Reversal.create({
        userId,
        ledgerId: lastOperation.id,
        reversalType,
      });

      return reversal;
    } catch (error) {
      throw error;
    }
  }

  static async getReversalHistory(userId, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await Reversal.findAndCountAll({
        where: { userId },
        order: [["timestamp", "DESC"]],
        include: [
          {
            model: Ledger,
            include: [
              {
                model: Expense,
              },
            ],
          },
        ],
        limit,
        offset,
      });

      return {
        reversals: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReversalService;
