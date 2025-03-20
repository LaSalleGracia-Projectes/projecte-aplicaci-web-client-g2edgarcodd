import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import SearchOverlay from './SearchOverlay';
import logoImage from '../../assets/streamhub.png'; 
import '../../styles/components/header.css';

function Header() {
  const [searchActive, setSearchActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  
  // Gestionar scroll para añadir efectos visuales
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== headerScrolled) {
        setHeaderScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerScrolled]);
  
  const toggleSearch = () => {
    setSearchActive(!searchActive);
    // Bloquear el scroll cuando el overlay esté abierto
    if (!searchActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <header className={headerScrolled ? 'scrolled' : ''}>
      <Navbar 
        toggleSearch={toggleSearch} 
        logo={logoImage} 
        isScrolled={headerScrolled}
      />
      <SearchOverlay active={searchActive} toggleSearch={toggleSearch} />
    </header>
  );
}

export default Header;