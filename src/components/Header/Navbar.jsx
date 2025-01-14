import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ toggleSearch, logo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Streamhub" />
          <span>Streamhub</span>
        </Link>
      </div>
      
      <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <i className="fas fa-bars"></i>
      </div>
      
      <ul className={`nav-center ${mobileMenuOpen ? 'mobile-active' : ''}`}>
        <li><Link to="/">Inicio</Link></li>
        <li className="has-dropdown">
          <Link to="#">Explorar</Link>
          <ul className="dropdown explorar">
            <div className="column">
              <li><Link to="#">Películas</Link></li>
              <li><Link to="#">Series</Link></li>
            </div>
            <div className="column">
              <li><Link to="#">Acción</Link></li>
              <li><Link to="#">Aventura</Link></li>
              <li><Link to="#">Fantasía</Link></li>
              <li><Link to="#">Ciencia Ficción</Link></li>
              <li><Link to="#">Romance</Link></li>
              <li><Link to="#">Drama</Link></li>
            </div>
          </ul>
        </li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/forum">Foro</Link></li>
      </ul>
      
      <div className="nav-right">
        <div className="language">
          <i className="fas fa-globe"></i> <span>Español</span>
          <ul className="dropdown-content">
            <li><Link to="#">Español</Link></li>
            <li><Link to="#">Catalán</Link></li>
            <li><Link to="#">Inglés</Link></li>
          </ul>
        </div>
        <div className="search-btn" onClick={toggleSearch}>
          <i className="fas fa-search"></i>
        </div>
        <div className="profile">
          <Link to="/login"><i className="fas fa-user"></i></Link>
          <ul className="dropdown-content">
            <li><Link to="/profile">Perfil</Link></li>
            <li><Link to="/favorites">Favoritos</Link></li>
            <li><Link to="/lists">Listas</Link></li>
            <li><Link to="/settings">Opciones</Link></li>
            <li><Link to="/logout">Desconectar</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;