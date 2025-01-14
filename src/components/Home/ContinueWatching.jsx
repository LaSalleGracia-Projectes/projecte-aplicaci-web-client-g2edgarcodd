import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/continuewatching.css';

function ContinueWatching() {
  // Datos simulados para "Continuar viendo"
  const continueWatchingItems = [
    {
      id: 1,
      title: "The Witcher",
      image: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04QXh4.jpg",
      progress: 65,
      remainingTime: "32 min restantes",
      episode: "T2:E5",
      type: "series"
    },
    {
      id: 2,
      title: "Dune",
      image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      progress: 45,
      remainingTime: "1h 15min restantes",
      type: "movie"
    },
    {
      id: 3,
      title: "Stranger Things",
      image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      progress: 80,
      remainingTime: "12 min restantes",
      episode: "T4:E3",
      type: "series"
    },
    {
      id: 4,
      title: "The Batman",
      image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      progress: 30,
      remainingTime: "1h 52min restantes",
      type: "movie"
    }
  ];

  return (
    <section className="continue-watching-section">
      <div className="section-header">
        <h2>Continuar viendo</h2>
        <Link to="/my-list" className="see-all">Ver todo</Link>
      </div>
      
      <div className="continue-watching-container">
        {continueWatchingItems.map(item => (
          <Link 
            to={`/${item.type}/${item.id}`} 
            className="continue-item" 
            key={item.id}
          >
            <div className="continue-image-container">
              <img src={item.image} alt={item.title} className="continue-image" />
              <div className="continue-overlay">
                <button className="play-btn">
                  <i className="fas fa-play"></i>
                </button>
                {item.episode && (
                  <span className="episode-badge">{item.episode}</span>
                )}
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="continue-info">
              <h3>{item.title}</h3>
              <p>{item.remainingTime}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ContinueWatching;