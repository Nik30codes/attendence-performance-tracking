import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import api from "../api/axios";

export default function Charts() {
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [performanceRecords, setPerformanceRecords] = useState([]);

  useEffect(() => {
    loadTodayAttendance();
    loadPerformance();
  }, []);

  // ---------------- LOAD ATTENDANCE ----------------
  const loadTodayAttendance = async () => {
    try {
      const res = await api.get("/attendance/today");
      setTodayAttendance(res.data.data);
    } catch (err) {
      console.error("Attendance fetch failed", err);
    }
  };

  // ---------------- LOAD PERFORMANCE ----------------
  const loadPerformance = async () => {
    try {
      const res = await api.get("/performance/records");
      setPerformanceRecords(res.data.data);
    } catch (err) {
      console.error("Performance fetch failed", err);
    }
  };

  // ---------------- PROCESS ATTENDANCE ----------------
  const present = todayAttendance.filter(a => a.status === "PRESENT").length;
  const absent = todayAttendance.filter(a => a.status === "ABSENT").length;
  const late = todayAttendance.filter(a => a.status === "LATE").length;

  // ---------------- PROCESS PERFORMANCE ----------------
  // score range based on metric maxScore (assume 10)
  const low = performanceRecords.filter(p => p.score < 4).length;
  const medium = performanceRecords.filter(p => p.score >= 4 && p.score < 7).length;
  const high = performanceRecords.filter(p => p.score >= 7).length;

  return (
    <div
      style={{
        marginTop: "40px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px"
      }}
    >

      {/* ---------- TODAY ATTENDANCE ---------- */}
      <div
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(0,0,0,0.3)"
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Today's Attendance</h3>

        <Bar
          data={{
            labels: ["Present", "Absent", "Late"],
            datasets: [
              {
                label: "Employees",
                data: [present, absent, late]
              }
            ]
          }}
        />
      </div>

      {/* ---------- PERFORMANCE DISTRIBUTION ---------- */}
      <div
        style={{
          background: "#1e293b",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(0,0,0,0.3)"
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Performance Distribution</h3>

        <Bar
          data={{
            labels: ["Low", "Medium", "High"],
            datasets: [
              {
                label: "Employees",
                data: [low, medium, high]
              }
            ]
          }}
        />
      </div>

    </div>
  );
}
