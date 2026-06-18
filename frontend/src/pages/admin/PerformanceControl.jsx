import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PerformanceControl() {
  const [tab, setTab] = useState("metrics");
  const [metrics, setMetrics] = useState([]);
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [metricForm, setMetricForm] = useState({ name: "", description: "", maxScore: 10 });
  const [recordForm, setRecordForm] = useState({ userId: "", metricId: "", score: "", recordedDate: new Date().toISOString().split("T")[0] });

  useEffect(() => { fetchMetrics(); fetchRecords(); fetchUsers(); }, []);
  const fetchMetrics = async () => { try { const r = await api.get("/performance/get-performance-metric"); setMetrics(r.data.data || []); } catch (e) {} };
  const fetchRecords = async () => { try { const r = await api.get("/performance/records"); setRecords(r.data.data || []); } catch (e) {} };
  const fetchUsers = async () => { try { const r = await api.get("/users/active"); setUsers(r.data.data || []); } catch (e) {} };

  const handleCreateMetric = async (e) => { e.preventDefault(); setError(""); setSuccess(""); try { await api.post("/performance/create-performance-metric", metricForm); setSuccess("Metric created!"); setMetricForm({ name: "", description: "", maxScore: 10 }); fetchMetrics(); } catch (err) { setError(err.response?.data?.message || "Failed"); } };
  const handleRecord = async (e) => { e.preventDefault(); setError(""); setSuccess(""); try { await api.post("/performance/record-performance", { ...recordForm, score: +recordForm.score }); setSuccess("Recorded!"); setRecordForm({ userId: "", metricId: "", score: "", recordedDate: new Date().toISOString().split("T")[0] }); fetchRecords(); } catch (err) { setError(err.response?.data?.message || "Failed"); } };

  const chartData = [];
  const userScores = {};
  records.forEach(r => { const n = r.userId?.name || "?"; if (!userScores[n]) userScores[n] = 0; userScores[n] += r.score || 0; });
  Object.entries(userScores).forEach(([name, score]) => chartData.push({ name, score }));

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Performance</h1>
          <p className="text-sm text-slate-500">Metrics, scores, and evaluation</p>
        </div>

        <div className="flex gap-2">
          {["metrics", "record", "view"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? "bg-primary-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
              {t === "metrics" ? "Metrics" : t === "record" ? "Record Score" : "Overview"}
            </button>
          ))}
        </div>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        {tab === "metrics" && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Create Metric</h2>
              <form onSubmit={handleCreateMetric} className="flex flex-wrap gap-3 items-end">
                <input type="text" placeholder="Name (e.g. Code Quality)" value={metricForm.name} onChange={e => setMetricForm({...metricForm, name: e.target.value})} required className="flex-1 min-w-[150px] px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                <input type="text" placeholder="Description" value={metricForm.description} onChange={e => setMetricForm({...metricForm, description: e.target.value})} className="flex-1 min-w-[150px] px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                <input type="number" min="1" placeholder="Max" value={metricForm.maxScore} onChange={e => setMetricForm({...metricForm, maxScore: +e.target.value})} className="w-20 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                <button type="submit" className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">Create</button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map(m => (
                <div key={m._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <h3 className="font-semibold text-slate-800">{m.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{m.description || "—"}</p>
                  <p className="text-xs text-primary-500 mt-2 font-medium">Max: {m.maxScore}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "record" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Record Performance</h2>
            <form onSubmit={handleRecord} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={recordForm.userId} onChange={e => setRecordForm({...recordForm, userId: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                <option value="">Select Employee</option>
                {users.filter(u => u.role !== "ADMIN").map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
              <select value={recordForm.metricId} onChange={e => setRecordForm({...recordForm, metricId: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                <option value="">Select Metric</option>
                {metrics.map(m => <option key={m._id} value={m._id}>{m.name} (max {m.maxScore})</option>)}
              </select>
              <input type="number" min="0" placeholder="Score" value={recordForm.score} onChange={e => setRecordForm({...recordForm, score: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
              <input type="date" value={recordForm.recordedDate} onChange={e => setRecordForm({...recordForm, recordedDate: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
              <button type="submit" className="md:col-span-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">Record Score</button>
            </form>
          </div>
        )}

        {tab === "view" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Performance Comparison</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-slate-400 text-sm">No records yet</p>}
          </div>
        )}
      </main>
    </div>
  );
}
