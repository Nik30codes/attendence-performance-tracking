import { useAuth } from "../context/AuthContext";

function Header({ title = "Dashboard" }) {
  const { user } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-[#020617]">
      {/* Page title */}
      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>

      {/* User info */}
      {user && (
        <div className="flex flex-col text-right leading-tight">
          <span className="text-sm text-gray-200">
            {user.name || "User"}
          </span>
          <span className="text-xs text-gray-400">
            {user.role}
          </span>
        </div>
      )}
    </header>
  );
}

export default Header;
