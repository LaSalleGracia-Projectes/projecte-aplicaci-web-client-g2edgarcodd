// src/components/home/Top10Slider.jsx
import React, { useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaBookmark } from 'react-icons/fa';

const Top10Slider = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState({});
  const sliderRef = useRef(null);
  
  const itemWidth = 220; // Ancho aproximado de cada item (card + espacio)
  const visibleItems = 5; // Número de items visibles a la vez
  const maxIndex = Math.max(0, movies.length - visibleItems);
  
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };
  
  const toggleBookmark = (id) => {
    setBookmarks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <div className="relative max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center text-white mb-8">Top 10 Películas</h2>
      
      <div className="relative overflow-hidden">
        {currentIndex > 0 && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
            onClick={handlePrev}
          >
            <FaChevronLeft />
          </button>
        )}
        
        <div 
          ref={sliderRef}
          className="flex gap-10 transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * itemWidth}px)` }}
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="relative min-w-[180px]">
              <span className="absolute text-[80px] font-bold text-black/15 pointer-events-none left-[-30px] top-1/2 -translate-y-1/2 z-0">
                {index + 1}
              </span>
              
              <div className="relative w-[180px] h-[250px] bg-white rounded overflow-hidden shadow-md z-10">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
                
                <FaBookmark 
                  className={`absolute top-2 right-2 text-xl cursor-pointer transition-all ${
                    bookmarks[movie.id] ? 'text-primary' : 'text-gray-400'
                  } hover:scale-110`}
                  onClick={() => toggleBookmark(movie.id)}
                />
                
                <div className="absolute bottom-2 left-2 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(movie.rating) ? 
                        '★' : 
                        i < movie.rating ? 
                          '★½' : 
                          '☆'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {currentIndex < maxIndex && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
            onClick={handleNext}
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Top10Slider;