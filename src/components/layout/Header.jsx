// src/components/layout/Header.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaUser, FaGlobe } from 'react-icons/fa';
import LanguageSelector from '../ui/LanguageSelector';
import ProfileDropdown from '../ui/ProfileDropdown';
import SearchOverlay from './SearchOverlay';

const Header = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [explorarOpen, setExplorarOpen] = useState(false);

  return (
    <header className="bg-background border-b border-background-light relative z-50">
      <nav className="flex items-center justify-between px-5 py-4 relative z-50">
        <div className="logo">
          <Link href="/" className="text-4xl font-bold uppercase text-white">
            Streamhub
          </Link>
        </div>
        
        <ul className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-5">
          <li className="relative px-3 py-2 transition duration-200 hover:bg-background-light hover:scale-105">
            <Link href="/" className="text-primary">
              Inicio
            </Link>
          </li>
          <li 
            className="relative px-3 py-2 transition duration-200 hover:bg-background-light hover:scale-105"
            onMouseEnter={() => setExplorarOpen(true)}
            onMouseLeave={() => setExplorarOpen(false)}
          >
            <Link href="/explorar" className="text-primary">
              Explorar
            </Link>
            {explorarOpen && (
              <div className="absolute top-full left-0 bg-background-light min-w-[400px] p-5 rounded shadow-lg z-50 grid grid-cols-2 gap-4">
                <div>
                  <Link href="/explorar/peliculas" className="block py-1 px-2 hover:bg-gray-700 rounded">Películas</Link>
                  <Link href="/explorar/series" className="block py-1 px-2 hover:bg-gray-700 rounded">Series</Link>
                </div>
                <div>
                  <Link href="/explorar/accion" className="block py-1 px-2 hover:bg-gray-700 rounded">Acción</Link>
                  <Link href="/explorar/aventura" className="block py-1 px-2 hover:bg-gray-700 rounded">Aventura</Link>
                  <Link href="/explorar/fantasia" className="block py-1 px-2 hover:bg-gray-700 rounded">Fantasía</Link>
                  <Link href="/explorar/ciencia-ficcion" className="block py-1 px-2 hover:bg-gray-700 rounded">Ciencia Ficción</Link>
                  <Link href="/explorar/romance" className="block py-1 px-2 hover:bg-gray-700 rounded">Romance</Link>
                  <Link href="/explorar/drama" className="block py-1 px-2 hover:bg-gray-700 rounded">Drama</Link>
                </div>
              </div>
            )}
          </li>
          <li className="relative px-3 py-2 transition duration-200 hover:bg-background-light hover:scale-105">
            <Link href="/blog" className="text-primary">
              Blog
            </Link>
          </li>
          <li className="relative px-3 py-2 transition duration-200 hover:bg-background-light hover:scale-105">
            <Link href="/foro" className="text-primary">
              Foro
            </Link>
          </li>
        </ul>
        
        <div className="flex items-center gap-4">
          <LanguageSelector />
          
          <div 
            className="cursor-pointer transition duration-200 hover:scale-105"
            onClick={() => setSearchActive(true)}
          >
            <FaSearch className="text-text" />
          </div>
          
          <ProfileDropdown />
        </div>
      </nav>
      
      <SearchOverlay active={searchActive} onClose={() => setSearchActive(false)} />
    </header>
  );
};

export default Header;