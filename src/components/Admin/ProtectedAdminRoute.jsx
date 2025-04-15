import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import AccessDeniedPage from '../../pages/AccessDeniedPage';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  
  // Esperar hasta que se termine de cargar la autenticación
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado pero no es administrador, mostrar página de acceso denegado
  if (!isAdmin) {
    return <AccessDeniedPage />;
  }
  
  // Si es administrador, mostrar el contenido protegido
  return children;
}

export default ProtectedAdminRoute;