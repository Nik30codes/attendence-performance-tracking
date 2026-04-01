import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";

// employee
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyAttendance from "./pages/employee/MyAttendance";
import MyPerformance from "./pages/employee/PerformanceControl";
import MyProfile from "./pages/employee/MyProfile";
import MyCalendar from "./pages/employee/MyCalendar";

// manager
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import TeamPerformance from "./pages/manager/TeamPerformance";

// admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import PerformanceControl from "./pages/admin/PerformanceControl";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* EMPLOYEE */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <MyAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/performance"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <MyPerformance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/calendar"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <MyCalendar />
          </ProtectedRoute>
        }
      />

      {/* MANAGER */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute role="MANAGER">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/performance"
        element={
          <ProtectedRoute role="MANAGER">
            <TeamPerformance />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/performance"
        element={
          <ProtectedRoute role="ADMIN">
            <PerformanceControl />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
