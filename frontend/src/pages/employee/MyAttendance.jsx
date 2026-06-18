import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import dayjs from "dayjs";

export default function MyAttendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get("/attendance/user/me")
      .then(res => setRecords(res.data.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Attendance</h1>
          <p className="text-sm text-slate-500">Your attendance history</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          {records.length === 0 ? (
            <p className="text-slate-400 text-sm">No attendance records found</p>
          ) : (
            <div className="space-y-2">
              {records.map(r => (
                <div key={r._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{dayjs(r.createdAt).format("DD MMM YYYY")}</p>
                    <p className="text-xs text-slate-400">{r.sessionId?.type || "Session"}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    r.status === "PRESENT" ? "bg-green-50 text-green-600" :
                    r.status === "LATE" ? "bg-amber-50 text-amber-600" :
                    "bg-red-50 text-red-600"
                  }`}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
