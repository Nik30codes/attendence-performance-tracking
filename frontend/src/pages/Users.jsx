import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/users/active").then((res) => {
      setUsers(res.data.data);
    });
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    let bg = "#334155";
    if (role === "ADMIN") bg = "#7c3aed";
    if (role === "MANAGER") bg = "#2563eb";

    return (
      <span style={{
        padding: "4px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
        background: bg,
        color: "white"
      }}>
        {role}
      </span>
    );
  };

  return (
    <>
      <h2 style={{ marginBottom: "20px", fontSize: "26px" }}>Active Users</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "300px",
          padding: "10px 12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #1e293b",
          background: "#020617",
          color: "white",
          outline: "none"
        }}
      />

      {/* Table always visible */}
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ 
                textAlign: "center", 
                padding: "30px",
                opacity: 0.6 
              }}>
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{roleBadge(u.role)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
