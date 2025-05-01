**Personal Finance Tracker API: Design Notes**

_System Overview_
The Personal Finance Tracker API is a RESTful service for managing personal finances, built with Node.js, Express, and Sequelize. It provides features for expense tracking, budget management, financial scoring, operation reversal, notifications, category management, and audit logging. The system is designed to be secure, scalable, and maintainable, with a focus on modularity and extensibility.

_Architecture_

#Tech Stack

Backend: Node.js with Express for handling HTTP requests.
ORM: Sequelize for PostgreSQL database interactions.
Database: PostgreSQL for relational data storage.
Authentication: JWT for session management, OTP for phone-based verification.
Security: Helmet, rate limiting, input validation, audit logging.
Cron: Node-cron for scheduled tasks (e.g., score calculations).

#Components

Controllers: Handle HTTP requests and responses, delegating to services.
Services: Encapsulate business logic (e.g., BudgetService, ScoringService).
Models: Define database schema using Sequelize.
Middleware:
auth: Verifies JWT for protected routes.
adminAuth: Enforces admin-only access.
audit: Logs all requests to audit_logs.
Rate limiting on /auth/\* endpoints.

#Routes: Organized by feature (e.g., authRoutes.js, budgetRoutes.js).

#Data Flow

Request: Client sends HTTP request with JWT (if required).
Middleware: Validates token, logs request, checks rate limits.
Controller: Validates input, calls service.
Service: Performs business logic, interacts with database via models.
Response: Controller returns JSON response.

#Database Design
Schema

users: Stores user details (id, name, email, password, phone, role, isActive, lastLogin).
expenses: Tracks expenses (id, userId, amount, notes, date, category, tags, isDeleted).
budgets: Manages budgets (id, userId, month, year, totalBudget, categoryLimits).
scores: Stores financial scores (id, userId, month, year, score, components).
notifications: Manages notifications (id, userId, message, status, type).
ledger: Logs expense operations (id, userId, entityId, entityType, operation, data, timestamp).
reversals: Tracks reversals (id, userId, ledgerId, reversalType, timestamp).
otps: Manages OTPs (id, userId, phone, otp, status, attempts, expiresAt).
categories: Stores categorization rules (id, pattern, category).
audit_logs: Logs all actions (id, userId, action, details, ipAddress, userAgent, status, timestamp).

#Design Choices

UUIDs: Used as primary keys for uniqueness and scalability.
Soft Deletes: isDeleted in expenses for data retention and reversals.
JSONB: Used in budgets.categoryLimits, scores.components, ledger.data, audit_logs.details for flexible data storage.
Indexes:
expenses: userId, date for query performance.
budgets, scores: Unique on userId, month, year to prevent duplicates.

Timestamps: createdAt, updatedAt in all tables for auditability.

#Associations

User has many Expense, Budget, Score, Notification, Ledger, Reversal, OTP.
Expense belongs to User.
Budget, Score, Notification, Ledger, Reversal, OTP belong to User.
Reversal references Ledger.
Ledger references Expense via entityId.

#Security Considerations

Authentication:
JWT with 24-hour expiry, including id and role.
OTP-based verification for phone authentication (6-digit OTP, 5-minute expiry, 3 attempts).

Authorization:
RBAC with User and Admin roles.
adminAuth middleware restricts admin-only endpoints.

Rate Limiting:
5 requests per 15 minutes on /auth/\* to prevent abuse.

Input Validation:
express-validator for all endpoints (e.g., amount, tags, categoryLimits).

Audit Logging:
Global auditMiddleware logs all requests with ipAddress, userAgent.

Data Protection:
Passwords hashed with bcrypt.
Helmet for HTTP header security.
No sensitive data in responses (e.g., password excluded).

#Assumptions

User Base: Small to medium (thousands of users), with potential for growth.
Database: Single PostgreSQL instance, no sharding required initially.
Cron Jobs: Run on the same server (e.g., score calculations).
OTP Delivery: Assumes an external SMS service (not implemented in codebase).
Environment: Deployed on a cloud platform (e.g., AWS, Heroku) with environment variables.

#Trade-Offs

Sequelize vs. Raw SQL:
Pro: Sequelize simplifies ORM and migrations.
Con: Less control over complex queries. Mitigated by using raw queries where needed.

Soft Deletes vs. Hard Deletes:
Pro: Soft deletes enable reversals and data recovery.
Con: Increases storage. Mitigated by periodic cleanup (future feature).

JSONB vs. Normalized Tables:
Pro: JSONB (categoryLimits, components) simplifies schema changes.
Con: Query performance may degrade. Mitigated by indexing and limiting JSONB usage.

Single Server Cron:
Pro: Simplifies deployment.
Con: Not scalable for distributed systems. Future: Use a job queue (e.g., Bull).

#Scalability Considerations

API:
Stateless design (JWT) supports horizontal scaling.
Rate limiting prevents overload.
Future: Load balancer with multiple API instances.

Cron Jobs:
Currently single-threaded. Future: Distributed job queue (e.g., Redis + Bull).

Caching:
No caching implemented. Future: Redis for frequent queries (e.g., GET /scores).

Performance Optimizations

Pagination: Implemented in GET /notifications, GET /reversals, GET /admin/audit.
Query Optimization:
Avoided N+1 queries using Sequelize include for associations.
Limited JSONB usage to avoid performance hits.

Rate Limiting: Protects against DDoS on sensitive endpoints.

#Future Improvements

Caching: Add Redis for frequently accessed data (e.g., budgets, scores).
Distributed Jobs: Use a job queue for cron tasks (e.g., score calculations).
Monitoring: Integrate Prometheus and Grafana for metrics.
Logging: Replace console.error with a structured logger (e.g., Winston).
Testing: Add unit tests with Jest and integration tests.
Multi-Tenancy: Support multiple organizations (if needed).
API Versioning: Introduce /v1/ prefix for future compatibility.

#Technical Decisions

Node.js/Express: Chosen for rapid development and large ecosystem.
Sequelize: Simplifies database operations and migrations.
PostgreSQL: Reliable, supports JSONB, and widely used.
JWT: Stateless authentication, suitable for REST APIs.
express-validator: Robust input validation, aligns with Express ecosystem.
UUIDs: Prevent ID guessing and ensure uniqueness.
Soft Deletes: Enable reversals without data loss.
Cron: Lightweight for scheduled tasks in early stages.

#Known Limitations

Single Database: No sharding or replication (suitable for initial scale).
No Caching: May impact performance under high load.
No Unit Tests: Relies on manual testing (Postman).
OTP Delivery: Placeholder implementation (requires external SMS service).

#References

PRD: Personal Finance Tracker API Requirements.
Sequelize Documentation: https://sequelize.org/
Express Documentation: https://expressjs.com/
PostgreSQL Documentation: https://www.postgresql.org/
