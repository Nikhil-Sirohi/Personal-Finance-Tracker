# Personal Finance Tracker API

A robust backend system for personal finance management, enabling users to track expenses, manage budgets, and receive behavioral insights.

## Features

- **User Authentication**: Secure JWT and OTP-based authentication
- **Expense Management**: Track and categorize expenses
- **Budget Management**: Set and monitor monthly budgets
- **Behavioral Scoring**: Get insights based on financial habits
- **Notifications**: Receive alerts for overspending and inactivity
- **Transaction Ledger**: Track and reverse expense operations

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT and OTP
- **Documentation**: Postman collection

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository:

```bash
git clone https://github.com/Nikhil-Sirohi/Personal-Finance-Tracker.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/finance_tracker
JWT_SECRET=your_jwt_secret
CRON_SCHEDULE=0 0 * * *
```

4. Set up the database:

```bash
npm run migrate
```

5. Start the server:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login with email and password
- `POST /otp/send` - Generate OTP for phone login
- `POST /otp/verify` - Verify OTP and login

### Expenses

- `POST /expenses` - Create a new expense
- `GET /expenses` - List user's expenses with filters
- `PUT /expenses/:id` - Update an existing expense
- `DELETE /expenses/:id` - Delete an expense

### Budgets

- `POST /budgets` - Set monthly budget
- `GET /budgets` - Get user's budget
- `GET /budgets/summary` - Get budget vs. actual spending summary

### User Scores

- `GET /users/:id/score` - Get user's behavioral score
- `POST /users/:id/calculate` - Calculate user's score

### Categories

- `POST /categories` - Add a new category rule (Admin only)
- `GET /categories` - Get all category rules
- `POST /categories/seed` - Seed default categories (Admin only)

### Notifications

- `GET /notifications` - Get user's notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `POST /notifications/send` - Send notifications (Admin only)

### Reversals

- `POST /reversals/reverse` - Reverse last operation
- `GET /reversals/history` - Get reversal history

### Audit Logs

- `GET /audit` - Get audit logs
- `GET /audit/recent` - Get recent actions

## Behavioral Scoring

The system calculates a score (0-100) based on three components:

1. **Budget Adherence (30%)**: Ratio of categories within budget
2. **Usage Frequency (30%)**: Active days in last 30 days
3. **Tracking Discipline (40%)**: Consistency in expense tracking

## Auto-Categorization

Expenses are automatically categorized based on patterns in notes and tags:

- Example: "lunch" → "Food"
- Rules stored in `categories` table

## Transaction Ledger

All expense operations are logged in the ledger:

- Create: New expense
- Update: Modified expense
- Delete: Soft-deleted expense

Reversals are supported for all operations:

- Create → Delete
- Update → Restore previous state
- Delete → Restore expense

## Project Structure

```
src/
├── controllers/ (route handlers)
├── services/ (business logic)
├── models/ (Sequelize models)
├── middleware/ (auth, validation)
├── utils/ (auto-categorization, helpers)
├── config/ (database, .env)
├── routes/ (Express routes)
├── jobs/ (cron jobs)
└── postman/ (Postman collection)
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Rate limiting on auth routes
- Input validation
- SQL injection prevention
- CORS and helmet middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
