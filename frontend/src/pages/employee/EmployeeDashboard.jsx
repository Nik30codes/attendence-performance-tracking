import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import dayjs from "dayjs";

export default function EmployeeDashboard() {
  const { user, token } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3500/api/attendance/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setAttendance(data.data || []);
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user, token]);

  const chartData = attendance.map(a => ({
    date: dayjs(a.date).format("DD MMM"),
    value:
      a.status === "PRESENT" ? 1 :
      a.status === "LATE" ? 0.5 : 0
  }));

  const presentCount = attendance.filter(a => a.status === "PRESENT").length;
  const lateCount = attendance.filter(a => a.status === "LATE").length;
  const absentCount = attendance.filter(a => a.status === "ABSENT").length;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header with Logout */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employee Dashboard</h1>
          <div className="w-32">
            <LogoutButton />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-slate-400">
            Loading dashboard...
          </div>
        )}

        {/* Empty state */}
        {!loading && attendance.length === 0 && (
          <div className="text-slate-400">
            No attendance records found
          </div>
        )}

        {/* Attendance Chart */}
        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">
            Attendance Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis ticks={[0, 0.5, 1]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard label="Present" value={presentCount} />
          <SummaryCard label="Late" value={lateCount} />
          <SummaryCard label="Absent" value={absentCount} />
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-slate-800 p-5 rounded-lg shadow text-center">
      <p className="text-slate-400">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
