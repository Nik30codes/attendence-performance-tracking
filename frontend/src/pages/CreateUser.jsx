import { useState } from "react";
import api from "../api/axios";

export default function CreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    department: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/users", form);
    alert("User created");
  };

  return (
    <>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option>EMPLOYEE</option>
          <option>MANAGER</option>
          <option>ADMIN</option>
        </select>
        <input placeholder="Department ID" onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <button>Create</button>
      </form>
    </>
  );
}
