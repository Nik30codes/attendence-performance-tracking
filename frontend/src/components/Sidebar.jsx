import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

function Sidebar() {
  const { user } = useAuth();

  if (!user || !user.role) {
    return null;
  }

  const menu = {
    EMPLOYEE: [
      { label: "Dashboard", path: "/employee/dashboard" },
      { label: "My Attendance", path: "/employee/attendance" },
      { label: "My Performance", path: "/employee/performance" },
      { label: "Calendar", path: "/employee/calendar" },
      { label: "My Profile", path: "/employee/profile" },
    ],
    MANAGER: [
      { label: "Dashboard", path: "/manager/dashboard" },
      { label: "Team Performance", path: "/manager/performance" },
    ],
    ADMIN: [
      { label: "Dashboard", path: "/admin/dashboard" },
      { label: "Performance Control", path: "/admin/performance" },
    ],
  };

  const links = menu[user.role] || [];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-gray-200 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold p-4 border-b border-slate-700">
          {user.role} Panel
        </h1>

        <nav className="mt-4 px-2 space-y-1">
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-3 py-2 rounded hover:bg-slate-700 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-700">
        <LogoutButton />
      </div>
    </aside>
  );
}

export default Sidebar;
