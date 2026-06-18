# Attendance & Performance Tracking System

A full-stack employee management platform for tracking attendance, monitoring performance, and managing organizational structure. Built as an internship project.

## Features

- **Role-based access** — Admin, Manager, and Employee dashboards
- **Attendance Management** — Create sessions, mark attendance (Present/Late/Absent)
- **Performance Tracking** — Define metrics, record scores, view comparison charts
- **Department Management** — Create and manage departments
- **User Management** — Admin can create users, assign roles and departments
- **Signup/Login** — JWT-based authentication with public signup for employees
- **Modern Dashboard** — Professional UI with stat cards, charts, tables, and activity feeds

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Recharts, React Router |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB Atlas |
| Auth | JWT (Access + Refresh tokens), bcrypt |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth & role checks
│   │   ├── utils/           # ApiError, ApiResponse, asyncHandler
│   │   ├── db/              # Database connection
│   │   ├── script/          # Admin seeder
│   │   ├── app.js           # Express app setup
│   │   └── index.js         # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # Admin, Manager, Employee pages
│   │   ├── components/      # Sidebar, LogoutButton
│   │   ├── context/         # AuthContext
│   │   ├── api/             # Axios instance
│   │   ├── routes/          # ProtectedRoute
│   │   ├── App.jsx          # Route definitions
│   │   └── main.jsx         # Entry point
│   └── package.json
└── testing/
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo

```bash
git clone https://github.com/Nik30codes/attendence-performance-tracking.git
cd attendence-performance-tracking
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=3500
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

ALLOW_ADMIN_SCRIPT=true
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@atp.com
ADMIN_PASSWD=Admin@123
```

Create the admin user:

```bash
node src/script/createAdmin.js
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### 4. Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@atp.com | Admin@123 |

Admins can create Manager and Employee accounts from the Users page.
Employees can self-register via the Signup page.

## API Routes

### Auth (Public)
- `POST /api/users/login` — Login
- `POST /api/users/signup` — Employee signup
- `GET /api/dept/all` — List departments

### Users (Protected)
- `GET /api/users/me` — Current user
- `GET /api/users/active` — All active users
- `GET /api/users/stats` — Dashboard statistics
- `POST /api/users/createuser` — Create user (Admin/Manager)

### Departments (Protected)
- `POST /api/dept/createdept` — Create department (Admin)

### Attendance (Protected)
- `POST /api/attendance/create-attendance` — Create session
- `POST /api/attendance/mark-attendance` — Mark attendance
- `GET /api/attendance/today` — Today's sessions
- `GET /api/attendance/user/me` — My attendance
- `GET /api/attendance/user/:userId` — User attendance

### Performance (Protected)
- `POST /api/performance/create-performance-metric` — Create metric (Admin)
- `POST /api/performance/record-performance` — Record score
- `GET /api/performance/records` — All records
- `GET /api/performance/get-performance-user/:userId` — User performance
- `GET /api/performance/get-performance-metric` — All metrics

## User Roles

| Role | Can Do |
|------|--------|
| **Admin** | Everything — manage users, departments, attendance, performance |
| **Manager** | Create attendance sessions, mark attendance, record performance for their team |
| **Employee** | View own attendance, performance, and profile |

## Screenshots

The system features a modern, professional dashboard with:
- Stat cards with color-coded metrics
- Donut charts for attendance breakdown
- Bar charts for performance comparison
- Clean table layouts with role badges
- Responsive sidebar navigation

## License

ISC
