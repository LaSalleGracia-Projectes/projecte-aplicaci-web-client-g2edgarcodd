import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { AuthContext } from "../../contexts/AuthContext";
import LanguageSelector from "../UI/LanguageSelector";

function Navbar({
  toggleSearch,
  logo,
  isScrolled,
  isAuthenticated,
  isLoading,
  mobileMenuOpen,
  toggleMobileMenu,
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);
  const { t, language } = useLanguage();
  const { logout } = useContext(AuthContext);

  // Cerrar el menú móvil al cambiar de ruta
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Función mejorada para controlar los desplegables
  const toggleDropdown = (dropdown, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // En móvil, si está abierto otro dropdown, cerrarlo primero
    if (
      window.innerWidth <= 768 &&
      activeDropdown &&
      activeDropdown !== dropdown
    ) {
      setActiveDropdown(null);
      // Pequeño delay antes de abrir el nuevo dropdown para una mejor transición
      setTimeout(() => {
        setActiveDropdown(dropdown);
      }, 100);
    } else {
      setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    }
  };

  const isActive = (path) => {
    if (path === "/explore") {
      // Para considerar activas también las rutas hijas de explore
      return location.pathname.startsWith(path) ? "active" : "";
    }
    return location.pathname === path ? "active" : "";
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    // Redireccionar a home o login después del logout
    window.location.href = "/";
  };

  // Función para cerrar el menú cuando se hace clic en un enlace
  const handleNavLinkClick = () => {
    if (mobileMenuOpen && window.innerWidth <= 768) {
      toggleMobileMenu();
    }
  };

  // Función para navegar recargando la página completamente
  const navigateWithReload = (path, e) => {
    if (e) {
      e.preventDefault();
    }
    window.location.href = path;
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} ref={navRef}>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt={t("common.appName")} />
          <span>{t("common.appName")}</span>
        </Link>
      </div>

      {/* Botón de menú móvil mejorado con indicador de aria */}
      <div
        className={`mobile-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={mobileMenuOpen}
        role="button"
        tabIndex="0"
      >
        <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
      </div>

      <ul className={`nav-center ${mobileMenuOpen ? "mobile-active" : ""}`}>
        <li className={isActive("/")}>
          <Link to="/" onClick={handleNavLinkClick}>
            {t("navbar.home")}
          </Link>
        </li>
        <li
          className={`has-dropdown ${
            activeDropdown === "explorar" ? "active" : ""
          } ${isActive("/explore")}`}
        >
          <Link
            to="/explore"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown("explorar", e);
            }}
          >
            {t("navbar.explore")}
          </Link>
          <div
            className={`dropdown explorar ${
              activeDropdown === "explorar" ? "visible" : ""
            }`}
          >
            <div className="column">
              <li>
                <a
                  href="/explore"
                  onClick={(e) => navigateWithReload("/explore", e)}
                >
                  {t("explore.allContent")}
                </a>
              </li>
              <li>
                <a
                  href="/explore/films"
                  onClick={(e) => navigateWithReload("/explore/films", e)}
                >
                  {t("explore.films")}
                </a>
              </li>
              <li>
                <a
                  href="/explore/series"
                  onClick={(e) => navigateWithReload("/explore/series", e)}
                >
                  {t("explore.series")}
                </a>
              </li>
            </div>
            <div className="column">
              <li>
                <a
                  href="/explore?genre=28"
                  onClick={(e) => navigateWithReload("/explore?genre=28", e)}
                >
                  {t("genres.action")}
                </a>
              </li>
              <li>
                <a
                  href="/explore?genre=12"
                  onClick={(e) => navigateWithReload("/explore?genre=12", e)}
                >
                  {t("genres.adventure")}
                </a>
              </li>
              <li>
                <a
                  href="/explore?genre=14"
                  onClick={(e) => navigateWithReload("/explore?genre=14", e)}
                >
                  {t("genres.fantasy")}
                </a>
              </li>
              <li>
                <a
                  href="/explore?genre=878"
                  onClick={(e) => navigateWithReload("/explore?genre=878", e)}
                >
                  {t("genres.scifi")}
                </a>
              </li>
              <li>
                <a
                  href="/explore?genre=10749"
                  onClick={(e) => navigateWithReload("/explore?genre=10749", e)}
                >
                  {t("genres.romance")}
                </a>
              </li>
              <li>
                <a
                  href="/explore?genre=18"
                  onClick={(e) => navigateWithReload("/explore?genre=18", e)}
                >
                  {t("genres.drama")}
                </a>
              </li>
            </div>
          </div>
        </li>
        <li className={isActive("/blog")}>
          <Link to="/blog" onClick={handleNavLinkClick}>
            {t("navbar.blog")}
          </Link>
        </li>
        <li className={isActive("/forum")}>
          <Link to="/forum" onClick={handleNavLinkClick}>
            {t("navbar.forum")}
          </Link>
        </li>
        <li className={isActive("/contact")}>
          <Link to="/contact" onClick={handleNavLinkClick}>
            {t("navbar.contact")}
          </Link>
        </li>
      </ul>

      <div className="nav-right">
        <LanguageSelector />

        <div className="search-btn" onClick={toggleSearch}>
          <i className="fas fa-search"></i>
        </div>

        {/* Mostrar distintos botones según el estado de autenticación */}
        {isLoading ? (
          // Mostrar indicador de carga mientras verificamos la autenticación
          <div className="auth-loading">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
        ) : isAuthenticated ? (
          // Usuario autenticado: Mostrar menú de perfil
          <div
            className={`profile ${
              activeDropdown === "profile" ? "active" : ""
            }`}
          >
            <button
              onClick={(e) => toggleDropdown("profile", e)}
              className="profile-icon"
              aria-label={t("profile.myProfile")}
              type="button"
            >
              <i className="fas fa-user"></i>
            </button>
            {activeDropdown === "profile" && (
              <div className="dropdown-content profile-dropdown visible">
                <div className="profile-item">
                  <Link to="/profile">{t("profile.myProfile")}</Link>
                </div>
                <div className="profile-item">
                  <Link to="/lists/favorites">{t("lists.favorites")}</Link>
                </div>
                <div className="profile-item">
                  <Link to="/lists/collections">{t("lists.myLists")}</Link>
                </div>
                <div className="profile-item">
                  <a href="#" onClick={handleLogout}>
                    {t("profile.logOut")}
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Usuario no autenticado: Mostrar botones de login y registro
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">
              <i className="fas fa-sign-in-alt"></i>
              <span>{t("auth.login")}</span>
            </Link>
            <Link to="/register" className="register-btn">
              <i className="fas fa-user-plus"></i>
              <span>{t("auth.register")}</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
