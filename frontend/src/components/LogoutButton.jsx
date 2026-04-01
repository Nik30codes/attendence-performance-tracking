import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="
        flex items-center gap-2
        px-4 py-2
        text-sm font-medium
        text-red-500
        border border-red-500/40
        rounded-md
        hover:bg-red-500 hover:text-white
        transition-all duration-200
      "
      title="Logout"
    >
      <span className="text-base leading-none">⏻</span>
      <span>Logout</span>
    </button>
  );
}

export default LogoutButton;
