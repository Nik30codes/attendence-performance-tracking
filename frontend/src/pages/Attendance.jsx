import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Attendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get("/attendance/today").then(res => {
      setRecords(res.data.data);
    });
  }, []);

  const statusBadge = (status) => {
    let bg = "#334155";

    if (status === "Present") bg = "#16a34a";
    if (status === "Absent") bg = "#dc2626";
    if (status === "Late") bg = "#f59e0b";

    return (
      <span style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
        background: bg,
        color: "white"
      }}>
        {status}
      </span>
    );
  };

  return (
    <>
      <h1 style={{ marginBottom: "20px", fontSize: "26px" }}>
        Today's Attendance
      </h1>

      {/* Empty State */}
      {records.length === 0 ? (
        <p style={{ opacity: 0.6, marginTop: "30px" }}>
          No attendance records for today.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r._id}>
                <td>{r.userId}</td>
                <td>{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
