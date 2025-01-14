// src/components/Subscription/Subscription.jsx
import React, { useState } from 'react';
import '../../styles/components/subscription.css';

function Subscription() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    
    // Validate email
    if (!email) {
      setError('Por favor, introduce tu correo electrónico.');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }
    
    // Simulation of successful subscription
    setSubmitted(true);
    
    // Here you would typically make an API call to handle the subscription
    console.log('Subscribed with email:', email);
  };

  return (
    <section className="subscription">
      <div className="subscription-container">
        <h2>Mantente al día</h2>
        <p>Suscríbete a nuestro boletín para recibir notificaciones sobre nuevos lanzamientos y contenido exclusivo.</p>
        
        {submitted ? (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <p>¡Gracias por suscribirte! Pronto recibirás novedades.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? 'error' : ''}
              />
              <button type="submit">
                Suscribirse <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </form>
        )}
        
        <div className="benefits">
          <div className="benefit">
            <i className="fas fa-bell"></i>
            <span>Notificaciones de estrenos</span>
          </div>
          <div className="benefit">
            <i className="fas fa-gift"></i>
            <span>Contenido exclusivo</span>
          </div>
          <div className="benefit">
            <i className="fas fa-tag"></i>
            <span>Ofertas especiales</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Subscription;