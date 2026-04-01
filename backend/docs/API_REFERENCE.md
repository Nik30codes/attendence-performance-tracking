# API Reference

Base URL when running locally:

```text
http://localhost:<PORT>/api
```

Unless noted otherwise, all protected routes require:

- a valid JWT access token
- either an `Authorization: Bearer <token>` header or auth cookies

## Authentication

### `POST /users/login`

Authenticate a user and set access/refresh token cookies.

Request body:

```json
{
  "email": "manager@example.com",
  "password": "password123"
}
```

Success response:

```json
{
  "statusCode": 200,
  "data": {
    "loggedInUser": {
      "_id": "userId",
      "name": "Manager Name",
      "email": "manager@example.com",
      "role": "MANAGER"
    }
  },
  "message": "User Logged In Successfully",
  "success": true
}
```

### `POST /users/refresh-token`

Refresh the access token using the stored refresh token.

Request body fallback:

```json
{
  "refreshToken": "token-value"
}
```

Note: this route exists, but the current implementation has a token variable mismatch documented in [../README.md](/d:/Git/attendence-performance-tracking/backend/README.md).

### `GET /users/home`

Protected health-check style route used to verify authentication.

Allowed roles:

- `ADMIN`
- `MANAGER`
- `EMPLOYEE`

## User Management

### `POST /users/createuser`

Create a new user.

Allowed roles:

- `ADMIN`
- `MANAGER`

Additional creation rules:

- `ADMIN` can create `MANAGER` and `EMPLOYEE`
- `MANAGER` can create `EMPLOYEE`

Request body:

```json
{
  "name": "Employee One",
  "email": "employee1@example.com",
  "password": "password123",
  "role": "EMPLOYEE",
  "departmentName": "engineering"
}
```

### `GET /users/getactiveusers`

Fetch all active users.

Allowed roles:

- `ADMIN`
- `MANAGER`

### `GET /users/dept-users/:departmentId`

Fetch active users belonging to a department.

Allowed roles:

- `ADMIN`
- `MANAGER`

### `GET /users/getuser/:id`

Fetch one user by id.

Allowed roles:

- `ADMIN`
- `MANAGER`

### `PATCH /users/updateuser`

Update user details.

Allowed roles:

- `ADMIN`
- `MANAGER`

Request body fields currently supported by the controller:

```json
{
  "role": "EMPLOYEE",
  "department": "departmentObjectId",
  "status": "ACTIVE"
}
```

Important note:

- the controller expects `req.params.id`, but the current route is missing `/:id`

## Department Management

### `POST /dept/createdept`

Create a department.

Allowed roles:

- `ADMIN`

Request body:

```json
{
  "departmentName": "engineering",
  "description": "Handles product and platform development"
}
```

## Attendance

### `POST /attendance/create-attendance`

Create an attendance session.

Allowed roles:

- `ADMIN`
- `MANAGER`

Request body:

```json
{
  "date": {
    "day": 2,
    "month": 4,
    "year": 2026
  },
  "startTime": {
    "hour": 9,
    "minute": 0
  },
  "endTime": {
    "hour": 17,
    "minute": 0
  },
  "type": "WORKING-DAY",
  "departmentId": "engineering"
}
```

Rules:

- managers can only create sessions for their own department
- admins provide department by name, which is resolved internally
- overlapping sessions are rejected
- duplicate session type on the same date is rejected

### `POST /attendance/mark-attendance`

Record attendance for a user within a session.

Allowed roles:

- `ADMIN`
- `MANAGER`

Request body:

```json
{
  "userId": "userObjectId",
  "sessionId": "sessionObjectId",
  "status": "PRESENT",
  "checkIn": {
    "hour": 9,
    "minute": 5
  },
  "checkOut": {
    "hour": 16,
    "minute": 55
  }
}
```

For an absent record:

```json
{
  "userId": "userObjectId",
  "sessionId": "sessionObjectId",
  "status": "ABSENT",
  "leaveReason": "SICK"
}
```

Rules:

- attendance cannot be duplicated for the same user and session
- the user must belong to the same department as the session
- check-in and check-out must stay within the session time window

### `GET /attendance/get-todayattendance`

Fetch today's attendance sessions.

Allowed roles:

- `ADMIN`
- `MANAGER`

Behavior:

- admins see all departments
- managers see only their own department

### `GET /attendance/get-session/:sessionId`

Fetch attendance records for a session.

Allowed roles:

- `ADMIN`
- `MANAGER`

### `GET /attendance/get-userattendance/:userId`

Fetch attendance history for a user.

Allowed roles:

- `ADMIN`
- `MANAGER`

### `PATCH /attendance/update-attendance/:recordId`

Update an attendance record.

Allowed roles:

- `ADMIN`
- `MANAGER`

Supported update fields:

- `status`
- `leaveReason`
- `checkIn`
- `checkOut`

Managers are restricted to users inside their own department.

## Performance

### `POST /performance/create-performance-metric`

Create a performance metric.

Allowed roles:

- `ADMIN`

Request body:

```json
{
  "name": "Task Completion",
  "description": "Measures assigned task completion quality",
  "maxScore": 10
}
```

### `GET /performance/get-performance-metric`

Fetch all defined performance metrics.

Allowed roles:

- `ADMIN`
- `MANAGER`

### `POST /performance/record-performance`

Record a performance score for a user.

Allowed roles:

- `ADMIN`
- `MANAGER`

Request body:

```json
{
  "userId": "userObjectId",
  "metricId": "metricObjectId",
  "score": 8,
  "recordedDate": "2026-04-02"
}
```

Rules:

- one metric can be recorded only once per user per day
- score cannot exceed metric `maxScore`
- managers cannot score users outside their department

### `GET /performance/get-performance-user/:userId`

Fetch all performance records for a user.

Allowed roles:

- `ADMIN`
- `MANAGER`

### `GET /performance/get-performances`

Fetch all performance records.

Allowed roles:

- `ADMIN`
- `MANAGER`

### `PATCH /performance/update-performance/:recordId`

Update a performance score.

Allowed roles:

- `ADMIN`
- `MANAGER`

Request body:

```json
{
  "score": 9
}
```

Rules:

- managers can update only users in their own department
- updated score still cannot exceed metric `maxScore`
