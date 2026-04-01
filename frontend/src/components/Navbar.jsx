import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // later you can clear token / session here
    navigate("/login");
  };

  return (
    <div style={navbarStyle}>

      {/* Left Title */}
      <h2 style={{ margin: 0 }}>Admin Dashboard</h2>

      {/* Right Section */}
      <div style={rightSection}>

        <div style={userBox}>
          <span style={{ fontSize: "13px", opacity: 0.7 }}>Logged in as</span>
          <strong>Meghana</strong>
        </div>

        <button style={logoutBtn} onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

const navbarStyle = {
  height: "60px",
  width: "100%",
  background: "#020617",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 30px",
  color: "white",
  borderBottom: "1px solid #1e293b",
  flexShrink: 0
};

const rightSection = {
  display: "flex",
  alignItems: "center",
  gap: "20px"
};

const userBox = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end"
};

const logoutBtn = {
  padding: "8px 16px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500"
};
