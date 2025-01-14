// src/components/Auth/ResetPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/auth.css';

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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
        setIsSubmitted(true);
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
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Escribe tu nueva contraseña"
                  />
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
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu nueva contraseña"
                  />
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
                  <span className="loading-spinner">
                    <i className="fas fa-circle-notch fa-spin"></i>
                  </span>
                ) : (
                  'Restablecer contraseña'
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
              Ir a iniciar sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;