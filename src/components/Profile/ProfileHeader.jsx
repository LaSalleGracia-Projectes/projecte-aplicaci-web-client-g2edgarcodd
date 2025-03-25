import React, { useState } from 'react';

function ProfileHeader({ userData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(userData.statusMessage || "¡Hola! Estoy viendo series en Streamhub");
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleStatusSave = () => {
    setIsEditing(false);
    // Aquí iría la lógica para guardar el mensaje en la base de datos
  };
  
  return (
    <div className="profile-header">
      <div className="profile-cover-image" style={userData.coverImage ? {backgroundImage: `linear-gradient(to right, rgba(13, 71, 161, 0.7), rgba(25, 118, 210, 0.7)), url(${userData.coverImage})`} : {}}>
        <div className="edit-cover-button">
          <button aria-label="Cambiar portada">
            <i className="fas fa-camera"></i>
          </button>
        </div>
      </div>
      
      <div className="profile-header-content">
        <div className="profile-avatar-container">
          <img 
            src={userData.avatar} 
            alt={userData.username}
            className="profile-avatar"
          />
          <div className="edit-avatar-button">
            <button aria-label="Cambiar avatar">
              <i className="fas fa-camera"></i>
            </button>
          </div>
        </div>
        
        <div className="profile-header-info">
          <div className="profile-name-container">
            <h1 className="profile-name">{userData.fullName}</h1>
            <span className="profile-username">@{userData.username}</span>
            
            {userData.plan === 'Premium' && (
              <span className="premium-badge">
                <i className="fas fa-crown"></i> Premium
              </span>
            )}
          </div>
          
          <div className="profile-status">
            {!isEditing ? (
              <>
                <p className="status-message">{statusMessage}</p>
                <button className="edit-status-btn" onClick={handleEditToggle}>
                  <i className="fas fa-edit"></i>
                </button>
              </>
            ) : (
              <div className="status-edit-container">
                <input 
                  type="text" 
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  className="status-input"
                  maxLength="100"
                  placeholder="¿Qué estás viendo?"
                  autoFocus
                />
                <button className="save-status-btn" onClick={handleStatusSave}>
                  <i className="fas fa-check"></i>
                </button>
                <button className="cancel-edit-btn" onClick={handleEditToggle}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userData.watchTime}</span>
              <span className="stat-label">horas vistas</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.favorites ? userData.favorites.length : 0}</span>
              <span className="stat-label">favoritos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.customLists ? userData.customLists.length : 0}</span>
              <span className="stat-label">listas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;