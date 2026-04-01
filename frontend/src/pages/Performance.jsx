import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Performance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/performance/records")
      .then(res => {
        setRecords(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontSize: "26px" }}>Performance Records</h2>

      {loading ? (
        <p>Loading performance data...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>User</th>
              <th>Metric</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r._id}>
                <td>{r.userId?.name || r.userId}</td>
                <td>{r.metricId?.name || "N/A"}</td>
                <td>{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#020617",
  color: "white",
  borderRadius: "10px",
  overflow: "hidden"
};
