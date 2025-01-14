import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/featuredcategories.css';

function FeaturedCategories() {
  // Datos de categorías destacadas
  const featuredCategories = [
    {
      id: 'action',
      name: 'Acción',
      image: 'https://image.tmdb.org/t/p/w1280/628Dep6AxEtDxjZoGP78TsOxYbK.jpg', // Fast & Furious
      count: 148
    },
    {
      id: 'comedy',
      name: 'Comedia',
      image: 'https://image.tmdb.org/t/p/w1280/lNp2Ve5YyGT77k2QHpLwSzQmOHJ.jpg', // Superbad
      count: 256
    },
    {
      id: 'scifi',
      name: 'Ciencia Ficción',
      image: 'https://image.tmdb.org/t/p/w1280/jQgadZIlKMIUQrGjUYkUjCTiXQs.jpg', // Dune
      count: 127
    },
    {
      id: 'horror',
      name: 'Terror',
      image: 'https://image.tmdb.org/t/p/w1280/bvU4dCfWnNYtEIYPx3kZGD1Cl9K.jpg', // The Conjuring
      count: 98
    },
    {
      id: 'animation',
      name: 'Animación',
      image: 'https://image.tmdb.org/t/p/w1280/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg', // Spider-Verse
      count: 104
    }
  ];

  return (
    <section className="featured-categories-section">
      <div className="section-header">
        <h2>Explora por categorías</h2>
        <Link to="/categories" className="see-all">Ver todas las categorías</Link>
      </div>
      
      <div className="featured-categories-container">
        {featuredCategories.map(category => (
          <Link 
            to={`/category/${category.id}`} 
            className="category-card" 
            key={category.id}
          >
            <div className="category-image-container">
              <img 
                src={category.image} 
                alt={category.name} 
                className="category-image" 
              />
              <div className="category-overlay">
                <h3>{category.name}</h3>
                <p>{category.count} títulos</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCategories;