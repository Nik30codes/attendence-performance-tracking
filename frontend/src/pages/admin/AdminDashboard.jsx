import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/active");
        setUsers(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const totalManagers = users.filter(u => u.role === "MANAGER").length;
  const totalEmployees = users.filter(u => u.role === "EMPLOYEE").length;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header with Logout */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="w-32">
            <LogoutButton />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Total Users" value={totalUsers} />
          <DashboardCard title="Managers" value={totalManagers} />
          <DashboardCard title="Employees" value={totalEmployees} />
        </div>
      </main>
    </div>
  );
}

/* 🔹 Reusable Card Component */
function DashboardCard({ title, value }) {
  return (
    <div className="bg-slate-800 p-5 rounded-lg shadow">
      <h2 className="text-lg text-gray-300">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
