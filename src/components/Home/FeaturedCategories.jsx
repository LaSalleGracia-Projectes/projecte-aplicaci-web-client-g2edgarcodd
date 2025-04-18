import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { getImageUrl } from "../../utils/api";
import "../../styles/components/featuredcategories.css";

function FeaturedCategories({ movies = [], genres = [] }) {
  const { t } = useLanguage();

  // Constantes para géneros destacados que queremos mostrar si están disponibles
  const FEATURED_GENRE_IDS = [28, 35, 878, 27, 16];

  // Preparamos las categorías destacadas basadas en los géneros disponibles de la API
  const featuredCategories = useMemo(() => {
    // Imágenes de fallback para cada género por si no encontramos películas con backdrop
    const fallbackImages = {
      28: "/628Dep6AxEtDxjZoGP78TsOxYbK.jpg", // Acción
      35: "/lNp2Ve5YyGT77k2QHpLwSzQmOHJ.jpg", // Comedia
      878: "/jQgadZIlKMIUQrGjUYkUjCTiXQs.jpg", // Ciencia ficción
      27: "/bvU4dCfWnNYtEIYPx3kZGD1Cl9K.jpg", // Terror
      16: "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg", // Animación
      // Otros géneros populares como fallback
      12: "/5rrGVmRUuCKVbqUu41XIWTXJmNA.jpg", // Aventura
      18: "/suaEOtk1N1sgg2MTM7oZd2cfRp3.jpg", // Drama
      14: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg", // Fantasía
      80: "/eSVu1FvGPy86TDo4hQbpuHx55DJ.jpg", // Crimen
      10749: "/6CyIgLOLcpYpXYxj8lSLK1R6MpB.jpg", // Romance
    };

    // Seleccionar los géneros disponibles y priorizarlos según FEATURED_GENRE_IDS
    const availableGenres = genres.filter(
      (genre) =>
        FEATURED_GENRE_IDS.includes(genre.id) ||
        Object.keys(fallbackImages).includes(String(genre.id))
    );

    // Ordenar para priorizar los géneros destacados
    const sortedGenres = [...availableGenres].sort((a, b) => {
      const aIndex = FEATURED_GENRE_IDS.indexOf(a.id);
      const bIndex = FEATURED_GENRE_IDS.indexOf(b.id);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    // Tomar los primeros 5 géneros (o menos si no hay suficientes)
    const selectedGenres = sortedGenres.slice(0, 5);

    // Crear las categorías con información completa
    return selectedGenres.map((genre) => {
      // Filtrar películas por el género actual
      const moviesInGenre = movies.filter(
        (movie) => movie.genre_ids && movie.genre_ids.includes(genre.id)
      );

      // Encontrar una película con imagen de fondo para la categoría
      const movieWithBackdrop = moviesInGenre.find(
        (movie) => movie.backdrop_path
      );

      // Preparar información para esta categoría
      return {
        id: genre.id,
        name: genre.name,
        // Usar la imagen de una película real si existe, o recurrir a la imagen de fallback
        backdropPath:
          movieWithBackdrop && movieWithBackdrop.backdrop_path
            ? movieWithBackdrop.backdrop_path
            : fallbackImages[genre.id] || fallbackImages[28],
        count: moviesInGenre.length || 0,
      };
    });
  }, [movies, genres]);

  return (
    <section className="featured-categories-section">
      <div className="section-header">
        <h2>{t("home.popularCategories")}</h2>
        <Link to="/categories" className="see-all">
          {t("common.seeMore")}
        </Link>
      </div>

      <div className="featured-categories-container">
        {featuredCategories.map((category) => (
          <Link
            to={`/category/${category.id}`}
            className="category-card"
            key={category.id}
          >
            <div className="category-image-container">
              <img
                src={getImageUrl(category.backdropPath, "large", "backdrop")}
                alt={category.name}
                className="category-image"
              />
              <div className="category-overlay">
                <h3>{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCategories;
