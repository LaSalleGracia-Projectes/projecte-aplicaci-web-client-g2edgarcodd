import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/newreleases.css';

function NewReleases() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Datos simulados para nuevos lanzamientos
  const newReleases = [
    {
      id: 1,
      title: "Dune: Parte Dos",
      image: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
      year: "2024",
      rating: 8.5,
      genre: "Ciencia Ficción",
      category: "movies",
      isNew: true
    },
    {
      id: 2,
      title: "El Pingüino",
      image: "https://image.tmdb.org/t/p/w500/rKmYKuxgfX3Z5YbNvwvbaDOZe7T.jpg",
      year: "2024",
      rating: 8.3,
      genre: "Crimen",
      category: "series",
      isNew: true
    },
    {
      id: 3,
      title: "Challengers",
      image: "https://image.tmdb.org/t/p/w500/wrpH0z2oU7egQcC4q3oKDzLiZbX.jpg",
      year: "2024",
      rating: 7.8,
      genre: "Drama",
      category: "movies",
      isNew: true
    },
    {
      id: 4,
      title: "Fallout",
      image: "https://image.tmdb.org/t/p/w500/6OfQqNIbLgXFtO9JSEUtUp7Gsv.jpg",
      year: "2024",
      rating: 8.2,
      genre: "Acción",
      category: "series",
      isNew: false
    },
    {
      id: 5,
      title: "Furiosa",
      image: "https://image.tmdb.org/t/p/w500/kdMjBDI7wyHfoZOQB7asw6UY8J1.jpg",
      year: "2024",
      rating: 7.9,
      genre: "Acción",
      category: "movies",
      isNew: true
    },
    {
      id: 6,
      title: "Balada de pájaros cantores y serpientes",
      image: "https://image.tmdb.org/t/p/w500/t7XpwGqbxD892K4ZlGcXLPakHl.jpg",
      year: "2023",
      rating: 7.2,
      genre: "Aventura",
      category: "movies",
      isNew: false
    },
    {
      id: 7,
      title: "La Casa del Dragón",
      image: "https://image.tmdb.org/t/p/w500/xiB0hsxMpgxpJfA1nFesxlF1XLZ.jpg",
      year: "2024",
      rating: 8.9,
      genre: "Fantasía",
      category: "series",
      isNew: true
    },
    {
      id: 8,
      title: "The Acolyte",
      image: "https://image.tmdb.org/t/p/w500/1Yg7Cz4WZZ3SZvnKUEpQiAXzYBJ.jpg",
      year: "2024",
      rating: 6.8,
      genre: "Ciencia Ficción",
      category: "series",
      isNew: false
    }
  ];

  // Filtrar por categoría
  const filteredReleases = activeCategory === 'all' 
    ? newReleases 
    : newReleases.filter(item => item.category === activeCategory);

  return (
    <section className="new-releases-section">
      <div className="section-header">
        <h2>Nuevos lanzamientos</h2>
        
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            Todo
          </button>
          <button 
            className={`filter-tab ${activeCategory === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveCategory('movies')}
          >
            Películas
          </button>
          <button 
            className={`filter-tab ${activeCategory === 'series' ? 'active' : ''}`}
            onClick={() => setActiveCategory('series')}
          >
            Series
          </button>
        </div>
      </div>
      
      <div className="new-releases-container">
        {filteredReleases.map(item => (
          <Link 
            to={`/${item.category === 'movies' ? 'movie' : 'series'}/${item.id}`} 
            className="release-item" 
            key={item.id}
          >
            <div className="release-image-container">
              <img src={item.image} alt={item.title} className="release-image" />
              
              {item.isNew && <span className="new-badge">Nuevo</span>}
              
              <div className="release-overlay">
                <div className="release-actions">
                  <button className="play-now-btn">
                    <i className="fas fa-play"></i>
                  </button>
                  <button className="add-list-btn">
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                
                <div className="release-meta">
                  <span className="release-year">{item.year}</span>
                  <span className="release-rating">
                    <i className="fas fa-star"></i>
                    {item.rating}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="release-info">
              <h3 className="release-title">{item.title}</h3>
              <span className="release-genre">{item.genre}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default NewReleases;