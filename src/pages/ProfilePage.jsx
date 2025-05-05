import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import ProfileHeader from "../components/Profile/ProfileHeader";
import AccountSummary from "../components/Profile/AccountSummary";
import ProfileSettings from "../components/Profile/ProfileSettings";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/profile.css";

function ProfilePage() {
  const { t } = useLanguage();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    // Simulación de carga de datos del usuario desde la API
    const fetchUserData = async () => {
      try {
        // Aquí iría la llamada real a la API
        // const response = await fetch('api/user/profile');
        // const data = await response.json();

        // Simulación de datos para desarrollo
        setTimeout(() => {
          setUserData({
            id: "user123",
            username: "mateo_cinephile",
            fullName: "Mateo Acha",
            email: "mateo.acha@example.com",
            avatar: "https://randomuser.me/api/portraits/men/42.jpg",
            coverImage:
              "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            statusMessage: t("profile.defaultStatus"),
            memberSince: "2021-05-18",
            plan: "Premium",
            planExpiry: "2025-08-15",
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
            watchlist: [
              {
                id: 1,
                title: "The Gentlemen",
                posterPath:
                  "https://image.tmdb.org/t/p/w500/jtrhTYB7xSrJxR1vusu99nvnZ1g.jpg",
              },
              {
                id: 3,
                title: "The Boys",
                posterPath:
                  "https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg",
              },
              {
                id: 7,
                title: "Blade Runner 2049",
                posterPath:
                  "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
              },
              {
                id: 9,
                title: "Tenet",
                posterPath:
                  "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
              },
            ],
            favorites: [
              {
                id: 4,
                title: "The Dark Knight",
                posterPath:
                  "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
              },
              {
                id: 5,
                title: "Dune",
                posterPath:
                  "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
              },
              {
                id: 6,
                title: "Better Call Saul",
                posterPath:
                  "https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR31b6ys.jpg",
              },
            ],
            customLists: [
              {
                id: "list1",
                name: t("continue.items.witcher.title"),
                items: [
                  {
                    id: 2,
                    title: "The Mandalorian",
                    posterPath:
                      "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
                  },
                  {
                    id: 8,
                    title: "Peaky Blinders",
                    posterPath:
                      "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
                  },
                ],
              },
              {
                id: "list2",
                name: t("lists.favorites"),
                items: [
                  {
                    id: 10,
                    title: "Fight Club",
                    posterPath:
                      "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                  },
                  {
                    id: 11,
                    title: "Pulp Fiction",
                    posterPath:
                      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
                  },
                ],
              },
              {
                id: "list3",
                name: t("genres.scifi"),
                items: [
                  {
                    id: 7,
                    title: "Blade Runner 2049",
                    posterPath:
                      "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
                  },
                  {
                    id: 12,
                    title: "Arrival",
                    posterPath:
                      "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
                  },
                ],
              },
            ],
          });
          setIsLoading(false);
        }, 600);
      } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [t]);

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
