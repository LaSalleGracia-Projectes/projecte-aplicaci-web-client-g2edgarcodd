import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener datos del usuario desde la API
  const fetchUserInfo = async (userId, token) => {
    try {
      // Crear los parámetros para la URL
      const params = new URLSearchParams({
        user_id: userId,
      }).toString();

      const response = await fetch(
        `http://25.17.74.119:8000/api/getUser?${params}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Actualizar información del usuario
        setUser(data.data);

        // Comprobar si el usuario es admin
        setIsAdmin(data.data.is_admin === 1);

        return data.data;
      } else {
        console.error("Error al obtener información del usuario:", data);
        return null;
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      return null;
    }
  };

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      const userId = localStorage.getItem("user_id");

      if (token && userId) {
        // Obtener datos del usuario
        const userData = await fetchUserInfo(userId, token);

        if (userData) {
          // Actualizar estado solo si obtuvimos datos válidos
          setIsAuthenticated(true);
          setUser(userData);
          setIsAdmin(userData.is_admin === 1);
        } else {
          // Si hay error obteniendo los datos, cerramos sesión
          logout();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Verificar si ya tenemos los datos en localStorage
      const token = localStorage.getItem("auth_token");
      const userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        console.error("Datos de autenticación no encontrados");
        return false;
      }

      // Obtener información del usuario con el token almacenado
      const userData = await fetchUserInfo(userId, token);

      if (userData) {
        // Actualizar estado de autenticación
        setIsAuthenticated(true);
        setUser(userData);
        setIsAdmin(userData.is_admin === 1);
        return true;
      } else {
        console.error("No se pudieron obtener datos del usuario");
        logout(); // Limpiar datos si hay error
        return false;
      }
    } catch (error) {
      console.error("Error en login del contexto:", error);
      return false;
    }
  };

  const logout = () => {
    // Eliminar tokens y datos de sesión
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user_id");

    // Resetear estado
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        login,
        logout,
        loading,
        fetchUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
