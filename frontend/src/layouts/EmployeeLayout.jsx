import Sidebar from "../../components/Sidebar";

export default function EmployeeDashboard() {
  return (
    <div className="flex">
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="ml-64 p-6 w-full bg-slate-950 min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
        {/* charts & cards will go here */}
      </div>
    </div>
  );
}
