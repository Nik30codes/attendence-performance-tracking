import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/attendance/user/me")
      .then(res => setAttendance(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartData = attendance.slice(0, 20).map(a => ({
    date: dayjs(a.createdAt).format("DD MMM"),
    value: a.status === "PRESENT" ? 1 : a.status === "LATE" ? 0.5 : 0
  }));

  const present = attendance.filter(a => a.status === "PRESENT").length;
  const late = attendance.filter(a => a.status === "LATE").length;
  const absent = attendance.filter(a => a.status === "ABSENT").length;

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}</h1>
          <p className="text-sm text-slate-500">Here's your attendance summary</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-green-50 border border-green-100 rounded-xl p-5">
            <p className="text-sm text-slate-500">Present</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{present}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
            <p className="text-sm text-slate-500">Late</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{late}</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <p className="text-sm text-slate-500">Absent</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{absent}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Attendance Trend</h2>
          {loading ? <p className="text-slate-400">Loading...</p> : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis ticks={[0, 0.5, 1]} stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-400 text-sm">No attendance records yet</p>}
        </div>
      </main>
    </div>
  );
}
