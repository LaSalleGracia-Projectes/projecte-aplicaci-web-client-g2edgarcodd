import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSelector from "../UI/LanguageSelector";
import "../../styles/components/admin/variables.css";
import "../../styles/components/admin/layout.css";

const AdminSidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useLanguage(); // Hook para traducciones

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      <button
        className="adminPanel-mobile-toggle"
        onClick={toggleMobileMenu}
        style={{ display: "none" }} // Se mostrará solo en móviles via CSS
      >
        <i className="fas fa-bars"></i>
      </button>

      <aside className={`adminPanel-sidebar ${isMobileOpen ? "open" : ""}`}>
        <div className="adminPanel-sidebar-header">
          <h2 className="adminPanel-sidebar-title">StreamHub</h2>
        </div>

        <nav className="adminPanel-sidebar-nav">
          <div className="adminPanel-nav-group">
            <div className="adminPanel-nav-group-title">{t("admin.navigation")}</div>
            <ul>
              <li>
                <Link
                  to="/"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <i className="fas fa-home"></i>
                  {t("admin.backToHome")}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/users"
                  className={isActive("/admin/users") ? "active" : ""}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <i className="fas fa-users"></i>
                  {t("admin.users")}
                  <span className="adminPanel-nav-badge">24</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="adminPanel-nav-group">
            <div className="adminPanel-nav-group-title">{t("admin.system")}</div>
            <ul>
              <li>
                <Link to="/logout" className="adminPanel-nav-logout">
                  <i className="fas fa-sign-out-alt"></i>
                  {t("profile.logOut")}
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="adminPanel-sidebar-footer">
          <div className="adminPanel-language-selector">
            <LanguageSelector />
          </div>
          <div className="adminPanel-user-info">
            <div className="adminPanel-user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="adminPanel-user-details">
              <div className="adminPanel-user-name">{t("admin.administrator")}</div>
              <div className="adminPanel-user-role">Admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
