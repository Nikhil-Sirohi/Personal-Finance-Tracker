# Personal Finance Tracker API - Design Notes

## Architecture

The system follows a layered architecture:

1. **Routes Layer**: Express routes that handle HTTP requests
2. **Controllers Layer**: Request handlers that validate input and call services
3. **Services Layer**: Business logic implementation
4. **Models Layer**: Database models using Sequelize ORM
5. **Middleware**: Authentication, validation, and error handling

## Database Schema

### Core Tables

1. **users**

   - `id`: UUID (PK)
   - `email`: String (unique)
   - `password`: String (hashed)
   - `name`: String
   - `phone`: String (optional)
   - `role`: Enum (User/Admin)
   - `isActive`: Boolean
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

2. **expenses**

   - `id`: UUID (PK)
   - `userId`: UUID (FK)
   - `amount`: Decimal
   - `category`: String
   - `date`: Date
   - `tags`: Array[String]
   - `notes`: Text
   - `isDeleted`: Boolean
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

3. **budgets**
   - `id`: UUID (PK)
   - `userId`: UUID (FK)
   - `month`: Integer
   - `year`: Integer
   - `totalBudget`: Decimal
   - `categoryLimits`: JSONB
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

### Supporting Tables

4. **audit_logs**

   - `id`: UUID (PK)
   - `userId`: UUID (FK)
   - `action`: String
   - `timestamp`: Timestamp
   - `ipAddress`: String

5. **otps**

   - `id`: UUID (PK)
   - `phone`: String
   - `otp`: String
   - `expiresAt`: Timestamp

6. **scores**

   - `id`: UUID (PK)
   - `userId`: UUID (FK)
   - `score`: Integer
   - `components`: JSONB
   - `calculatedAt`: Timestamp

7. **notifications**

   - `id`: UUID (PK)
   - `userId`: UUID (FK)
   - `type`: String
   - `message`: Text
   - `status`: String
   - `createdAt`: Timestamp

8. **ledger**

   - `id`: UUID (PK)
   - `userId`: UUID (FK)
   - `expenseId`: UUID (FK)
   - `operation`: Enum
   - `data`: JSONB
   - `timestamp`: Timestamp

9. **reversals**

   - `id`: UUID (PK)
   - `userId`: UUID (FK)
   - `ledgerId`: UUID (FK)
   - `reversalType`: Enum
   - `timestamp`: Timestamp

10. **categories**
    - `id`: UUID (PK)
    - `pattern`: String
    - `category`: String

## Key Design Decisions

### Authentication

- **JWT**: Chose JWT for stateless authentication and scalability
- **OTP Implementation**: Mock OTP system for phone-based login
- **Password Security**: bcrypt for hashing with 10 rounds

### Data Modeling

- **Soft Deletes**: Used `isDeleted` flag instead of physical deletion
- **JSONB Fields**: Used for flexible data structures (categoryLimits, components)
- **Timestamps**: Added to all tables for tracking changes

### Behavioral Scoring

- **Components**:
  - Budget Adherence (30%): Encourages staying within limits
  - Usage Frequency (30%): Rewards regular usage
  - Tracking Discipline (40%): Promotes consistent tracking
- **Calculation**: Daily cron job for efficiency

### Transaction Management

- **Ledger Pattern**: All operations logged for audit and reversal
- **Reversal Logic**:
  - Create → Delete
  - Update → Restore previous state
  - Delete → Restore expense
- **Idempotency**: Checks for existing reversals

### Notifications

- **Cron Job**: Daily check at midnight
- **Types**:
  - Overspending: Category-level alerts
  - Inactivity: 5-day threshold
- **Mock Delivery**: No real SMS/email integration
