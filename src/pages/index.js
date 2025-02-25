
// src/pages/index.js
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Top10Slider from '../components/home/Top10Slider';
import MovieCard from '../components/home/MovieCard';
import SubscriptionForm from '../components/home/SubscriptionForm';
/* import { moviesData } from '../data/movies'; */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* <Top10Slider movies={moviesData.slice(0, 10)} /> */}
        
        <section className="py-12 px-4">
          <h2 className="text-3xl font-semibold text-center text-white mb-8">
            Seleccionados para ti
          </h2>
          
          {/* <div className="flex flex-wrap justify-center gap-6 max-w-screen-xl mx-auto">
            {moviesData.slice(0, 4).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div> */}
        </section>
        
        <SubscriptionForm />
      </main>
      
      <Footer />
    </div>
  );
}