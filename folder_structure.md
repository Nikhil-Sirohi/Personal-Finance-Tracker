# Project Structure

```
.
├── postman/
│   └── Personal_Finance_Tracker_API.postman_collection.json
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
        |-- auditController.js
│   │   ├── budgetController.js
│   │   ├── categoryController.js
│   │   ├── expenseController.js
│   │   ├── notificationController.js
│   │   ├── otpController.js
│   │   ├── reversalController.js
│   │   └── scoreController.js
│   ├── jobs/
│   │   └── notificationJob.js
│   ├── middleware/
│   │   ├── auth.js
        |-- audit.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── AuditLog.js
│   │   ├── Budget.js
│   │   ├── Category.js
│   │   ├── Expense.js
│   │   ├── Ledger.js
│   │   ├── Notification.js
│   │   ├── OTP.js
│   │   ├── Reversal.js
│   │   ├── Score.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── auditRoutes.js
│   │   ├── reversalRoutes.js
│   │   └── scoreRoutes.js
│   └── services/
│       ├── auditService.js
│       ├── budgetService.js
│       ├── categorizationService.js
│       ├── ledgerService.js
│       ├── notificationService.js
│       ├── otpService.js
│       ├── reversalService.js
│       └── scoringService.js
├── .env
├── design_notes.md
├── folder_structure.md
└── README.md
```
