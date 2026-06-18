import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE", departmentName: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchUsers(); fetchDepartments(); }, []);

  const fetchUsers = async () => { try { const res = await api.get("/users/active"); setUsers(res.data.data || []); } catch (e) {} };
  const fetchDepartments = async () => { try { const res = await api.get("/dept/all"); setDepartments(res.data.data || []); } catch (e) {} };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccess("");
    try {
      await api.post("/users/createuser", form);
      setSuccess("User created successfully!");
      setForm({ name: "", email: "", password: "", role: "EMPLOYEE", departmentName: "" });
      setShowForm(false); fetchUsers();
    } catch (err) { setError(err.response?.data?.message || "Failed to create user"); }
  };

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
            <p className="text-sm text-slate-500">Manage users and roles</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition shadow-sm">
            {showForm ? "Cancel" : "+ Add User"}
          </button>
        </div>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Create New User</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
              </select>
              <select value={form.departmentName} onChange={e => setForm({...form, departmentName: e.target.value})} required className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select Department</option>
                {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
              </select>
              <button type="submit" className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition">Create User</button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 px-2 font-medium">Name</th>
                  <th className="pb-3 px-2 font-medium">Email</th>
                  <th className="pb-3 px-2 font-medium">Role</th>
                  <th className="pb-3 px-2 font-medium">Department</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition text-sm">
                    <td className="py-3 px-2 font-medium text-slate-700">{u.name}</td>
                    <td className="py-3 px-2 text-slate-500">{u.email}</td>
                    <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded text-xs font-medium ${u.role === "MANAGER" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>{u.role}</span></td>
                    <td className="py-3 px-2 text-slate-500 capitalize">{u.department?.name || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
