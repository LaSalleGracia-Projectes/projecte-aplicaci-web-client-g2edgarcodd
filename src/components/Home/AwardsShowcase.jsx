import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/awards.css';

function AwardsShowcase() {
  const [activeAward, setActiveAward] = useState(0);
  const sliderRef = useRef(null);

  // Datos para la sección de premios
  const awardedContent = [
    {
      id: 1,
      title: "La Melodía del Silencio",
      director: "Elena Martínez",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      awards: [
        { name: "Oscar", category: "Mejor Película", year: "2024" },
        { name: "Globo de Oro", category: "Mejor Director", year: "2024" }
      ],
      synopsis: "Un conmovedor relato sobre un músico que pierde su audición y redescubre su pasión a través de la enseñanza a niños sordos.",
      type: "movie"
    },
    {
      id: 2,
      title: "Horizontes Perdidos",
      director: "Carlos Vega",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      awards: [
        { name: "BAFTA", category: "Mejor Fotografía", year: "2024" },
        { name: "Festival de Cannes", category: "Palma de Oro", year: "2023" }
      ],
      synopsis: "Una épica aventura de supervivencia que sigue a un grupo de exploradores perdidos en un remoto desierto tras un accidente aéreo.",
      type: "movie"
    },
    {
      id: 3,
      title: "Crónicas del Amanecer",
      director: "Laura Blanco",
      image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      awards: [
        { name: "Emmy", category: "Mejor Serie Dramática", year: "2023" },
        { name: "Critics Choice", category: "Mejor Elenco", year: "2023" }
      ],
      synopsis: "Serie histórica que narra los acontecimientos que cambiaron el curso de una nación a través de los ojos de una familia aristocrática en decadencia.",
      type: "series"
    }
  ];

  const handleSelect = (index) => {
    setActiveAward(index);

    // Scroll al elemento seleccionado en móvil
    if (sliderRef.current && window.innerWidth < 768) {
      const scrollPosition = index * 120; // Ancho aproximado de cada ítem + margen
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="awards-showcase">
      <div className="section-header">
        <h2>Premiados y Aclamados</h2>
        <p className="section-description">Contenido reconocido por la crítica y premiado internacionalmente</p>
      </div>

      <div className="awards-container">
        <div className="awards-feature">
          <div className="awards-image">
            <img src={awardedContent[activeAward].image} alt={awardedContent[activeAward].title} />
            <div className="awards-overlay"></div>
            <div className="awards-badges">
              {awardedContent[activeAward].awards.map((award, index) => (
                <div key={index} className="award-badge">
                  <div className="award-icon">
                    {award.name === "Oscar" && <i className="fas fa-award"></i>}
                    {award.name === "Globo de Oro" && <i className="fas fa-globe-americas"></i>}
                    {award.name === "BAFTA" && <i className="fas fa-mask"></i>}
                    {award.name === "Emmy" && <i className="fas fa-tv"></i>}
                    {award.name === "Festival de Cannes" && <i className="fas fa-film"></i>}
                    {award.name === "Critics Choice" && <i className="fas fa-star"></i>}
                  </div>
                  <div className="award-info">
                    <span className="award-name">{award.name}</span>
                    <span className="award-category">{award.category}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to={`/${awardedContent[activeAward].type}/${awardedContent[activeAward].id}`} className="watch-now-btn">
              <i className="fas fa-play"></i> Ver Ahora
            </Link>
          </div>
          
          <div className="awards-info">
            <h3>{awardedContent[activeAward].title}</h3>
            <p className="awards-director">Director: {awardedContent[activeAward].director}</p>
            <p className="awards-synopsis">{awardedContent[activeAward].synopsis}</p>
            <div className="awards-type">
              <span className={awardedContent[activeAward].type === 'movie' ? 'movie-badge' : 'series-badge'}>
                {awardedContent[activeAward].type === 'movie' ? 'Película' : 'Serie'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="awards-selector" ref={sliderRef}>
          {awardedContent.map((item, index) => (
            <div 
              key={index}
              className={`award-select-item ${index === activeAward ? 'active' : ''}`}
              onClick={() => handleSelect(index)}
            >
              <div className="award-select-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="award-select-info">
                <h4>{item.title}</h4>
                <span className="award-select-badge">
                  {item.awards[0].name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AwardsShowcase;