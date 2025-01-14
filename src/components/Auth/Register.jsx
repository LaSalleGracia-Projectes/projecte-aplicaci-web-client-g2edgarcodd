// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/auth.css';

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    preferredGenres: [],
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Géneros disponibles
  const availableGenres = [
    'Acción', 'Aventura', 'Comedia', 'Drama', 'Fantasía', 
    'Terror', 'Misterio', 'Romance', 'Ciencia Ficción', 'Thriller'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      return;
    }
    
    if (type === 'checkbox' && name === 'termsAccepted') {
      setFormData({
        ...formData,
        [name]: checked
      });
      return;
    }
    
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

  const handleGenreToggle = (genre) => {
    const currentGenres = [...formData.preferredGenres];
    if (currentGenres.includes(genre)) {
      const updatedGenres = currentGenres.filter(g => g !== genre);
      setFormData({
        ...formData,
        preferredGenres: updatedGenres
      });
    } else if (currentGenres.length < 3) {
      setFormData({
        ...formData,
        preferredGenres: [...currentGenres, genre]
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

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Debes aceptar los términos y condiciones';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 2 && validateStep2()) {
      setIsLoading(true);
      
      // Simulación de registro
      setTimeout(() => {
        console.log('Registro exitoso con:', formData);
        setIsLoading(false);
        // Simulamos redirección
        window.location.href = '/login';
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
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Crear cuenta</h2>
          <p>Únete a Streamhub y descubre un mundo de entretenimiento</p>
        </div>

        <div className="steps-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {step === 1 && (
            <>
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <div className="input-with-icon">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Escribe tu nombre completo"
                  />
                </div>
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

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
                  />
                </div>
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Crea una contraseña segura"
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
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña"
                  />
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>

              <button type="button" className="auth-button" onClick={nextStep}>
                Continuar
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group avatar-upload">
                <label className="avatar-label">Foto de perfil (opcional)</label>
                <div className="avatar-preview">
                  {formData.avatar ? (
                    <img 
                      src={URL.createObjectURL(formData.avatar)} 
                      alt="Avatar preview" 
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                  <label htmlFor="avatar" className="avatar-button">
                    <i className="fas fa-camera"></i>
                    <span>Subir foto</span>
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    className="file-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Selecciona tus géneros favoritos (máximo 3)</label>
                <div className="genres-grid">
                  {availableGenres.map(genre => (
                    <div 
                      key={genre}
                      className={`genre-item ${formData.preferredGenres.includes(genre) ? 'selected' : ''}`}
                      onClick={() => handleGenreToggle(genre)}
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-container terms-checkbox">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  <span className="terms-text">
                    Acepto los <a href="#" target="_blank">Términos y Condiciones</a> y la <a href="#" target="_blank">Política de Privacidad</a>
                  </span>
                </label>
                {errors.termsAccepted && <span className="form-error">{errors.termsAccepted}</span>}
              </div>

              <div className="buttons-group">
                <button type="button" className="secondary-button" onClick={prevStep}>
                  Atrás
                </button>
                <button type="submit" className="auth-button" disabled={isLoading}>
                  {isLoading ? (
                    <span className="loading-spinner">
                      <i className="fas fa-circle-notch fa-spin"></i>
                    </span>
                  ) : (
                    'Crear cuenta'
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;