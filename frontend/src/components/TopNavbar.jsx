import { useAuth } from "../context/AuthContext";

function TopNavbar({ title = "Dashboard" }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-gray-200">
        {title}
      </h1>

      {/* User info */}
      {user && (
        <div className="flex flex-col text-right leading-tight">
          <span className="text-sm text-gray-300">
            {user.name || "User"}
          </span>
          <span className="text-xs text-gray-500">
            {user.role}
          </span>
        </div>
      )}
    </header>
  );
}

export default TopNavbar;
