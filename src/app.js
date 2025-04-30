const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const auth = require("./middleware/auth");

// Import routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const reversalRoutes = require("./routes/reversalRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const auditRoutes = require("./routes/auditRoutes");
const otpRoutes = require("./routes/otpRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min
  max: 5, // limit each IP to 5 requests per windowMs
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/expenses", auth, expenseRoutes);
app.use("/api/budgets", auth, budgetRoutes);
app.use("/api/scores", auth, scoreRoutes);
app.use("/api/notifications", auth, notificationRoutes);
app.use("/api/reversals", auth, reversalRoutes);
app.use("/categories", auth, categoryRoutes);
app.use("/audit", auth, auditRoutes);
app.use("/otp", otpRoutes);

app.use(errorHandler);

module.exports = app;
