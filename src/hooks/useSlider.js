// src/hooks/useSlider.js
import { useState, useEffect, useCallback } from 'react';

export const useSlider = (totalSlides) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlideInterval, setAutoSlideInterval] = useState(null);
  
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);
  
  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);
  
  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);
  
  const setAutoSlide = useCallback((active, interval = 5000) => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    
    if (active) {
      const id = setInterval(nextSlide, interval);
      setAutoSlideInterval(id);
    } else {
      setAutoSlideInterval(null);
    }
  }, [nextSlide, autoSlideInterval]);
  
  useEffect(() => {
    return () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    };
  }, [autoSlideInterval]);
  
  return {
    currentIndex,
    nextSlide,
    prevSlide,
    goToSlide,
    setAutoSlide,
  };
};