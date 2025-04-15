import React, { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import "../styles/components/admin/variables.css";
import "../styles/components/admin/dashboard.css";
import "../styles/components/admin/cards.css";
import "../styles/components/admin/activity.css";
import "../styles/components/admin/utilities.css";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AdminLayout>
      <div className="adminPanel-dashboard">
        <div className="adminPanel-dashboard-header">
          <h1 className="adminPanel-dashboard-title">
            Panel de Administración
          </h1>
          <div className="adminPanel-dashboard-actions">
            <button className="adminPanel-btn adminPanel-btn-primary">
              <i className="fas fa-sync-alt"></i> Actualizar Datos
            </button>
          </div>
        </div>

        <div className="adminPanel-system-notice">
          <div className="adminPanel-notice-icon">
            <i className="fas fa-info-circle"></i>
          </div>
          <div className="adminPanel-notice-content">
            <h3 className="adminPanel-notice-title">
              Mantenimiento Programado
            </h3>
            <p className="adminPanel-notice-message">
              El sistema estará en mantenimiento el día 5 de mayo de 2025 de
              02:00 a 04:00. Por favor, planifique sus actividades en
              consecuencia.
            </p>
            <div className="adminPanel-notice-actions">
              <button className="adminPanel-notice-action">Ver detalles</button>
            </div>
          </div>
        </div>

        <div className="adminPanel-tabs">
          <button
            className={`adminPanel-tab ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <i className="fas fa-chart-bar"></i> Vista General
          </button>
          <button
            className={`adminPanel-tab ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <i className="fas fa-users"></i> Usuarios
            <span className="adminPanel-tab-badge">5</span>
          </button>
          <button
            className={`adminPanel-tab ${
              activeTab === "content" ? "active" : ""
            }`}
            onClick={() => setActiveTab("content")}
          >
            <i className="fas fa-film"></i> Contenido
          </button>
          <button
            className={`adminPanel-tab ${
              activeTab === "reports" ? "active" : ""
            }`}
            onClick={() => setActiveTab("reports")}
          >
            <i className="fas fa-flag"></i> Reportes
            <span className="adminPanel-tab-badge">3</span>
          </button>
        </div>

        <div className="adminPanel-dashboard-content">
          <StatsCards />
          <div className="adminPanel-dashboard-row">
            <div className="adminPanel-dashboard-column">
              <QuickActions />
            </div>
            <div className="adminPanel-dashboard-column">
              <ActivityLog />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
