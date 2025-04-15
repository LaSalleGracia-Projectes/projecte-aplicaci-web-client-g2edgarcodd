import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/components/admin/variables.css";
import "../styles/components/admin/forms.css";
import "../styles/components/admin/login.css";

function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate("/admin/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg-pattern"></div>
      <div className="admin-login-particles">
        <span className="admin-login-particle"></span>
        <span className="admin-login-particle"></span>
        <span className="admin-login-particle"></span>
        <span className="admin-login-particle"></span>
        <span className="admin-login-particle"></span>
      </div>

      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-login-logo-container">
            <div className="admin-login-logo">
              <i className="fas fa-lock"></i>
            </div>
          </div>
          <h1 className="admin-login-title">Panel de Administración</h1>
          <p className="admin-login-subtitle">
            Inicia sesión para acceder al panel
          </p>
        </div>

        {error && (
          <div className="admin-login-error">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-input-group">
            <input
              type="text"
              id="username"
              className="admin-login-input-field"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <i className="admin-login-input-icon fas fa-user"></i>
          </div>

          <div className="admin-login-input-group">
            <input
              type="password"
              id="password"
              className="admin-login-input-field"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="admin-login-input-icon fas fa-lock"></i>
          </div>

          <div className="admin-login-options">
            <label className="admin-login-remember">
              <span className="admin-login-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="admin-login-checkbox-mark"></span>
              </span>
              Recordar credenciales
            </label>
            <a href="#" className="admin-login-forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <div className="admin-login-button-container">
            <button type="submit" className="admin-login-button">
              Iniciar Sesión
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>

        <div className="admin-login-footer">
          <p>StreamHub Admin Panel © 2025</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
