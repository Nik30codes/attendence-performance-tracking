import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

export default function MyPerformance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get(`/performance/get-performance-user/${user._id}`)
      .then(res => setRecords(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const chartData = records.map(r => ({ metric: r.metricId?.name || "N/A", score: r.score, max: r.metricId?.maxScore || 10 }));

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Performance</h1>
          <p className="text-sm text-slate-500">Your evaluation scores</p>
        </div>

        {loading ? <p className="text-slate-400">Loading...</p> : (
          <>
            {chartData.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-semibold text-slate-800 mb-4">Score Overview</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {records.map(r => (
                <div key={r._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <h3 className="font-semibold text-slate-800">{r.metricId?.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">Score: <span className="font-bold text-primary-600">{r.score}</span> / {r.metricId?.maxScore}</p>
                  <p className="text-xs text-slate-400 mt-2">By {r.evaluatorId?.name} • {dayjs(r.recordedDate).format("DD MMM YYYY")}</p>
                </div>
              ))}
            </div>

            {records.length === 0 && <p className="text-slate-400 text-sm">No performance records yet</p>}
          </>
        )}
      </main>
    </div>
  );
}
