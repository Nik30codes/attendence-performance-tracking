import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TeamPerformance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get("/performance/records")
      .then(res => setRecords(res.data.data || []))
      .catch(() => {});
  }, []);

  const chartData = [];
  const userScores = {};
  records.forEach(r => {
    const name = r.userId?.name || "Unknown";
    if (!userScores[name]) userScores[name] = 0;
    userScores[name] += r.score || 0;
  });
  Object.entries(userScores).forEach(([name, score]) => chartData.push({ name, score }));

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Team Performance</h1>
          <p className="text-sm text-slate-500">Compare team scores</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-400 text-sm">No performance records yet</p>}
        </div>
      </main>
    </div>
  );
}
