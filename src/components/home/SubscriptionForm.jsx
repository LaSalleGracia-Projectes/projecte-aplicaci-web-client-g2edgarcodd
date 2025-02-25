// src/components/home/SubscriptionForm.jsx
import React, { useState } from 'react';

const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementar lógica de suscripción
    console.log('Email suscrito:', email);
    setEmail('');
    alert('¡Gracias por suscribirte!');
  };
  
  return (
    <section className="bg-background-light text-center py-10 px-4">
      <h2 className="text-3xl font-semibold text-white mb-6">Suscríbete para recibir noticias</h2>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder="Introduce tu email"
          className="flex-grow px-4 py-3 text-base border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-primary text-background font-bold uppercase rounded transition duration-200 hover:bg-primary-dark hover:scale-105"
        >
          Suscribirse
        </button>
      </form>
    </section>
  );
};

export default SubscriptionForm;