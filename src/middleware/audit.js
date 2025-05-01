const { AuditLog } = require("../models");

const auditMiddleware = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const action = `${req.method} ${req.originalUrl}`;
    const ipAddress = req.ip || "unknown";
    const userAgent = req.get("User-Agent") || "unknown";

    await AuditLog.create({
      userId,
      action,
      ipAddress,
      userAgent,
      status: "pending",
    });

    next();
  } catch (error) {
    console.error("Error in auditMiddleware:", error);
    next(error);
  }
};

module.exports = auditMiddleware;
