const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const auth = require("./middleware/auth");
const auditMiddleware = require("./middleware/audit");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const reversalRoutes = require("./routes/reversalRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const auditRoutes = require("./routes/auditRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(auditMiddleware);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: "Too many requests, please try again later" },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/expenses", auth, expenseRoutes);
app.use("/api/budgets", auth, budgetRoutes);
app.use("/api/scores", auth, scoreRoutes);
app.use("/api/notifications", auth, notificationRoutes);
app.use("/api/reversals", auth, reversalRoutes);
app.use("/api/categories", auth, categoryRoutes);
app.use("/admin/audit", auth, auditRoutes);

app.use(errorHandler);

module.exports = app;
