const { validationResult } = require("express-validator");
const AuditService = require("../services/auditService");

const getAuditLogs = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const requestingUserId = req.user.id;

    if (userId !== requestingUserId && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const filters = {
      action: req.query.action,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
    };

    const logs = await AuditService.getAuditLogs(userId, filters);
    res.json(logs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRecentActions = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const logs = await AuditService.getRecentActions(userId, limit);
    res.json(logs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAuditLogs,
  getRecentActions,
};
