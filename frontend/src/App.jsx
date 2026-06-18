import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

// admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/CreateUser";
import AdminDepartments from "./pages/admin/Departments";
import AdminAttendance from "./pages/admin/Attendance";
import AdminPerformance from "./pages/admin/PerformanceControl";

// manager
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AttendanceControl from "./pages/manager/AttendanceControl";
import TeamPerformance from "./pages/manager/TeamPerformance";

// employee
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyAttendance from "./pages/employee/MyAttendance";
import MyPerformance from "./pages/employee/PerformanceControl";
import MyProfile from "./pages/employee/MyProfile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ADMIN */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/departments" element={<ProtectedRoute role="ADMIN"><AdminDepartments /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute role="ADMIN"><AdminAttendance /></ProtectedRoute>} />
      <Route path="/admin/performance" element={<ProtectedRoute role="ADMIN"><AdminPerformance /></ProtectedRoute>} />

      {/* MANAGER */}
      <Route path="/manager/dashboard" element={<ProtectedRoute role="MANAGER"><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/manager/attendance" element={<ProtectedRoute role="MANAGER"><AttendanceControl /></ProtectedRoute>} />
      <Route path="/manager/performance" element={<ProtectedRoute role="MANAGER"><TeamPerformance /></ProtectedRoute>} />

      {/* EMPLOYEE */}
      <Route path="/employee/dashboard" element={<ProtectedRoute role="EMPLOYEE"><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/attendance" element={<ProtectedRoute role="EMPLOYEE"><MyAttendance /></ProtectedRoute>} />
      <Route path="/employee/performance" element={<ProtectedRoute role="EMPLOYEE"><MyPerformance /></ProtectedRoute>} />
      <Route path="/employee/profile" element={<ProtectedRoute role="EMPLOYEE"><MyProfile /></ProtectedRoute>} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
