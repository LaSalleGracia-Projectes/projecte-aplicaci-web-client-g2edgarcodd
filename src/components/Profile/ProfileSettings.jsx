import React, { useState } from 'react';

function ProfileSettings({ userData }) {
  const [settings, setSettings] = useState({
    fullName: userData.fullName || '',
    email: userData.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'es',
    notifications: {
      newsletter: true,
      newContent: true,
      recommendations: true
    },
    privacy: {
      publicProfile: true,
      showActivity: true,
      shareWatchlist: false
    }
  });

  const [activeSection, setActiveSection] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (section, name) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: !prev[section][name]
      }
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios del perfil
    console.log('Cambios de perfil guardados', settings);
    setSuccessMessage('Perfil actualizado correctamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para cambiar la contraseña
    console.log('Contraseña actualizada');
    // Resetear los campos de contraseña
    setSettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setSuccessMessage('Contraseña actualizada correctamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar las preferencias
    console.log('Preferencias guardadas', settings);
    setSuccessMessage('Preferencias guardadas correctamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="profile-settings">
      <div className="settings-sidebar">
        <h3 className="settings-title">Ajustes</h3>
        <ul className="settings-menu">
          <li className={activeSection === 'profile' ? 'active' : ''}>
            <button onClick={() => setActiveSection('profile')}>
              <i className="fas fa-user"></i> Perfil
            </button>
          </li>
          <li className={activeSection === 'security' ? 'active' : ''}>
            <button onClick={() => setActiveSection('security')}>
              <i className="fas fa-lock"></i> Seguridad
            </button>
          </li>
          <li className={activeSection === 'preferences' ? 'active' : ''}>
            <button onClick={() => setActiveSection('preferences')}>
              <i className="fas fa-sliders-h"></i> Preferencias
            </button>
          </li>
          <li className={activeSection === 'subscription' ? 'active' : ''}>
            <button onClick={() => setActiveSection('subscription')}>
              <i className="fas fa-credit-card"></i> Suscripción
            </button>
          </li>
        </ul>
      </div>
      
      <div className="settings-content">
        {successMessage && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <span>{successMessage}</span>
          </div>
        )}
        
        {activeSection === 'profile' && (
          <div className="settings-section">
            <h2 className="section-title">Editar Perfil</h2>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Nombre completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={settings.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="language">Idioma</label>
                <select
                  id="language"
                  name="language"
                  value={settings.language}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              
              <button type="submit" className="btn-primary">
                <i className="fas fa-save"></i> Guardar cambios
              </button>
            </form>
          </div>
        )}
        
        {activeSection === 'security' && (
          <div className="settings-section">
            <h2 className="section-title">Cambiar Contraseña</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Contraseña actual</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={settings.currentPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={settings.newPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <p className="input-hint">La contraseña debe tener al menos 8 caracteres, incluyendo un número y un carácter especial.</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={settings.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <button type="submit" className="btn-primary">
                <i className="fas fa-lock"></i> Actualizar contraseña
              </button>
            </form>
          </div>
        )}
        
        {activeSection === 'preferences' && (
          <div className="settings-section">
            <h2 className="section-title">Preferencias</h2>
            <form onSubmit={handlePreferencesSubmit}>
              <div className="preferences-group">
                <h3 className="subsection-title">Notificaciones</h3>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newsletter}
                      onChange={() => handleCheckboxChange('notifications', 'newsletter')}
                    />
                    <span className="checkbox-text">Recibir newsletter semanal</span>
                  </label>
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newContent}
                      onChange={() => handleCheckboxChange('notifications', 'newContent')}
                    />
                    <span className="checkbox-text">Notificar sobre nuevo contenido</span>
                  </label>
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.recommendations}
                      onChange={() => handleCheckboxChange('notifications', 'recommendations')}
                    />
                    <span className="checkbox-text">Recibir recomendaciones personalizadas</span>
                  </label>
                </div>
              </div>
              
              <div className="preferences-group">
                <h3 className="subsection-title">Privacidad</h3>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.publicProfile}
                      onChange={() => handleCheckboxChange('privacy', 'publicProfile')}
                    />
                    <span className="checkbox-text">Perfil público</span>
                  </label>
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showActivity}
                      onChange={() => handleCheckboxChange('privacy', 'showActivity')}
                    />
                    <span className="checkbox-text">Mostrar mi actividad a otros</span>
                  </label>
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.shareWatchlist}
                      onChange={() => handleCheckboxChange('privacy', 'shareWatchlist')}
                    />
                    <span className="checkbox-text">Compartir mis listas públicamente</span>
                  </label>
                </div>
              </div>
              
              <button type="submit" className="btn-primary">
                <i className="fas fa-save"></i> Guardar preferencias
              </button>
            </form>
          </div>
        )}
        
        {activeSection === 'subscription' && (
          <div className="settings-section">
            <h2 className="section-title">Gestionar Suscripción</h2>
            
            <div className="subscription-info">
              <div className="plan-details">
                <h3 className="current-plan">
                  <i className="fas fa-crown"></i> Plan {userData.plan}
                </h3>
                <p className="plan-expiry">Renovación automática el {new Date(userData.planExpiry).toLocaleDateString('es-ES')}</p>
                
                <div className="plan-features">
                  <h4>Tu plan incluye:</h4>
                  <ul>
                    <li>
                      <i className="fas fa-check"></i>
                      <span>Acceso a todo el catálogo</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span>Visionado HD y 4K</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span>Descargas ilimitadas</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span>Sin publicidad</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="subscription-actions">
                <button className="btn-secondary">
                  <i className="fas fa-sync-alt"></i> Cambiar plan
                </button>
                <button className="btn-secondary">
                  <i className="fas fa-credit-card"></i> Actualizar método de pago
                </button>
                <button className="btn-secondary cancel-subscription">
                  <i className="fas fa-times-circle"></i> Cancelar suscripción
                </button>
              </div>
            </div>
            
            <div className="billing-history">
              <h3 className="subsection-title">Historial de facturación</h3>
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Importe</th>
                    <th>Estado</th>
                    <th>Factura</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01/03/2025</td>
                    <td>Suscripción Premium - Mensual</td>
                    <td>€14.99</td>
                    <td>Pagado</td>
                    <td>
                      <button className="btn-icon">
                        <i className="fas fa-file-pdf"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>01/02/2025</td>
                    <td>Suscripción Premium - Mensual</td>
                    <td>€14.99</td>
                    <td>Pagado</td>
                    <td>
                      <button className="btn-icon">
                        <i className="fas fa-file-pdf"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>01/01/2025</td>
                    <td>Suscripción Premium - Mensual</td>
                    <td>€14.99</td>
                    <td>Pagado</td>
                    <td>
                      <button className="btn-icon">
                        <i className="fas fa-file-pdf"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileSettings;