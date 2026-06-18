import { useAuth } from "../context/AuthContext";

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-300 border border-red-400/30 rounded-lg hover:bg-red-500/20 transition"
    >
      <span>↪</span>
      <span>Logout</span>
    </button>
  );
}

export default LogoutButton;
