import { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar";

export default function MyProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/me")
      .then(res => setUser(res.data.data));
  }, []);

  if (!user) return null;

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6">
        <h1 className="text-xl font-bold mb-4">My Profile</h1>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Department: {user.department}</p>
      </main>
    </div>
  );
}
