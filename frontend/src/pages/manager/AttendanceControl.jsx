import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";

export default function AttendanceControl() {
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date();
  const [sessionForm, setSessionForm] = useState({ date: { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() }, startTime: { hour: 9, minute: 0 }, endTime: { hour: 17, minute: 0 }, type: "WORKING-DAY" });
  const [markForm, setMarkForm] = useState({ userId: "", sessionId: "", status: "PRESENT", checkIn: { hour: 9, minute: 0 }, checkOut: { hour: 17, minute: 0 } });

  useEffect(() => {
    api.get("/attendance/today").then(r => setSessions(r.data.data || [])).catch(() => setSessions([]));
    api.get("/users/active").then(r => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  const handleCreate = async (e) => { e.preventDefault(); setError(""); setSuccess(""); try { await api.post("/attendance/create-attendance", sessionForm); setSuccess("Session created!"); const r = await api.get("/attendance/today"); setSessions(r.data.data || []); } catch (err) { setError(err.response?.data?.message || "Failed"); } };
  const handleMark = async (e) => { e.preventDefault(); setError(""); setSuccess(""); try { await api.post("/attendance/mark-attendance", markForm); setSuccess("Marked!"); } catch (err) { setError(err.response?.data?.message || "Failed"); } };

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Control</h1>
          <p className="text-sm text-slate-500">Manage team attendance</p>
        </div>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Create Session</h2>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
            <input type="number" min="1" max="31" value={sessionForm.date.day} onChange={e => setSessionForm({...sessionForm, date: {...sessionForm.date, day: +e.target.value}})} className="w-14 px-2 py-2 rounded border border-slate-200 text-sm" />
            <input type="number" min="1" max="12" value={sessionForm.date.month} onChange={e => setSessionForm({...sessionForm, date: {...sessionForm.date, month: +e.target.value}})} className="w-14 px-2 py-2 rounded border border-slate-200 text-sm" />
            <input type="number" value={sessionForm.date.year} onChange={e => setSessionForm({...sessionForm, date: {...sessionForm.date, year: +e.target.value}})} className="w-20 px-2 py-2 rounded border border-slate-200 text-sm" />
            <select value={sessionForm.type} onChange={e => setSessionForm({...sessionForm, type: e.target.value})} className="px-3 py-2 rounded border border-slate-200 text-sm">
              <option value="WORKING-DAY">Working Day</option><option value="TRAINING">Training</option><option value="MEETING">Meeting</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">Create</button>
          </form>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Mark Attendance</h2>
          <form onSubmit={handleMark} className="flex flex-wrap gap-3 items-end">
            <select value={markForm.userId} onChange={e => setMarkForm({...markForm, userId: e.target.value})} required className="px-3 py-2 rounded border border-slate-200 text-sm">
              <option value="">User</option>
              {users.filter(u => u.role === "EMPLOYEE").map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
            <select value={markForm.sessionId} onChange={e => setMarkForm({...markForm, sessionId: e.target.value})} required className="px-3 py-2 rounded border border-slate-200 text-sm">
              <option value="">Session</option>
              {sessions.map(s => <option key={s._id} value={s._id}>{s.type}</option>)}
            </select>
            <select value={markForm.status} onChange={e => setMarkForm({...markForm, status: e.target.value})} className="px-3 py-2 rounded border border-slate-200 text-sm">
              <option value="PRESENT">Present</option><option value="LATE">Late</option><option value="ABSENT">Absent</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Mark</button>
          </form>
        </div>
      </main>
    </div>
  );
}
