import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";

export default function ManagerDashboard() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get("/users/active").then(r => setUsers(r.data.data || [])).catch(() => {});
    api.get("/attendance/today").then(r => setSessions(r.data.data || [])).catch(() => setSessions([]));
  }, []);

  const employees = users.filter(u => u.role === "EMPLOYEE");

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manager Dashboard</h1>
          <p className="text-sm text-slate-500">Team overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <p className="text-sm text-slate-500">Team Members</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{employees.length}</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-5">
            <p className="text-sm text-slate-500">Today's Sessions</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{sessions.length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
            <p className="text-sm text-slate-500">Total Staff</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">{users.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Team Members</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-slate-500 uppercase border-b border-slate-100">
                <th className="pb-3 px-2 font-medium">Name</th>
                <th className="pb-3 px-2 font-medium">Email</th>
                <th className="pb-3 px-2 font-medium">Department</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(u => (
                <tr key={u._id} className="border-b border-slate-50 text-sm hover:bg-slate-50/50">
                  <td className="py-3 px-2 font-medium text-slate-700">{u.name}</td>
                  <td className="py-3 px-2 text-slate-500">{u.email}</td>
                  <td className="py-3 px-2 text-slate-500 capitalize">{u.department?.name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
