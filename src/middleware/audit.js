const AuditService = require("../services/auditService");

const auditMiddleware = async (req, res, next) => {
  try {
    const originalSend = res.send;
    res.send = function (body) {
      if (req.user) {
        const action = `${req.method} ${req.originalUrl}`;
        const status = res.statusCode < 400 ? "success" : "failure";

        AuditService.logEvent(
          req.user.id,
          action,
          {
            method: req.method,
            path: req.originalUrl,
            params: req.params,
            query: req.query,
            body: req.body,
            statusCode: res.statusCode,
          },
          status,
          req
        );
      }

      return originalSend.call(this, body);
    };

    next();
  } catch (error) {
    console.error("Audit middleware error:", error);
    next();
  }
};

module.exports = auditMiddleware;
