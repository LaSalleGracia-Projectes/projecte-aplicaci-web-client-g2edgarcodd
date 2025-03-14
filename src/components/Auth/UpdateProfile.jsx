import React, { useState, useEffect } from 'react';
import '../../styles/components/auth.css';

function UpdateProfile() {
  const [formData, setFormData] = useState({
    name: 'Usuario Ejemplo',
    email: 'usuario@ejemplo.com',
    avatar: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [previewAvatar, setPreviewAvatar] = useState('/api/placeholder/150/150');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' o 'password'
  const [showPassword, setShowPassword] = useState({
    current: false,
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (files[0]) {
        setFormData({
          ...formData,
          [name]: files[0]
        });
        setPreviewAvatar(URL.createObjectURL(files[0]));
      }
      return;
    }
    
    if (name === 'newPassword') {
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

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
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

  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'profile') {
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre es obligatorio';
      }
    } else {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Debes introducir tu contraseña actual';
      }
      
      if (formData.newPassword) {
        if (formData.newPassword.length < 8) {
          newErrors.newPassword = 'La nueva contraseña debe tener al menos 8 caracteres';
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulación de actualización de perfil
      setTimeout(() => {
        console.log('Perfil actualizado con:', formData);
        setIsLoading(false);
        setSuccessMessage(
          activeTab === 'profile' 
            ? 'Tu información de perfil ha sido actualizada correctamente.' 
            : 'Tu contraseña ha sido actualizada correctamente.'
        );
        
        // Limpiar campos de contraseña después de actualizar
        if (activeTab === 'password') {
          setFormData({
            ...formData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setPasswordStrength(0);
        }
        
        // Mostrar animación de éxito
        const successMsg = document.querySelector('.success-message');
        if (successMsg) {
          successMsg.classList.add('animate-success');
          setTimeout(() => {
            successMsg.classList.remove('animate-success');
          }, 1000);
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
    <div className="profile-container">
      {/* Partículas de fondo */}
      <div className="particles"></div>
      
      <div className="profile-card">
        <div className="profile-header">
          <h2>Mi perfil</h2>
          <p>Actualiza tu información personal</p>
        </div>
        
        {successMessage && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            {successMessage}
          </div>
        )}
        
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i>
            Información personal
          </button>
          <button 
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <i className="fas fa-lock"></i>
            Cambiar contraseña
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          {activeTab === 'profile' && (
            <>
              <div className="avatar-section">
                <div className="avatar-preview-large">
                  <img 
                    src={previewAvatar} 
                    alt="Avatar preview" 
                    className="avatar-image"
                  />
                  <label htmlFor="avatar" className="avatar-edit-button">
                    <i className="fas fa-camera"></i>
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
                <label htmlFor="name">Nombre completo</label>
                <div className="input-with-icon">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
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
                    placeholder="Tu correo electrónico"
                    disabled
                  />
                </div>
                <span className="input-note">No puedes cambiar tu correo electrónico</span>
              </div>
            </>
          )}
          
          {activeTab === 'password' && (
            <>
              <div className="form-group">
                <label htmlFor="currentPassword">Contraseña actual</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Escribe tu contraseña actual"
                  />
                  <i 
                    className={`fas ${showPassword.current ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                    onClick={() => togglePasswordVisibility('current')}
                  ></i>
                </div>
                {errors.currentPassword && <span className="form-error">{errors.currentPassword}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Escribe tu nueva contraseña"
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
                {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
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
                  <li className={formData.newPassword.length >= 8 ? 'valid' : ''}>
                    <i className={formData.newPassword.length >= 8 ? 'fas fa-check' : 'fas fa-times'}></i>
                    Al menos 8 caracteres
                  </li>
                  <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                    <i className={/[A-Z]/.test(formData.newPassword) ? 'fas fa-check' : 'fas fa-times'}></i>
                    Al menos una letra mayúscula
                  </li>
                  <li className={/[0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                    <i className={/[0-9]/.test(formData.newPassword) ? 'fas fa-check' : 'fas fa-times'}></i>
                    Al menos un número
                  </li>
                  <li className={/[^a-zA-Z0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                    <i className={/[^a-zA-Z0-9]/.test(formData.newPassword) ? 'fas fa-check' : 'fas fa-times'}></i>
                    Al menos un carácter especial
                  </li>
                </ul>
              </div>
            </>
          )}
          
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <>
                Guardando...
                <i className="fas fa-ellipsis-h button-icon-right"></i>
              </>
            ) : (
              <>
                {activeTab === 'profile' ? 'Guardar cambios' : 'Actualizar contraseña'}
                <i className={`fas ${activeTab === 'profile' ? 'fa-save' : 'fa-key'} button-icon-right`}></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;