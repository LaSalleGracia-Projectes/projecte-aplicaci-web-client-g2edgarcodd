import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import SearchOverlay from "./SearchOverlay";
import logoImage from "../../assets/streamhub.png";
import "../../styles/components/header.css";
import { AuthContext } from "../../contexts/AuthContext";

function Header() {
  const [searchActive, setSearchActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Gestionar scroll para añadir efectos visuales
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== headerScrolled) {
        setHeaderScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerScrolled]);

  const toggleSearch = () => {
    setSearchActive(!searchActive);
    // Bloquear el scroll cuando el overlay esté abierto
    if (!searchActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Si el menú móvil está abierto, cerrarlo
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    // Si vamos a abrir el menú, primero asegurar que el scroll está deshabilitado
    if (!mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      setMobileMenuOpen(true);
    } else {
      // Si lo vamos a cerrar, hacerlo con una pequeña demora para la animación
      setMobileMenuOpen(false);
      // Retrasar la habilitación del scroll para permitir la animación de cierre
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 400);
    }

    // Si el overlay de búsqueda está activo, cerrarlo
    if (searchActive) {
      setSearchActive(false);
    }
  };

  return (
    <header className={headerScrolled ? "scrolled" : ""}>
      <Navbar
        toggleSearch={toggleSearch}
        logo={logoImage}
        isScrolled={headerScrolled}
        isAuthenticated={isAuthenticated}
        isLoading={loading}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      <SearchOverlay active={searchActive} toggleSearch={toggleSearch} />
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>
      )}
    </header>
  );
}

export default Header;
