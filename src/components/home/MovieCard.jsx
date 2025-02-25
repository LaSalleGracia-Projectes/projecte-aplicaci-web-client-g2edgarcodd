// src/components/home/MovieCard.jsx
import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBeating, setIsBeating] = useState(false);
  
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    setIsBeating(true);
  };
  
  const handleAnimationEnd = () => {
    setIsBeating(false);
  };
  
  return (
    <div className="bg-background-light rounded-lg overflow-hidden w-80 transition duration-300 hover:scale-105">
      <div className="relative">
        <img 
          src={movie.imageUrl} 
          alt={movie.title} 
          className={`w-full aspect-video object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-lato text-lg font-bold text-white mb-1">{movie.title}</h3>
        <p className="font-lato text-sm text-text-secondary mb-3">{movie.description}</p>
        
        <FaHeart 
          className={`text-xl cursor-pointer transition-all ${isBeating ? 'animate-heart-beat' : ''} ${isFavorite ? 'text-primary' : 'text-text-secondary'}`}
          onClick={handleFavoriteClick}
          onAnimationEnd={handleAnimationEnd}
        />
      </div>
    </div>
  );
};

export default MovieCard;