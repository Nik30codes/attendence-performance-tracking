import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import dayjs from "dayjs";

export default function PerformanceControl() {
  const { user, token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) return;

    fetch(
      `http://localhost:5000/api/performance/get-performance-user/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => res.json())
      .then(data => {
        setRecords(data.data || []);
      })
      .finally(() => setLoading(false));
  }, [user, token]);

  if (loading) {
    return <div className="text-white p-6">Loading performance...</div>;
  }

  const chartData = records.map(r => ({
    metric: r.metricId.name,
    score: r.score,
    max: r.metricId.maxScore,
  }));

  return (
    <div className="p-6 text-white space-y-6">

      {/* Chart */}
      <div className="bg-slate-800 p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          Performance Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map(r => (
          <div
            key={r._id}
            className="bg-slate-800 p-4 rounded-xl space-y-1"
          >
            <p className="font-semibold text-lg">
              {r.metricId.name}
            </p>

            <p className="text-sm text-slate-300">
              Score: {r.score} / {r.metricId.maxScore}
            </p>

            <p className="text-sm text-slate-400">
              Evaluated by: {r.evaluatorId.name} ({r.evaluatorId.role})
            </p>

            <p className="text-xs text-slate-500">
              {dayjs(r.recordedDate).format("DD MMM YYYY")}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
