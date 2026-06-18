import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";

export default function AdminAttendance() {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState("create");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date();
  const [sessionForm, setSessionForm] = useState({ date: { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() }, startTime: { hour: 9, minute: 0 }, endTime: { hour: 17, minute: 0 }, type: "WORKING-DAY", departmentId: "" });
  const [markForm, setMarkForm] = useState({ userId: "", sessionId: "", status: "PRESENT", checkIn: { hour: 9, minute: 0 }, checkOut: { hour: 17, minute: 0 } });

  useEffect(() => { fetchDepartments(); fetchUsers(); fetchTodaySessions(); }, []);
  const fetchDepartments = async () => { try { const r = await api.get("/dept/all"); setDepartments(r.data.data || []); } catch (e) {} };
  const fetchUsers = async () => { try { const r = await api.get("/users/active"); setUsers(r.data.data || []); } catch (e) {} };
  const fetchTodaySessions = async () => { try { const r = await api.get("/attendance/today"); setSessions(r.data.data || []); } catch (e) { setSessions([]); } };

  const handleCreateSession = async (e) => { e.preventDefault(); setError(""); setSuccess(""); try { await api.post("/attendance/create-attendance", sessionForm); setSuccess("Session created!"); fetchTodaySessions(); } catch (err) { setError(err.response?.data?.message || "Failed"); } };
  const handleMark = async (e) => { e.preventDefault(); setError(""); setSuccess(""); try { await api.post("/attendance/mark-attendance", markForm); setSuccess("Attendance marked!"); } catch (err) { setError(err.response?.data?.message || "Failed"); } };

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
          <p className="text-sm text-slate-500">Create sessions and track attendance</p>
        </div>

        <div className="flex gap-2">
          {["create", "mark", "view"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? "bg-primary-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
              {t === "create" ? "Create Session" : t === "mark" ? "Mark Attendance" : "Today's Sessions"}
            </button>
          ))}
        </div>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        {tab === "create" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Create Attendance Session</h2>
            <form onSubmit={handleCreateSession} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Date (DD / MM / YYYY)</label>
                <div className="flex gap-2">
                  <input type="number" min="1" max="31" value={sessionForm.date.day} onChange={e => setSessionForm({...sessionForm, date: {...sessionForm.date, day: +e.target.value}})} className="w-16 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                  <input type="number" min="1" max="12" value={sessionForm.date.month} onChange={e => setSessionForm({...sessionForm, date: {...sessionForm.date, month: +e.target.value}})} className="w-16 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                  <input type="number" value={sessionForm.date.year} onChange={e => setSessionForm({...sessionForm, date: {...sessionForm.date, year: +e.target.value}})} className="w-20 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Start Time (HH : MM)</label>
                <div className="flex gap-2">
                  <input type="number" min="0" max="23" value={sessionForm.startTime.hour} onChange={e => setSessionForm({...sessionForm, startTime: {...sessionForm.startTime, hour: +e.target.value}})} className="w-16 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                  <input type="number" min="0" max="59" value={sessionForm.startTime.minute} onChange={e => setSessionForm({...sessionForm, startTime: {...sessionForm.startTime, minute: +e.target.value}})} className="w-16 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">End Time (HH : MM)</label>
                <div className="flex gap-2">
                  <input type="number" min="0" max="23" value={sessionForm.endTime.hour} onChange={e => setSessionForm({...sessionForm, endTime: {...sessionForm.endTime, hour: +e.target.value}})} className="w-16 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                  <input type="number" min="0" max="59" value={sessionForm.endTime.minute} onChange={e => setSessionForm({...sessionForm, endTime: {...sessionForm.endTime, minute: +e.target.value}})} className="w-16 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                </div>
              </div>
              <select value={sessionForm.type} onChange={e => setSessionForm({...sessionForm, type: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                <option value="WORKING-DAY">Working Day</option><option value="TRAINING">Training</option><option value="MEETING">Meeting</option>
              </select>
              <select value={sessionForm.departmentId} onChange={e => setSessionForm({...sessionForm, departmentId: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                <option value="">Select Department</option>
                {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
              </select>
              <button type="submit" className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">Create Session</button>
            </form>
          </div>
        )}

        {tab === "mark" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Mark Attendance</h2>
            <form onSubmit={handleMark} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={markForm.userId} onChange={e => setMarkForm({...markForm, userId: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                <option value="">Select User</option>
                {users.filter(u => u.role !== "ADMIN").map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
              </select>
              <select value={markForm.sessionId} onChange={e => setMarkForm({...markForm, sessionId: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                <option value="">Select Session</option>
                {sessions.map(s => <option key={s._id} value={s._id}>{s.type} - {new Date(s.startTime).toLocaleTimeString()}</option>)}
              </select>
              <select value={markForm.status} onChange={e => setMarkForm({...markForm, status: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                <option value="PRESENT">Present</option><option value="LATE">Late</option><option value="ABSENT">Absent</option>
              </select>
              <button type="submit" className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">Mark Attendance</button>
            </form>
          </div>
        )}

        {tab === "view" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Today's Sessions</h2>
            {sessions.length === 0 ? <p className="text-slate-400 text-sm">No sessions today</p> : (
              <div className="space-y-3">
                {sessions.map(s => (
                  <div key={s._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{s.type}</p>
                      <p className="text-xs text-slate-400">{new Date(s.startTime).toLocaleTimeString()} - {new Date(s.endTime).toLocaleTimeString()}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">{s.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
