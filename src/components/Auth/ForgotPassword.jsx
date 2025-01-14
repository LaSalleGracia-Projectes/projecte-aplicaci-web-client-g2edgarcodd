// src/components/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación básica
    if (!email.trim()) {
      setError('Por favor, introduce tu correo electrónico');
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Correo electrónico inválido');
      setIsLoading(false);
      return;
    }

    // Simulación de envío
    setTimeout(() => {
      console.log('Enviando correo de recuperación a:', email);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {!isSubmitted ? (
          <>
            <div className="auth-header">
              <h2>Recuperar contraseña</h2>
              <p>Te enviaremos un correo para restablecer tu contraseña</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Escribe tu correo electrónico"
                  />
                </div>
              </div>

              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading-spinner">
                    <i className="fas fa-circle-notch fa-spin"></i>
                  </span>
                ) : (
                  'Enviar correo de recuperación'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="success-container">
            <div className="success-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <h2>¡Correo enviado!</h2>
            <p>
              Hemos enviado un correo a <strong>{email}</strong> con instrucciones para restablecer tu contraseña.
            </p>
            <p className="check-spam">
              Si no lo encuentras, revisa tu carpeta de spam o correo no deseado.
            </p>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login">Volver a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;