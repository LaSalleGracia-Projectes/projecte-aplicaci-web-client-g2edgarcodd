import React from 'react';
import { Link } from 'react-router-dom';

function AccountSummary({ userData }) {
  // Formatear la fecha en formato legible
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Calcular días restantes hasta expiración de la suscripción
  const calculateRemainingDays = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = Math.abs(expiry - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para obtener color según el género
  const getGenreColor = (genre, alpha = 1) => {
    const colors = {
      'Acción': `rgba(229, 57, 53, ${alpha})`,
      'Ciencia Ficción': `rgba(25, 118, 210, ${alpha})`,
      'Suspense': `rgba(142, 36, 170, ${alpha})`,
      'Drama': `rgba(255, 179, 0, ${alpha})`,
      'Comedia': `rgba(67, 160, 71, ${alpha})`,
      'Terror': `rgba(109, 76, 65, ${alpha})`,
      'Aventura': `rgba(0, 137, 123, ${alpha})`,
      'Animación': `rgba(251, 140, 0, ${alpha})`,
      'Fantasía': `rgba(124, 179, 66, ${alpha})`
    };
    
    return colors[genre] || `rgba(96, 125, 139, ${alpha})`; // Gris por defecto
  };

  const remainingDays = calculateRemainingDays(userData.planExpiry);

  return (
    <div className="account-summary animate-fade-in">
      <div className="summary-section membership-info">
        <h2 className="section-title">Información de tu cuenta</h2>
        
        <div className="info-group">
          <div className="info-row">
            <span className="info-label">Correo electrónico:</span>
            <span className="info-value">{userData.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Miembro desde:</span>
            <span className="info-value">{formatDate(userData.memberSince)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Tipo de plan:</span>
            <span className="info-value">
              <span className={`plan-badge ${userData.plan.toLowerCase()}`}>
                {userData.plan === 'Premium' ? (
                  <><i className="fas fa-crown"></i> Premium</>
                ) : userData.plan === 'Standard' ? (
                  <><i className="fas fa-check"></i> Estándar</>
                ) : (
                  <><i className="fas fa-star"></i> Básico</>
                )}
              </span>
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Vence en:</span>
            <span className="info-value">
              <span className="expiry-date">{formatDate(userData.planExpiry)}</span>
              <span className="days-remaining">({remainingDays} días)</span>
            </span>
          </div>
        </div>
        
        <div className="action-buttons">
          <Link to="/profile/update" className="btn-primary">
            <i className="fas fa-pencil-alt"></i> Editar perfil
          </Link>
          <Link to="/subscription" className="btn-secondary">
            <i className="fas fa-crown"></i> Gestionar suscripción
          </Link>
        </div>
      </div>

      <div className="summary-section viewing-stats">
        <h2 className="section-title">Estadísticas de visualización</h2>
        
        <div className="stats-highlight-row">
          <div className="stats-highlight-card">
            <div className="stats-highlight-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stats-highlight-content">
              <div className="stats-highlight">{userData.watchTime}</div>
              <div className="stats-highlight-label">Horas totales</div>
            </div>
          </div>
          
          <div className="stats-highlight-card">
            <div className="stats-highlight-icon">
              <i className="fas fa-film"></i>
            </div>
            <div className="stats-highlight-content">
              <div className="stats-highlight">{userData.totalMovies}</div>
              <div className="stats-highlight-label">Películas</div>
            </div>
          </div>
          
          <div className="stats-highlight-card">
            <div className="stats-highlight-icon">
              <i className="fas fa-tv"></i>
            </div>
            <div className="stats-highlight-content">
              <div className="stats-highlight">{userData.totalSeries}</div>
              <div className="stats-highlight-label">Series</div>
            </div>
          </div>
          
          <div className="stats-highlight-card">
            <div className="stats-highlight-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stats-highlight-content">
              <div className="stats-highlight">{userData.totalEpisodes}</div>
              <div className="stats-highlight-label">Episodios</div>
            </div>
          </div>
        </div>

        <div className="stats-dashboard">
          {/* Géneros más vistos */}
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-chart-pie"></i>
                Géneros más vistos
              </h3>
            </div>
            <div className="stats-card-body">
              <div className="genre-stats-list">
                {userData.genreStats.map((genre) => (
                  <div key={genre.name} className="genre-stats-item">
                    <div className="genre-stats-info">
                      <span className="genre-name">{genre.name}</span>
                      <span className="genre-percentage">{genre.percentage}%</span>
                    </div>
                    <div className="genre-progress-bar">
                      <div 
                        className="genre-progress" 
                        style={{ 
                          width: `${genre.percentage}%`,
                          backgroundColor: getGenreColor(genre.name)
                        }}
                      ></div>
                    </div>
                    <div className="genre-hours">{genre.hours} horas</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visualización por dispositivo */}
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-mobile-alt"></i>
                Visualización por dispositivo
              </h3>
            </div>
            <div className="stats-card-body">
              <div className="device-stats-list">
                {userData.watchByDevice.map((device) => (
                  <div key={device.device} className="device-stats-item">
                    <div className="device-icon">
                      <i className={`fas fa-${
                        device.device === 'TV' ? 'tv' : 
                        device.device === 'Smartphone' ? 'mobile-alt' : 
                        device.device === 'Tablet' ? 'tablet-alt' : 
                        'laptop'
                      }`}></i>
                    </div>
                    <div className="device-info">
                      <div className="device-name">{device.device}</div>
                      <div className="device-progress-bar">
                        <div 
                          className="device-progress" 
                          style={{ 
                            width: `${device.percentage}%`,
                            backgroundColor: 
                              device.device === 'TV' ? 'rgba(229, 57, 53, 0.8)' : 
                              device.device === 'Smartphone' ? 'rgba(25, 118, 210, 0.8)' :
                              device.device === 'Tablet' ? 'rgba(124, 179, 66, 0.8)' :
                              'rgba(255, 179, 0, 0.8)'
                          }}
                        ></div>
                      </div>
                      <div className="device-stats">
                        <span className="device-hours">{device.hours}h</span>
                        <span className="device-percentage">{device.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tendencias mensuales */}
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-calendar-alt"></i>
                Tendencias mensuales
              </h3>
            </div>
            <div className="stats-card-body">
              <div className="monthly-stats">
                {userData.watchByMonth.map((month) => (
                  <div key={month.month} className="monthly-stat-item">
                    <div className="month-label">{month.month}</div>
                    <div className="month-bar-container">
                      <div 
                        className="month-bar" 
                        style={{ 
                          height: `${(month.hours / Math.max(...userData.watchByMonth.map(m => m.hours))) * 100}%`,
                          backgroundColor: 'rgba(251, 197, 0, 0.8)'
                        }}
                      ></div>
                    </div>
                    <div className="month-hours">{month.hours}h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Horas del día */}
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-clock"></i>
                Horas del día
              </h3>
            </div>
            <div className="stats-card-body">
              <div className="time-of-day-stats">
                {userData.watchByTimeOfDay.map((time) => (
                  <div key={time.time} className="time-stat-item">
                    <div className="time-icon">
                      <i className={`fas fa-${
                        time.time === 'Mañana' ? 'sun' : 
                        time.time === 'Tarde' ? 'cloud-sun' : 
                        'moon'
                      }`}></i>
                    </div>
                    <div className="time-info">
                      <div className="time-name">{time.time}</div>
                      <div className="time-progress-bar">
                        <div 
                          className="time-progress" 
                          style={{ 
                            width: `${time.percentage}%`,
                            backgroundColor: 
                              time.time === 'Mañana' ? 'rgba(255, 179, 0, 0.7)' : 
                              time.time === 'Tarde' ? 'rgba(251, 140, 0, 0.7)' :
                              'rgba(106, 27, 154, 0.7)'
                          }}
                        ></div>
                      </div>
                      <div className="time-stats">
                        <span className="time-hours">{time.hours}h</span>
                        <span className="time-percentage">{time.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="favorite-genres-container">
          <h3 className="chart-title">Tus géneros favoritos</h3>
          <div className="genres-container">
            {userData.favoriteGenres.map(genre => (
              <div 
                key={genre} 
                className="genre-chip" 
                style={{ 
                  borderColor: getGenreColor(genre),
                  background: getGenreColor(genre, 0.1)
                }}
              >
                {genre}
              </div>
            ))}
          </div>
        </div>
        
        <div className="stats-links">
          <Link to="/favorites" className="btn-secondary">
            <i className="fas fa-heart"></i> Ver mis favoritos
          </Link>
          <Link to="/watchlist" className="btn-secondary">
            <i className="fas fa-list"></i> Ver mis listas
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccountSummary;