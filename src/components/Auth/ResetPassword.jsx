import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../styles/components/auth.css';

function ResetPassword() {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  // Efecto para crear partículas decorativas
  useEffect(() => {
    const particles = document.querySelector('.particles');
    if (!particles) return;

    for (let i = 0; i < 15; i++) {
      createParticle(particles);
    }

    // Validar el token al cargar el componente
    validateToken();

    return () => {
      const existingParticles = document.querySelectorAll('.particle');
      existingParticles.forEach(particle => particle.remove());
    };
  }, []);

  const createParticle = (container) => {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 15 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = Math.random() * 0.6 + 0.1;
    
    const duration = Math.random() * 20 + 10;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    container.appendChild(particle);
  };

  // Simulación de validación de token
  const validateToken = () => {
    console.log('Validando token:', token);
    // En un caso real, aquí validarías el token con tu backend
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error específico cuando el usuario corrige
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Longitud mínima
    if (password.length >= 8) strength += 25;
    
    // Contiene letras minúsculas
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contiene letras mayúsculas
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Contiene números o caracteres especiales
    if (/[0-9]|[^a-zA-Z0-9]/.test(password)) strength += 25;
    
    return strength;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Simulación de restablecimiento
      setTimeout(() => {
        console.log('Contraseña restablecida con:', formData.password);
        setIsLoading(false);
        
        // Animación de transición suave antes de mostrar el éxito
        const formElement = document.querySelector('.auth-form');
        if (formElement) {
          formElement.classList.add('fade-out');
          setTimeout(() => {
            setIsSubmitted(true);
          }, 300);
        } else {
          setIsSubmitted(true);
        }
      }, 1500);
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 25) return 'Débil';
    if (passwordStrength <= 75) return 'Media';
    return 'Fuerte';
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 25) return 'weak';
    if (passwordStrength <= 75) return 'medium';
    return 'strong';
  };

  return (
    <div className="auth-container">
      {/* Partículas de fondo */}
      <div className="particles"></div>
      
      <div className="auth-card">
        {!isSubmitted ? (
          <>
            <div className="auth-header">
              <h2>Restablecer contraseña</h2>
              <p>Crea una nueva contraseña para tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="password">Nueva contraseña</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Escribe tu nueva contraseña"
                    autoFocus
                  />
                  <i 
                    className={`fas ${showPassword.new ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                    onClick={() => togglePasswordVisibility('new')}
                  ></i>
                </div>
                {passwordStrength > 0 && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-progress ${getPasswordStrengthClass()}`} 
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <span className="strength-text">{getPasswordStrengthText()}</span>
                  </div>
                )}
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu nueva contraseña"
                  />
                  <i 
                    className={`fas ${showPassword.confirm ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                    onClick={() => togglePasswordVisibility('confirm')}
                  ></i>
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>

              <div className="password-tips">
                <h4>Recomendaciones para una contraseña segura:</h4>
                <ul>
                  <li className={formData.password.length >= 8 ? 'valid' : ''}>
                    <i className={formData.password.length >= 8 ? 'fas fa-check' : 'fas fa-times'}></i>
                    Al menos 8 caracteres
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                    <i className={/[A-Z]/.test(formData.password) ? 'fas fa-check' : 'fas fa-times'}></i>
                    Al menos una letra mayúscula
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                    <i className={/[0-9]/.test(formData.password) ? 'fas fa-check' : 'fas fa-times'}></i>
                    Al menos un número
                  </li>
                  <li className={/[^a-zA-Z0-9]/.test(formData.password) ? 'valid' : ''}>
                    <i className={/[^a-zA-Z0-9]/.test(formData.password) ? 'fas fa-check' : 'fas fa-times'}></i>
                    Al menos un carácter especial
                  </li>
                </ul>
              </div>

              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="fas fa-circle-notch"></i>
                    Procesando...
                  </>
                ) : (
                  <>
                    Restablecer contraseña
                    <i className="fas fa-key button-icon-right"></i>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="success-container">
            <div className="success-icon green">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>¡Contraseña restablecida!</h2>
            <p>
              Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>
            <Link to="/login" className="auth-button">
              <i className="fas fa-sign-in-alt button-icon-left"></i>
              Ir a iniciar sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;