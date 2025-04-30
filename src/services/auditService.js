const AuditLog = require("../models/AuditLog");
const { Op } = require("sequelize");

class AuditService {
  static async logEvent(
    userId,
    action,
    details = null,
    status = "success",
    req = null
  ) {
    try {
      const logEntry = {
        userId,
        action,
        details,
        status,
        timestamp: new Date(),
      };

      if (req) {
        logEntry.ipAddress = req.ip;
        logEntry.userAgent = req.get("user-agent");
      }

      await AuditLog.create(logEntry);
      return true;
    } catch (error) {
      console.error("Error logging audit event:", error);
      return false;
    }
  }

  static async getAuditLogs(userId, filters = {}) {
    try {
      const {
        action,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = filters;

      const where = { userId };
      if (action) where.action = action;
      if (status) where.status = status;
      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp[Op.gte] = new Date(startDate);
        if (endDate) where.timestamp[Op.lte] = new Date(endDate);
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await AuditLog.findAndCountAll({
        where,
        order: [["timestamp", "DESC"]],
        limit,
        offset,
      });

      return {
        logs: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      console.error("Error getting audit logs:", error);
      throw error;
    }
  }

  static async getRecentActions(userId, limit = 10) {
    try {
      const logs = await AuditLog.findAll({
        where: { userId },
        order: [["timestamp", "DESC"]],
        limit,
      });

      return logs;
    } catch (error) {
      console.error("Error getting recent actions:", error);
      throw error;
    }
  }
}

module.exports = AuditService;
