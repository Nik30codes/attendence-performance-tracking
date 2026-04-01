import Charts from "../components/Charts";

export default function DashboardHome() {
  return (
    <>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ background: "#1e293b", padding: "20px", flex: 1 }}>Employees</div>
        <div style={{ background: "#1e293b", padding: "20px", flex: 1 }}>Attendance %</div>
        <div style={{ background: "#1e293b", padding: "20px", flex: 1 }}>Performance Avg</div>
      </div>

      <Charts />
    </>
  );
}
