import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function HeaderComponent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <header
      style={{
        width: "100%",
        padding: "15px 30px",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        color: "#333",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ margin: 0, fontWeight: 600 }}>🪔 Diwali Card Generator</h2>
      <button
        onClick={handleLogout}
        style={{
          background: "#ff8c00",
          color: "white",
          border: "none",
          padding: "10px 18px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "transform 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Logout
      </button>
    </header>
  );
}

export default HeaderComponent;
