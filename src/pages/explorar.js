// src/pages/explorar.js
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { moviesData } from '../data/movies';
import MovieCard from '../components/home/MovieCard';

export default function Explorar() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Explorar</h1>
        
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Categorías</h2>
            <div className="flex flex-wrap gap-4">
              {['Acción', 'Aventura', 'Fantasía', 'Ciencia Ficción', 'Romance', 'Drama'].map((category) => (
                <a 
                  key={category} 
                  href={`/explorar/${category.toLowerCase()}`}
                  className="px-4 py-2 bg-background-light rounded-full hover:bg-primary hover:text-background transition duration-200"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Películas populares</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {moviesData.slice(0, 8).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}