// src/components/home/Hero.jsx
import React, { useEffect } from 'react';
import { useSlider } from '../../hooks/useSlider';

const Hero = () => {
  const slides = [
    { id: 1, imageUrl: '/api/placeholder/1200/400' },
    { id: 2, imageUrl: '/api/placeholder/1200/400' },
    { id: 3, imageUrl: '/api/placeholder/1200/400' },
  ];
  
  const { currentIndex, setAutoSlide } = useSlider(slides.length);
  
  useEffect(() => {
    setAutoSlide(true, 3000);
    return () => setAutoSlide(false);
  }, [setAutoSlide]);
  
  return (
    <section className="relative h-[400px] overflow-hidden bg-black border-b border-background-light z-10">
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ width: `${slides.length * 100}%`, transform: `translateX(-${(100 / slides.length) * currentIndex}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id}
            className="relative h-full w-full flex-shrink-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
        ))}
      </div>
      
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-primary px-8 py-4 text-background font-bold text-xl uppercase rounded transition duration-200 hover:scale-105">
        Descubre películas y series
      </div>
    </section>
  );
};

export default Hero;