import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !user.role) return null;

  const menu = {
    ADMIN: [
      { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
      { label: "Employees", path: "/admin/users", icon: "👥" },
      { label: "Departments", path: "/admin/departments", icon: "🏢" },
      { label: "Attendance", path: "/admin/attendance", icon: "📋" },
      { label: "Performance", path: "/admin/performance", icon: "📈" },
    ],
    MANAGER: [
      { label: "Dashboard", path: "/manager/dashboard", icon: "📊" },
      { label: "Attendance", path: "/manager/attendance", icon: "📋" },
      { label: "Performance", path: "/manager/performance", icon: "📈" },
    ],
    EMPLOYEE: [
      { label: "Dashboard", path: "/employee/dashboard", icon: "📊" },
      { label: "My Attendance", path: "/employee/attendance", icon: "📋" },
      { label: "My Performance", path: "/employee/performance", icon: "📈" },
      { label: "Profile", path: "/employee/profile", icon: "👤" },
    ],
  };

  const links = menu[user.role] || [];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-sidebar text-white flex flex-col justify-between z-50">
      <div>
        {/* Brand */}
        <div className="px-5 py-6">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-blue-400">ATP</span> System
          </h1>
          <p className="text-xs text-indigo-300 mt-0.5">Attendance & Performance</p>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {links.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-white/15 text-white font-semibold"
                    : "text-indigo-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-indigo-300">{user.role}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}

export default Sidebar;
