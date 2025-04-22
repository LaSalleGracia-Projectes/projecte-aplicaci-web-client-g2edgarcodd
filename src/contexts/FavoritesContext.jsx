import React, { createContext, useState, useContext, useEffect } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos del localStorage al iniciar
  useEffect(() => {
    const storedFavorites = localStorage.getItem("streamhub_favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
        setFavorites([]);
      }
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("streamhub_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Verificar si un elemento está en favoritos
  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  // Añadir un elemento a favoritos
  const addFavorite = (item) => {
    if (!isFavorite(item.id)) {
      setFavorites((prev) => [...prev, item]);
    }
  };

  // Eliminar un elemento de favoritos
  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  // Alternar el estado de favoritos (añadir o quitar)
  const toggleFavorite = (item) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
