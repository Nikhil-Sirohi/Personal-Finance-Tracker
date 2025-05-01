\***\*Personal Finance Tracker API\*\***
_Overview_
The Personal Finance Tracker API is a RESTful service designed to help users manage their personal finances. It supports tracking expenses, setting budgets, calculating financial scores, sending notifications, reversing operations, managing categories, and auditing user actions. Built with Node.js, Express, and Sequelize, it uses PostgreSQL as the database.

**Features**

-- User authentication with JWT and OTP-based verification.
-- Expense tracking with categories and tags.
-- Budget management with category-wise limits and spending summaries.
-- Financial score calculation based on budget adherence, usage frequency, and tracking discipline.
-- Operation reversal for expense modifications.
-- Admin features for sending notifications, seeding categories, and viewing audit logs.
-- Secure with rate limiting, RBAC, and audit logging.

**Prerequisites**

Node.js (v16 or higher)
PostgreSQL (v12 or higher)
npm (v8 or higher)

**Installation**

Clone the Repository:
git clone https://github.com/Nikhil-Sirohi/Personal-Finance-Tracker.git

**Install Dependencies:**
npm install

**Set Up Environment Variables:Create a .env file in the root directory with the following:**
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgres://user:password@localhost:5432/dbname
PORT=3000
CRON_SCHEDULE=\* \* \* \* \*

**Initialize Database:Run migrations to set up the database schema:**
npx sequelize-cli db:migrate

**Start the Server:**
npm start

The API will be available at http://localhost:3000.

**_API Endpoints_**
All endpoints (except auth) require a JWT in the Authorization header as Bearer <token>.

_Authentication_

POST /auth/signup: Register a new user (name, email, password, phone).
POST /auth/login: Login and get JWT (email, password).
POST /auth/send-otp: Request OTP (phone).
POST /auth/verify-otp: Verify OTP (phone, otp).

_Expenses_

POST /expenses: Create an expense (amount, date, notes, category, tags).
GET /expenses: List expenses (supports startDate, endDate, category query params).
PUT /expenses/:id: Update an expense.
DELETE /expenses/:id: Soft delete an expense.

_Budgets_

POST /budgets: Create/update a budget (month, year, totalBudget, categoryLimits).
GET /budgets: Get budgets (supports month, year query params).
PUT /budgets/:id: Update a budget.
DELETE /budgets/:id: Delete a budget.
GET /reports/summary: Compare budget vs. actual spending.

_Scores_

GET /scores: Get user financial scores (monthly).

_Notifications_

POST /notifications/send: Send notifications (Admin-only).
GET /notifications: Get user notifications (supports status, type query params).

_Reversals_

POST /reversals/reverse: Reverse the last expense operation.
GET /reversals: Get reversal history.

_Categories_

POST /categories/rules: Add a categorization rule (pattern, category).
GET /categories/rules: Get categorization rules.
POST /categories/seed: Seed default categories (Admin-only).

_Audit Logs_

GET /admin/audit: Get audit logs (Admin-only).

**Security**

_Authentication_: JWT-based with 24-hour expiry. Tokens include id and role.
_Role-Based Access Control (RBAC)_:
User: Access to all non-admin endpoints.
Admin: Access to POST /notifications/send, POST /categories/seed, GET /admin/audit.
_Rate Limiting_: 5 requests per 15 minutes on /auth/* endpoints.
*Audit Logging*: All requests logged with userId, action, ipAddress, userAgent, status.
*Input Validation*: Uses express-validator for all endpoints.
*Error Handling\*: Standardized responses.

**Database**

ORM: Sequelize with PostgreSQL.
Schema:

- _users_: id, name, email, password, phone, role, isActive, lastLogin, createdAt, updatedAt.
- _expenses_: id, userId, amount, notes, date, category, tags, isDeleted, createdAt, updatedAt.
- _budgets_: id, userId, month, year, totalBudget, categoryLimits, createdAt, updatedAt.
- _scores_: id, userId, month, year, score, components, createdAt, updatedAt.
- _notifications_: id, userId, message, status, type, createdAt, updatedAt.
- _ledger_: id, userId, entityId, entityType, operation, data, timestamp, createdAt, updatedAt.
- _reversals_: id, userId, ledgerId, reversalType, timestamp, createdAt, updatedAt.
- _otps_: id, userId, phone, otp, status, attempts, expiresAt, createdAt, updatedAt.
- _categories_: id, pattern, category, createdAt, updatedAt.
- _audit_logs_: id, userId, action, details, ipAddress, userAgent, status, timestamp, createdAt, updatedAt.

**Testing**

_Manual Testing:_
Use Postman to test endpoints. Import the Postman collection from postman_collection.json .
Example: Test POST /auth/signup:curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123","phone":"+1234567890"}'

**Contributing**

- Follow the coding style in the codebase (ESLint configured).
- Submit pull requests with clear descriptions.
- Update docs/postman_collection.json for new endpoints.

**Troubleshooting**

- Database Connection Issues:Verify DATABASE_URL in .env.
- Ensure PostgreSQL is running.
- Missing Environment Variables: Check .env for JWT_SECRET, DATABASE_URL, PORT, CRON_SCHEDULE.
- Rate Limit Errors: Wait 15 minutes or use a different IP.

License
MIT License. See LICENSE for details.
