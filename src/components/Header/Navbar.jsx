import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ toggleSearch, logo, isScrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState({ 
    code: 'es', 
    name: 'Español', 
    flag: 'es' 
  });
  const location = useLocation();
  const navRef = useRef(null);
  
  // Cerrar el menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);
  
  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (activeDropdown) setActiveDropdown(null);
  };
  
  // Función mejorada para controlar los desplegables
  const toggleDropdown = (dropdown, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("Toggling dropdown:", dropdown, "Current:", activeDropdown);
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };
  
  const languages = [
    { code: 'es', name: 'Español', flag: 'es' },
    { code: 'ca', name: 'Catalán', flag: 'cat' },
    { code: 'en', name: 'Inglés', flag: 'gb' }
  ];
  
  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    setActiveDropdown(null);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} ref={navRef}>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Streamhub" />
          <span>Streamhub</span>
        </Link>
      </div>
      
      <div 
        className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={toggleMobileMenu}
      >
        <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </div>
      
      <ul className={`nav-center ${mobileMenuOpen ? 'mobile-active' : ''}`}>
        <li className={isActive('/')}>
          <Link to="/">Inicio</Link>
        </li>
        <li className={`has-dropdown ${activeDropdown === 'explorar' ? 'active' : ''}`}>
          <Link to="#" onClick={(e) => toggleDropdown('explorar', e)}>
            Explorar
          </Link>
          <div className={`dropdown explorar ${activeDropdown === 'explorar' ? 'visible' : ''}`}>
            <div className="column">
              <li><Link to="/peliculas">Películas</Link></li>
              <li><Link to="/series">Series</Link></li>
            </div>
            <div className="column">
              <li><Link to="/accion">Acción</Link></li>
              <li><Link to="/aventura">Aventura</Link></li>
              <li><Link to="/fantasia">Fantasía</Link></li>
              <li><Link to="/ciencia-ficcion">Ciencia Ficción</Link></li>
              <li><Link to="/romance">Romance</Link></li>
              <li><Link to="/drama">Drama</Link></li>
            </div>
          </div>
        </li>
        <li className={isActive('/blog')}>
          <Link to="/blog">Blog</Link>
        </li>
        <li className={isActive('/forum')}>
          <Link to="/forum">Foro</Link>
        </li>
      </ul>
      
      <div className="nav-right">
        {/* COMPONENTE DE IDIOMA MEJORADO */}
        <div className={`language ${activeDropdown === 'language' ? 'active' : ''}`}>
          <button 
            onClick={(e) => toggleDropdown('language', e)} 
            className="language-selector"
            aria-label="Seleccionar idioma"
            type="button"
          >
            <i className={`flag-icon flag-icon-${currentLanguage.flag}`}></i>
            <span>{currentLanguage.name}</span>
          </button>
          {activeDropdown === 'language' && (
            <div className="dropdown-content language-dropdown visible">
              {languages.map(lang => (
                <div 
                  key={lang.code} 
                  className="language-item"
                  onClick={() => changeLanguage(lang)}
                >
                  <i className={`flag-icon flag-icon-${lang.flag}`}></i>
                  <span>{lang.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="search-btn" onClick={toggleSearch}>
          <i className="fas fa-search"></i>
        </div>
        
        {/* COMPONENTE DE PERFIL MEJORADO */}
        <div className={`profile ${activeDropdown === 'profile' ? 'active' : ''}`}>
          <button 
            onClick={(e) => toggleDropdown('profile', e)} 
            className="profile-icon"
            aria-label="Menú de perfil"
            type="button"
          >
            <i className="fas fa-user"></i>
          </button>
          {activeDropdown === 'profile' && (
            <div className="dropdown-content profile-dropdown visible">
              <div className="profile-item">
                <Link to="/profile">Mi perfil</Link>
              </div>
              <div className="profile-item">
                <Link to="/favorites">Favoritos</Link>
              </div>
              <div className="profile-item">
                <Link to="/lists">Mis listas</Link>
              </div>
              <div className="profile-item">
                <Link to="/settings">Opciones</Link>
              </div>
              <div className="profile-item">
                <Link to="/logout">Desconectar</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;