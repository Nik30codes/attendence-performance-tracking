import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get("/users/stats"),
          api.get("/users/active")
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-page">
        <Sidebar />
        <main className="ml-60 flex-1 p-8 flex items-center justify-center">
          <div className="text-slate-400 text-lg">Loading...</div>
        </main>
      </div>
    );
  }

  const attendanceData = stats ? [
    { name: "Present", value: stats.todayAttendance.present, color: "#22c55e" },
    { name: "Late", value: stats.todayAttendance.late, color: "#f59e0b" },
    { name: "Absent", value: stats.todayAttendance.absent, color: "#ef4444" },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome back! Here's what's happening.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.location.href = "/admin/users"} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition shadow-sm">
              + Add Employee
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Users" value={stats?.totalUsers || 0} change="+12%" color="blue" />
          <StatCard label="Departments" value={stats?.totalDepartments || 0} change="" color="purple" />
          <StatCard label="Present Today" value={stats?.todayAttendance?.present || 0} change="" color="green" />
          <StatCard label="Absent Today" value={stats?.todayAttendance?.absent || 0} change="" color="red" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800">Attendance Breakdown</h2>
              <span className="text-xs text-slate-400">Today</span>
            </div>
            {attendanceData.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={attendanceData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                      {attendanceData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2">
                  {attendanceData.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }}></span>
                      <span className="text-slate-600">{d.name}: {d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center">
                <p className="text-slate-400 text-sm">No attendance data today</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {users.slice(0, 6).map((u, i) => (
                <div key={u._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    i % 3 === 0 ? "bg-blue-500" : i % 3 === 1 ? "bg-purple-500" : "bg-amber-500"
                  }`}>
                    {u.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.role === "ADMIN" ? "bg-red-50 text-red-600" :
                    u.role === "MANAGER" ? "bg-blue-50 text-blue-600" :
                    "bg-green-50 text-green-600"
                  }`}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800">All Employees</h2>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{users.length} users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 px-2 font-medium">Name</th>
                  <th className="pb-3 px-2 font-medium">Status</th>
                  <th className="pb-3 px-2 font-medium">Email</th>
                  <th className="pb-3 px-2 font-medium">Department</th>
                  <th className="pb-3 px-2 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition text-sm">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                          {u.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        <span className="text-xs text-green-600">Active</span>
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-500">{u.email}</td>
                    <td className="py-3 px-2 text-slate-500 capitalize">{u.department?.name || "—"}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        u.role === "ADMIN" ? "bg-red-50 text-red-600" :
                        u.role === "MANAGER" ? "bg-blue-50 text-blue-600" :
                        "bg-emerald-50 text-emerald-600"
                      }`}>{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, change, color }) {
  const styles = {
    blue: "bg-blue-50 border-blue-100",
    purple: "bg-purple-50 border-purple-100",
    green: "bg-green-50 border-green-100",
    red: "bg-red-50 border-red-100",
  };
  const textColors = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600",
    red: "text-red-600",
  };
  return (
    <div className={`${styles[color]} border rounded-xl p-5`}>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <div className="flex items-end gap-2 mt-2">
        <p className={`text-3xl font-bold ${textColors[color]}`}>{value}</p>
        {change && <span className="text-xs text-green-500 font-medium mb-1">{change}</span>}
      </div>
    </div>
  );
}
