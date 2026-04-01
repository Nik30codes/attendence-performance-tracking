# Attendance & Performance Management Backend

This backend powers an internal employee operations system for:

- user onboarding and authentication
- department management
- attendance session scheduling and attendance marking
- employee performance metric definition and performance recording

It is built with `Node.js`, `Express`, `MongoDB`, and `Mongoose`, and demonstrates the same backend skills that are typically evaluated in screening assignments focused on API design, data modeling, business logic, and access control.

## Why This Project Fits a Backend Screening Assignment

Although this system is not a finance-domain project, it exercises the same backend fundamentals that a "Finance Data Processing and Access Control" assignment is designed to test:

- API design: multiple protected REST endpoints grouped by domain
- data modeling: relational references between users, departments, attendance sessions, attendance records, performance metrics, and performance records
- business rules: duplicate prevention, time validation, department-level restrictions, role-constrained creation flows, and score limits
- access control: JWT authentication plus role-based and department-scoped authorization
- maintainability: clear route/controller/model separation and reusable response/error helpers

If you submit this project for evaluation, frame it as a comparable backend system that demonstrates production-style handling of protected data workflows rather than a finance-specific implementation.

## Tech Stack

- `Node.js`
- `Express 5`
- `MongoDB`
- `Mongoose`
- `JWT` authentication
- `bcrypt` password hashing
- `cookie-parser`
- `cors`

## Backend Structure

```text
backend/
  src/
    controllers/      # request handling and business logic
    db/               # MongoDB connection
    middlewares/      # JWT auth and role checks
    models/           # Mongoose schemas
    routes/           # API route definitions
    script/           # one-time admin bootstrap script
    utils/            # async wrapper and API response/error helpers
    app.js            # Express app setup
    index.js          # server entrypoint
```

## Core Domain Model

### `User`

- identity fields: `name`, `email`, `password`
- access control fields: `role`, `status`, `authType`
- organizational field: `department`
- session field: `refreshToken`

Supported roles:

- `ADMIN`
- `MANAGER`
- `EMPLOYEE`

### `Department`

- `name`
- `description`

### `AttendanceSession`

- `date`
- `startTime`
- `endTime`
- `type`
- `createdBy`
- `departmentId`

Session types:

- `WORKING-DAY`
- `TRAINING`
- `MEETING`

### `AttendanceRecord`

- `userId`
- `sessionId`
- `status`
- `leaveReason`
- `checkIn`
- `checkOut`

Attendance statuses:

- `PRESENT`
- `ABSENT`
- `LATE`

Leave reasons:

- `SICK`
- `PERSONAL`
- `OFFICIAL`
- `UNAPPROVED`

### `PerformanceMetric`

- `name`
- `description`
- `maxScore`

### `PerformanceRecord`

- `userId`
- `metricId`
- `evaluatorId`
- `score`
- `recordedDate`

## Authentication and Access Control

The backend uses JWT-based authentication with role-based authorization.

### Authentication Flow

1. A user logs in with email and password.
2. The server validates credentials using `bcrypt`.
3. The backend generates:
   - an access token
   - a refresh token
4. Tokens are stored in secure, HTTP-only cookies.
5. Protected endpoints use `verifyJWT` to extract and verify the access token from:
   - cookies, or
   - the `Authorization: Bearer <token>` header

### Authorization Layers

There are two authorization patterns in the codebase:

- role-based route protection via `authorizeRoles(...)`
- creation-specific role rules via `canCreateUser`

User creation is constrained as follows:

- `ADMIN` can create `MANAGER` and `EMPLOYEE`
- `MANAGER` can create `EMPLOYEE`

### Department-Scoped Restrictions

Some actions are restricted not only by role, but also by department ownership:

- managers can create attendance sessions only for their own department
- managers can record performance only for users in their own department
- managers can update attendance/performance only for users in their own department

This is an important part of the backend design because it prevents horizontal access across departments.

## Business Rules Implemented

### User Management

- duplicate email registration is blocked
- users must belong to an existing department at creation time
- active users can be fetched separately

### Department Management

- department names are normalized to lowercase
- duplicate departments are rejected

### Attendance Management

- invalid or incomplete date/time inputs are rejected
- attendance session end time must be after start time
- only one session of the same type can exist for a department on a given date
- overlapping sessions for the same department are rejected
- attendance cannot be recorded twice for the same user and session
- attendance can only be recorded if the user belongs to the session's department
- check-in cannot be before session start
- check-out cannot be after session end
- check-out must be after check-in

### Performance Management

- performance metrics must be unique by name
- a user cannot receive the same metric twice on the same date
- score cannot exceed a metric's `maxScore`
- managers cannot record or update scores for users outside their department

## API Modules

Base path prefixes:

- `/api/users`
- `/api/dept`
- `/api/attendance`
- `/api/performance`

A complete endpoint reference is available in [docs/API_REFERENCE.md](/d:/Git/attendence-performance-tracking/backend/docs/API_REFERENCE.md).

## Environment Variables

Create `backend/.env` with the following values:

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d

ALLOW_ADMIN_SCRIPT=true
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWD=strongpassword
```

Database name is currently hardcoded in [src/db_name.js](/d:/Git/attendence-performance-tracking/backend/src/db_name.js) as `Error404`.

## Running Locally

Install dependencies:

```bash
cd backend
npm install
```

Start the development server:

```bash
npm run dev
```

The backend entrypoint is [src/index.js](/d:/Git/attendence-performance-tracking/backend/src/index.js).

## Admin Bootstrap

The repository includes a one-time admin creation script at [src/script/createAdmin.js](/d:/Git/attendence-performance-tracking/backend/src/script/createAdmin.js).

Run it only after setting the admin-related environment variables:

```bash
cd backend
node ./src/script/createAdmin.js
```

The script will:

- connect to MongoDB
- check whether an admin already exists
- create the first `ADMIN` user if none exists

## Response Pattern

Successful responses use a shared wrapper:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "success",
  "success": true
}
```

The codebase also defines a reusable `ApiError` class for structured failures.

## Known Limitations

These are worth mentioning honestly in a submission because they show good engineering judgment:

- `PATCH /api/users/updateuser` is wired without an `:id` route parameter, while the controller expects `req.params.id`
- the `refresh-token` controller destructures `newrefreshToken`, but the token generator returns `refreshToken`
- there is no centralized Express error-handling middleware registered in `app.js`
- no automated test suite is present yet

## Useful Files

- [src/app.js](/d:/Git/attendence-performance-tracking/backend/src/app.js)
- [src/controllers/user.controller.js](/d:/Git/attendence-performance-tracking/backend/src/controllers/user.controller.js)
- [src/controllers/attendance.controller.js](/d:/Git/attendence-performance-tracking/backend/src/controllers/attendance.controller.js)
- [src/controllers/performance.controller.js](/d:/Git/attendence-performance-tracking/backend/src/controllers/performance.controller.js)
- [src/middlewares/auth.middleware.js](/d:/Git/attendence-performance-tracking/backend/src/middlewares/auth.middleware.js)
- [src/middlewares/authorizeRoles.middleware.js](/d:/Git/attendence-performance-tracking/backend/src/middlewares/authorizeRoles.middleware.js)
