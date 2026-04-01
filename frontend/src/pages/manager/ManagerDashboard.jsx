import { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";

export default function ManagerDashboard() {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get("/users/active");
        setUsers(usersRes.data.data || []);

        const attendanceRes = await api.get("/attendance/today");
        setAttendance(attendanceRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch manager dashboard data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8">
        {/* Header with Logout */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          <div className="w-32">
            <LogoutButton />
          </div>
        </div>

        {/* Active Employees */}
        <section className="bg-slate-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            Active Employees
          </h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-300 border-b border-slate-700">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Department</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-700">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    {u.department?.name || u.department}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Today Attendance */}
        <section className="bg-slate-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            Today Attendance
          </h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-300 border-b border-slate-700">
                <th className="p-2">User ID</th>
                <th className="p-2">Status</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a._id} className="border-b border-slate-700">
                  <td className="p-2">{a.userId}</td>
                  <td className="p-2">{a.status}</td>
                  <td className="p-2">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
