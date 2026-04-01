import { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar";

export default function MyAttendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get("/attendance/user/me")
      .then(res => setRecords(res.data.data));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6">
        <h1 className="text-xl font-bold mb-4">My Attendance</h1>

        {records.map(r => (
          <div key={r._id} className="border-b py-2">
            {new Date(r.date).toDateString()} — {r.status}
          </div>
        ))}
      </main>
    </div>
  );
}
