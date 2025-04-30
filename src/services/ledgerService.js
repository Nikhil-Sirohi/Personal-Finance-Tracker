const { Ledger, Expense } = require("../models");

class LedgerService {
  static async logOperation(userId, expenseId, operation, data) {
    try {
      const ledgerEntry = await Ledger.create({
        userId,
        expenseId,
        operation,
        data,
      });

      return ledgerEntry;
    } catch (error) {
      throw error;
    }
  }

  static async getLastOperation(userId) {
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

      return lastOperation;
    } catch (error) {
      throw error;
    }
  }

  static async getOperationHistory(userId, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await Ledger.findAndCountAll({
        where: { userId },
        order: [["timestamp", "DESC"]],
        include: [
          {
            model: Expense,
            where: { isDeleted: false },
            required: true,
          },
        ],
        limit,
        offset,
      });

      return {
        operations: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LedgerService;
