import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../assets/image.png";
import Logo from "../assets/Logo.png"
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import '../styles/module_login.css';

// Retrieve the backend host from environment variables.
const backend = import.meta.env.VITE_BACKEND_HOST;


const Login = () => {
  // State variables for managing password visibility, email, password, and error messages.
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hook for programmatic navigation.
  const navigate = useNavigate();

  // Function to handle the login process.
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend login endpoint.
      const response = await axios.post(`${backend}/auth/login`, {
        email: email,
        customer_id: password, // Note: backend expects customer_id as password.
      });

      // Log the successful login response.
      console.log("Login exitoso:", response.data); // Successful login: response.data

      // Store the complete backend response in local storage.
      localStorage.setItem("loginResponse", JSON.stringify(response.data));

      // Clear any previous error messages.
      setError("");

      // Redirect to the movie catalog page.
      navigate("/MovieList");
    } catch (error) {
      // Handle login errors.
      if (error.response) {
        // Set the error message from the backend response, or a generic error.
        setError(error.response.data.detail || "Error al iniciar sesión."); // Login error
        console.error("Error en el login:", error.response.data); // Login error
      } else if (error.request) {
        // Set an error message for connection issues.
        setError("No se pudo conectar con el servidor."); // Could not connect to the server.
        console.error("Error de conexión:", error.request); // Connection error
      } else {
        // Set a generic error message for unexpected errors.
        setError("Error inesperado."); // Unexpected error.
        console.error("Error de configuración:", error.message); // Configuration error
      }
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Logo} alt="Fondo" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-center">
            <h2>Sakipelis</h2>
            <p>Ingresa con tus credenciales</p> {/* Enter your credentials */}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">Recordar por 30 días</label> {/* Remember for 30 days */}
                </div>
                <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-center-buttons">
                <button type="submit">Ingresar</button> {/* Login */}
              </div>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;