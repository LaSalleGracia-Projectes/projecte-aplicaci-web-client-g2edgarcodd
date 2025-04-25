import React from 'react';

const ContactMap = () => {
  const handleDirectionsClick = () => {
    window.open("https://www.google.com/maps/dir//Pla%C3%A7a+del+Nord,+14,+08024+Barcelona/@41.4084014,2.1518638,17z/", "_blank");
  };
  
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'StreamHub Barcelona',
        text: 'Visítanos en nuestra sede principal en Gràcia',
        url: 'https://goo.gl/maps/HuFLvDtdrMj91Scy7'
      }).catch(err => console.log('Error al compartir:', err));
    } else {
      // Fallback para navegadores que no soportan Web Share API
      alert("Copia este enlace: https://goo.gl/maps/HuFLvDtdrMj91Scy7");
    }
  };

  return (
    <div className="map-container">
      <div className="map-info-overlay">
        <div className="map-location-details">
          <h3 className="map-location-title">
            <i className="fas fa-map-marker-alt"></i>
            StreamHub Barcelona
          </h3>
          <p className="map-location-address">
            Plaça del Nord, 14<br />
            Gràcia, 08024 Barcelona
          </p>
        </div>
        
        <div className="map-hours">
          <h4 className="map-hours-title">
            <i className="far fa-clock"></i>
            Horario
          </h4>
          <p className="map-hours-item">Lun - Vie: 9:00 - 18:00</p>
          <p className="map-hours-item">Sábados: 10:00 - 14:00</p>
          <p className="map-hours-item">Domingos: Cerrado</p>
        </div>
      </div>
      
      <div className="map-view">
        <iframe
          title="Ubicación de StreamHub"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2992.4855760184213!2d2.1544387!3d41.408404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2980947f289%3A0x9f877fab287a260d!2sPla%C3%A7a%20del%20Nord%2C%2014%2C%2008024%20Barcelona!5e0!3m2!1ses!2ses!4v1712179185053!5m2!1ses!2ses"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      
      <div className="map-actions">
        <button 
          className="map-action-button" 
          onClick={handleDirectionsClick}
        >
          <i className="fas fa-directions"></i>
          <span>Cómo llegar</span>
        </button>
        
        <button 
          className="map-action-button"
          onClick={handleShareClick}
        >
          <i className="fas fa-share-alt"></i>
          <span>Compartir</span>
        </button>
      </div>
    </div>
  );
};

export default ContactMap;