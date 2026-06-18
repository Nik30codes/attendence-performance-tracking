import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/users/me")
      .then(res => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  if (!profile) return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8"><p className="text-slate-400">Loading...</p></main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-sm text-slate-500">Your account details</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold">
              {profile.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
              <p className="text-sm text-slate-500">{profile.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <ProfileField label="Email" value={profile.email} />
            <ProfileField label="Role" value={profile.role} />
            <ProfileField label="Department" value={profile.department?.name || "Not assigned"} />
            <ProfileField label="Status" value={profile.status} />
            <ProfileField label="Joined" value={new Date(profile.createdAt).toLocaleDateString()} />
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-700 capitalize">{value}</span>
    </div>
  );
}
