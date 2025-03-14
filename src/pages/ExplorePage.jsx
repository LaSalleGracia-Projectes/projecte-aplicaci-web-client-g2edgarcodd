import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import StreamingProviders from '../components/Explore/StreamingProviders';
import ExploreFilters from '../components/Explore/ExploreFilters';
import GenreSelector from '../components/Explore/GenreSelector';
import MovieCard from '../components/MovieGrid/MovieCard';
import '../styles/components/explorepage.css';

// Datos simulados para el ejemplo
import moviesData from '../data/movieData';

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProvider, setActiveProvider] = useState('all');
  const [activeGenre, setActiveGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const exploreSectionRef = useRef(null);

  // Géneros disponibles
  const genres = [
    { id: 'all', name: 'Todos' },
    { id: 'action', name: 'Acción' },
    { id: 'comedy', name: 'Comedia' },
    { id: 'drama', name: 'Drama' },
    { id: 'horror', name: 'Terror' },
    { id: 'scifi', name: 'Ciencia Ficción' },
    { id: 'fantasy', name: 'Fantasía' },
    { id: 'romance', name: 'Romance' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'animation', name: 'Animación' }
  ];

  // Proveedores de streaming
  const providers = [
    { id: 'all', name: 'Todos' },
    { id: 'netflix', name: 'Netflix', logo: '/assets/logos/netflix.svg' },
    { id: 'prime', name: 'Prime Video', logo: '/assets/logos/prime.svg' },
    { id: 'hbo', name: 'HBO Max', logo: '/assets/logos/hbo.svg' },
    { id: 'disney', name: 'Disney+', logo: '/assets/logos/disney.svg' },
    { id: 'apple', name: 'Apple TV+', logo: '/assets/logos/apple.svg' },
    { id: 'movistar', name: 'Movistar+', logo: '/assets/logos/movistar.svg' },
    { id: 'filmin', name: 'Filmin', logo: '/assets/logos/filmin.svg' }
  ];

  // Opciones para ordenar
  const sortOptions = [
    { id: 'popular', name: 'Más populares' },
    { id: 'recent', name: 'Más recientes' },
    { id: 'rating', name: 'Mejor calificadas' },
    { id: 'a-z', name: 'A-Z' }
  ];

  useEffect(() => {
    // Simulamos la carga de películas
    const timer = setTimeout(() => {
      setMovies(moviesData);
      setFilteredMovies(moviesData);
      setIsLoading(false);
    }, 1000);

    // Verificar parámetros de URL
    const provider = searchParams.get('provider') || 'all';
    const genre = searchParams.get('genre') || 'all';
    const sort = searchParams.get('sort') || 'popular';

    setActiveProvider(provider);
    setActiveGenre(genre);
    setSortBy(sort);

    // Efecto de aparición al cargar
    document.querySelectorAll('.fade-in-element').forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 100 * index);
    });

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Efecto para el filtrado
  useEffect(() => {
    let result = [...movies];

    // Filtrar por proveedor
    if (activeProvider !== 'all') {
      result = result.filter(movie => movie.providers?.includes(activeProvider));
    }

    // Filtrar por género
    if (activeGenre !== 'all') {
      result = result.filter(movie => movie.genres?.includes(activeGenre));
    }

    // Ordenar películas
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'a-z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // 'popular' por defecto
        result.sort((a, b) => b.popularity - a.popularity);
    }

    // Actualizar URL
    setSearchParams({
      provider: activeProvider,
      genre: activeGenre,
      sort: sortBy
    });

    setFilteredMovies(result);
  }, [activeProvider, activeGenre, sortBy, movies, setSearchParams]);

  const handleProviderChange = (providerId) => {
    setActiveProvider(providerId);
    setCurrentPage(1);
    // Desplazarse suavemente al principio de los resultados
    exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenreChange = (genreId) => {
    setActiveGenre(genreId);
    setCurrentPage(1);
    exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSortChange = (sortId) => {
    setSortBy(sortId);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // Paginación
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: exploreSectionRef.current.offsetTop - 100, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <div className="explore-page">
        {/* Sección Hero con efecto parallax */}
        <section className="explore-hero">
          <div className="parallax-bg"></div>
          <div className="hero-content">
            <h1 className="fade-in-element">Explora todo el catálogo</h1>
            <p className="fade-in-element">Descubre miles de películas y series de todas las plataformas en un solo lugar</p>
          </div>
        </section>

        {/* Proveedores de streaming */}
        <section className="streaming-providers-section fade-in-element">
          <h2>Proveedores de Streaming</h2>
          <StreamingProviders 
            providers={providers} 
            activeProvider={activeProvider} 
            onProviderSelect={handleProviderChange} 
          />
        </section>

        {/* Filtros y selector de géneros */}
        <section className="explore-main" ref={exploreSectionRef}>
          <div className="explore-filters-container fade-in-element">
            <ExploreFilters 
              sortOptions={sortOptions} 
              currentSort={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={toggleViewMode}
            />
          </div>

          <div className="explore-content-container">
            <aside className="genre-sidebar fade-in-element">
              <GenreSelector 
                genres={genres} 
                activeGenre={activeGenre}
                onGenreSelect={handleGenreChange}
              />
            </aside>

            <div className="explore-results">
              {isLoading ? (
                <div className="loading-container fade-in-element">
                  <div className="spinner"></div>
                  <p>Cargando contenido...</p>
                </div>
              ) : (
                <>
                  <div className="results-info fade-in-element">
                    <p>Mostrando <span>{currentMovies.length}</span> de <span>{filteredMovies.length}</span> títulos</p>
                  </div>

                  <div className={`movies-container ${viewMode}`}>
                    {currentMovies.length > 0 ? (
                      currentMovies.map((movie, index) => (
                        <div key={movie.id} className="movie-card-container fade-in-element" style={{ animationDelay: `${index * 0.1}s` }}>
                          <MovieCard 
                            title={movie.title}
                            description={movie.description}
                            image={movie.image}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="no-results fade-in-element">
                        <i className="fas fa-search-minus"></i>
                        <h3>No se encontraron resultados</h3>
                        <p>Intenta modificar los filtros para encontrar lo que buscas.</p>
                      </div>
                    )}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="pagination fade-in-element">
                      <button 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-arrow"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        // Lógica para mostrar solo algunas páginas si hay muchas
                        const pageNum = index + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={index}
                              onClick={() => paginate(pageNum)}
                              className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          (pageNum === currentPage - 2 && currentPage > 3) ||
                          (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                        ) {
                          return <span key={index} className="pagination-dots">...</span>;
                        }
                        return null;
                      })}

                      <button 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-arrow"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default ExplorePage;