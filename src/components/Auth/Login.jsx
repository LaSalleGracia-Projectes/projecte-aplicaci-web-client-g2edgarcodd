// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación básica
    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      setIsLoading(false);
      return;
    }

    // Simulación de autenticación
    setTimeout(() => {
      // Aquí iría tu lógica de autenticación real
      console.log('Iniciar sesión con:', formData);
      setIsLoading(false);
      // Simulamos redirección
      window.location.href = '/';
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Iniciando sesión con ${provider}`);
    // Aquí implementarías la lógica de autenticación social
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Iniciar Sesión</h2>
          <p>¡Bienvenido de nuevo a Streamhub!</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Escribe tu correo electrónico"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">Contraseña</label>
              <Link to="/forgot-password" className="forgot-link">¿Olvidaste tu contraseña?</Link>
            </div>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Escribe tu contraseña"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="remember-me">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Recordarme
            </label>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-spinner">
                <i className="fas fa-circle-notch fa-spin"></i>
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="social-login">
          <p>O inicia sesión con</p>
          <div className="social-buttons">
            <button 
              type="button" 
              className="social-button google" 
              onClick={() => handleSocialLogin('Google')}
            >
              <i className="fab fa-google"></i>
            </button>
            <button 
              type="button" 
              className="social-button facebook" 
              onClick={() => handleSocialLogin('Facebook')}
            >
              <i className="fab fa-facebook-f"></i>
            </button>
            <button 
              type="button" 
              className="social-button twitter" 
              onClick={() => handleSocialLogin('Twitter')}
            >
              <i className="fab fa-twitter"></i>
            </button>
          </div>
        </div>

        <div className="auth-footer">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;