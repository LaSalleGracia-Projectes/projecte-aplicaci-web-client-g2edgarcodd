import React, { useState, useEffect, useContext } from "react";
import MainLayout from "../layouts/MainLayout";
import ProfileHeader from "../components/Profile/ProfileHeader";
import AccountSummary from "../components/Profile/AccountSummary";
import ProfileSettings from "../components/Profile/ProfileSettings";
import { useLanguage } from "../contexts/LanguageContext";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/components/profile.css";

function ProfilePage() {
  const { t } = useLanguage();
  const { user, fetchUserInfo } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        let currentUser = user;

        if (!currentUser) {
          // Intentar obtener el token y el ID del usuario del almacenamiento local
          const userId = localStorage.getItem("user_id");
          const token = localStorage.getItem("auth_token");

          if (userId && token) {
            // Cargar datos del usuario si no están en el contexto
            await fetchUserInfo(userId, token);

            // Esperar un momento para asegurar que el contexto se actualiza
            // Esto es un arreglo temporal, idealmente fetchUserInfo debería devolver los datos
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Verificar si ahora tenemos un usuario
            currentUser = user;

            // Si aún no tenemos usuario, intentar obtener los datos directamente
            if (!currentUser) {
              // Idealmente, deberías tener una función para obtener los datos del usuario directamente
              // En este ejemplo, usamos una solución temporal
              console.warn(
                "No se pudo obtener el usuario del contexto, intentando obtener datos directamente"
              );

              // Simulación: Aquí deberías hacer una llamada directa a tu API
              const response = await fetch(
                `http://25.17.74.119:8000/api/user/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (!response.ok) {
                throw new Error(t("profile.failedToLoadUser"));
              }

              currentUser = await response.json();
            }
          } else {
            throw new Error(t("profile.authError"));
          }
        }

        // Asegurarse de que tenemos un usuario antes de continuar
        if (!currentUser) {
          throw new Error(t("profile.userDataNotAvailable"));
        }

        // Obtenemos los datos de estadísticas y preferencias
        // En una aplicación real, esto vendría de una API
        const token = localStorage.getItem("auth_token");

        // Simulamos esos datos adicionales
        const statsData = {
          watchTime: 523,
          favoriteGenres: [
            t("genres.action"),
            t("genres.scifi"),
            t("genres.thriller"),
          ],
          genreStats: [
            { name: t("genres.action"), percentage: 45, hours: 235 },
            { name: t("genres.scifi"), percentage: 30, hours: 157 },
            { name: t("genres.thriller"), percentage: 15, hours: 78 },
            { name: t("genres.drama"), percentage: 10, hours: 53 },
          ],
          watchByMonth: [
            { month: t("months.jan"), hours: 42 },
            { month: t("months.feb"), hours: 38 },
            { month: t("months.mar"), hours: 47 },
            { month: t("months.apr"), hours: 35 },
            { month: t("months.may"), hours: 50 },
            { month: t("months.jun"), hours: 55 },
          ],
          watchByDevice: [
            { device: "TV", percentage: 55, hours: 287 },
            { device: t("profile.mobile"), percentage: 25, hours: 131 },
            { device: t("profile.tablet"), percentage: 10, hours: 52 },
            { device: t("profile.computer"), percentage: 10, hours: 53 },
          ],
          watchByTimeOfDay: [
            { time: t("profile.morning"), percentage: 10, hours: 52 },
            { time: t("profile.afternoon"), percentage: 30, hours: 157 },
            { time: t("profile.evening"), percentage: 60, hours: 314 },
          ],
          totalMovies: 87,
          totalSeries: 24,
          completedSeries: 14,
          totalEpisodes: 345,
        };

        // Combinar datos del usuario con estadísticas
        const completeUserData = {
          ...currentUser,
          id: localStorage.getItem("user_id"),
          memberSince: currentUser?.created_at || "2023-01-01",
          plan: currentUser?.subscription_type || "Premium",
          planExpiry: currentUser?.subscription_end || "2025-08-15",
          avatar: currentUser?.profile_photo_url || null,
          coverImage:
            "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          username: currentUser?.username || "usuario",
          fullName: `${currentUser?.name || ""} ${
            currentUser?.surname || ""
          }`.trim(),
          email: currentUser?.email || "usuario@ejemplo.com",
          statusMessage:
            currentUser?.status_message || t("profile.defaultStatus"),
          ...statsData,
          watchlist: currentUser?.watchlist || [],
          favorites: currentUser?.favorites || [],
          customLists: currentUser?.custom_lists || [],
        };

        setUserData(completeUserData);
      } catch (err) {
        console.error("Error al cargar datos del perfil:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [t, user, fetchUserInfo]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>{t("profile.loadingProfile")}</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="profile-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            {t("common.retry")}
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="profile-page">
        <ProfileHeader userData={userData} />

        <div className="profile-navigation">
          <button
            className={`profile-nav-button ${
              activeTab === "summary" ? "active" : ""
            }`}
            onClick={() => setActiveTab("summary")}
          >
            <i className="fas fa-chart-line"></i>
            <span>{t("profile.summary")}</span>
          </button>
          <button
            className={`profile-nav-button ${
              activeTab === "settings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <i className="fas fa-cog"></i>
            <span>{t("profile.settings")}</span>
          </button>
        </div>

        <div className="profile-content">
          {activeTab === "summary" && <AccountSummary userData={userData} />}
          {activeTab === "settings" && <ProfileSettings userData={userData} />}
        </div>
      </div>
    </MainLayout>
  );
}

export default ProfilePage;
