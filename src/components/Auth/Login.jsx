import React, { useState, useEffect } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);

  // Efecto para crear partículas decorativas
  useEffect(() => {
    const particles = document.querySelector('.particles');
    if (!particles) return;

    for (let i = 0; i < 15; i++) {
      createParticle(particles);
    }

    return () => {
      const existingParticles = document.querySelectorAll('.particle');
      existingParticles.forEach(particle => particle.remove());
    };
  }, []);

  const createParticle = (container) => {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Propiedades aleatorias
    const size = Math.random() * 15 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Posición inicial aleatoria
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Opacidad y brillo aleatorios
    particle.style.opacity = Math.random() * 0.6 + 0.1;
    
    // Velocidad de animación aleatoria
    const duration = Math.random() * 20 + 10;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    container.appendChild(particle);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpiar error cuando el usuario escribe
    if (error) setError('');
  };

const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
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
      {/* Partículas de fondo */}
      <div className="particles"></div>
      
      <div className="auth-card">
        <div className="auth-header">
          <h2>Iniciar Sesión</h2>
          <p>¡Bienvenido de nuevo a Streamhub!</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

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
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Escribe tu contraseña"
                autoComplete="current-password"
              />
              <i 
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
          </div>
          <Link to="/forgot-password" className="forgot-link">¿Olvidaste tu contraseña?</Link>

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
              <>
                <i className="fas fa-circle-notch"></i>
                Procesando...
              </>
            ) : (
              <>
                Iniciar Sesión
                <i className="fas fa-arrow-right button-icon-right"></i>
              </>
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
              aria-label="Iniciar sesión con Google"
            >
              <i className="fab fa-google"></i>
            </button>
            <button 
              type="button" 
              className="social-button facebook" 
              onClick={() => handleSocialLogin('Facebook')}
              aria-label="Iniciar sesión con Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </button>
            <button 
              type="button" 
              className="social-button twitter" 
              onClick={() => handleSocialLogin('Twitter')}
              aria-label="Iniciar sesión con Twitter"
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