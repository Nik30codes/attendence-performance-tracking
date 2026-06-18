import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ departmentName: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchDepartments(); }, []);
  const fetchDepartments = async () => { try { const res = await api.get("/dept/all"); setDepartments(res.data.data || []); } catch (e) {} };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccess("");
    try {
      await api.post("/dept/createdept", form);
      setSuccess("Department created!"); setForm({ departmentName: "", description: "" }); setShowForm(false); fetchDepartments();
    } catch (err) { setError(err.response?.data?.message || "Failed"); }
  };

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
            <p className="text-sm text-slate-500">Organization structure</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition shadow-sm">
            {showForm ? "Cancel" : "+ New Department"}
          </button>
        </div>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Department Name" value={form.departmentName} onChange={e => setForm({...form, departmentName: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <button type="submit" className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">Create</button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map(d => (
            <div key={d._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-lg">🏢</div>
                <h3 className="text-base font-semibold text-slate-800 capitalize">{d.name}</h3>
              </div>
              <p className="text-sm text-slate-500">{d.description || "No description"}</p>
              <p className="text-xs text-slate-400 mt-3">Created {new Date(d.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
