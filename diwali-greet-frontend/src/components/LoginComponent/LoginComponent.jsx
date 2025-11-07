import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginComponent() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const apiVersion = import.meta.env.VITE_APP_API_VERSION;

  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (prop) => (event) => {
    setValue({ ...value, [prop]: event.target.value });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `${apiUrl}/${apiVersion}/user/login`,
        {
          email: value.email,
          password: value.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        console.error("❌ Login Error:", error.response?.data || error.message);
      });
  };

  return (
    <div className="login-container">
      <div className="form-card" style={{ maxWidth: "400px" }}>
        <h1 style={{ fontWeight: 600, color: "#ff8c00" }}>🪔 Welcome Back!</h1>
        <p style={{ margin: "-10px 0 25px 0", color: "#555" }}>
          Login to generate your card
        </p>
        <form onSubmit={handleOnSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            onChange={handleChange("email")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            onChange={handleChange("password")}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            style={{
              padding: "12px",
              background: "#ff8c00",
              fontWeight: 600,
              marginTop: "10px",
            }}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginComponent;
