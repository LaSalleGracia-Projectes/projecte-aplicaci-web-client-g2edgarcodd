import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import MainLayout from "../layouts/MainLayout";
import TabNavigation from "../components/Lists/TabNavigation";
import FavoritesGrid from "../components/Lists/FavoritesGrid";
import ListsView from "../components/Lists/ListsView";
import CreateListButton from "../components/Lists/CreateListButton";
import { useFavorites } from "../contexts/FavoritesContext";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/lists.css";

function ListsPage() {
  const [activeTab, setActiveTab] = useState("favorites");
  const [isLoading, setIsLoading] = useState(true);
  const [userLists, setUserLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const nodeRef = useRef(null);
  const { t } = useLanguage();

  // Usar el contexto de favoritos
  const { favorites } = useFavorites();

  // Establecer pestaña activa basada en la URL y cargar datos simulados
  useEffect(() => {
    if (location.pathname.includes("/lists/collections")) {
      setActiveTab("lists");
    } else {
      setActiveTab("favorites");
    }

    // Datos simulados con IDs que coincidan con ListDetailPage
    setTimeout(() => {
      setUserLists([
        {
          id: "list1",
          name: t("lists.weekendMarathon"),
          description: t("lists.weekendMarathonDesc"),
          createdAt: "2024-02-15",
          updatedAt: "2024-03-20",
          itemCount: 4,
          items: [
            {
              id: 1,
              posterPath:
                "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
              title: "The Dark Knight",
            },
            {
              id: 2,
              posterPath:
                "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
              title: "Breaking Bad",
            },
            {
              id: 3,
              posterPath:
                "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
              title: "Inception",
            },
          ],
        },
        {
          id: "oscars2023",
          name: t("lists.oscarWinners"),
          description: t("lists.oscarWinnersDesc"),
          createdAt: "2023-04-10",
          updatedAt: "2023-12-15",
          itemCount: 3,
          items: [
            {
              id: 5,
              posterPath:
                "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
              title: "Everything Everywhere All at Once",
            },
            {
              id: 6,
              posterPath:
                "https://image.tmdb.org/t/p/w500/2IRjbi9cADuDMKmHdLK7LaqQDKA.jpg",
              title: "All Quiet on the Western Front",
            },
            {
              id: 7,
              posterPath:
                "https://image.tmdb.org/t/p/w500/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg",
              title: "The Whale",
            },
          ],
        },
        {
          id: "scienceFiction",
          name: t("lists.sciFiEssentials"),
          description: t("lists.sciFiEssentialsDesc"),
          createdAt: "2022-08-15",
          updatedAt: "2024-01-10",
          itemCount: 3,
          items: [
            {
              id: 8,
              posterPath:
                "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
              title: "Dune",
            },
            {
              id: 9,
              posterPath:
                "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
              title: "Blade Runner 2049",
            },
            {
              id: 10,
              posterPath:
                "https://image.tmdb.org/t/p/w500/wikmaI7OVqmq2O9PKR9w1AJbHSO.jpg",
              title: "The Expanse",
            },
          ],
        },
      ]);
      setIsLoading(false);
    }, 800);
  }, [location.pathname, t]);

  // Función para cambiar de pestaña con transición
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "favorites") {
      navigate("/lists/favorites");
    } else {
      navigate("/lists/collections");
    }
  };

  const handleRemoveList = (id) => {
    setUserLists((prev) => prev.filter((list) => list.id !== id));
  };

  const handleCreateList = (newList) => {
    const createdList = {
      ...newList,
      id: `list${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      itemCount: 0,
      coverImage: "https://via.placeholder.com/300x450?text=Nueva+Lista",
      items: [],
    };

    setUserLists((prev) => [createdList, ...prev]);
  };

  // Función para la búsqueda
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrar contenido
  const getFilteredContent = () => {
    const content = activeTab === "favorites" ? favorites : userLists;

    // Si la búsqueda está vacía, mostrar todo
    if (searchQuery.trim() === "") {
      return content;
    }

    // Si hay búsqueda, filtrar por título o nombre
    const query = searchQuery.toLowerCase();
    return content.filter((item) => {
      if (activeTab === "favorites") {
        return item.title?.toLowerCase().includes(query);
      } else {
        return item.name?.toLowerCase().includes(query);
      }
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="lists-page">
          <div className="lists-loading">
            <div className="loading-spinner"></div>
            <p>{t("lists.loadingCollections")}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Contenido filtrado
  const filteredContent = getFilteredContent();

  // Cambiar dinámicamente el título según la pestaña activa
  const pageTitle =
    activeTab === "favorites" ? t("lists.favorites") : t("lists.myLists");

  return (
    <MainLayout>
      <div className="lists-page">
        <div className="lists-container">
          <div className="lists-header">
            <div className="lists-title-wrapper">
              <i
                className={`fas ${
                  activeTab === "favorites" ? "fa-heart" : "fa-bookmark"
                } lists-icon`}
              ></i>
              <h1 className="lists-title">{pageTitle}</h1>
            </div>

            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Barra de búsqueda simplificada */}
          <div className="lists-toolbar">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder={`${t("common.search")} ${
                  activeTab === "favorites"
                    ? t("lists.favorites").toLowerCase()
                    : t("lists.myLists").toLowerCase()
                }...`}
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button
                  className="search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          {/* Información de resultados de búsqueda */}
          {searchQuery.trim() !== "" && (
            <div className="search-results-info">
              <span>
                {filteredContent.length}{" "}
                {filteredContent.length !== 1
                  ? t("lists.searchResults")
                  : t("lists.searchResult")}{" "}
                <em>"{searchQuery}"</em>
              </span>
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                {t("lists.clearSearch")}
              </button>
            </div>
          )}

          <SwitchTransition mode="out-in">
            <CSSTransition
              key={activeTab}
              nodeRef={nodeRef}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <div ref={nodeRef}>
                {activeTab === "favorites" ? (
                  // No pasamos los favoritos como prop, el componente FavoritesGrid
                  // ahora utiliza directamente el contexto FavoritesContext
                  <FavoritesGrid />
                ) : (
                  <div className="lists-view-container">
                    <div className="lists-actions">
                      <CreateListButton onCreateList={handleCreateList} />
                      <div className="lists-counter">
                        {userLists.length}/25 {t("lists.listsCount")}
                      </div>
                    </div>

                    <ListsView
                      lists={filteredContent}
                      onRemoveList={handleRemoveList}
                    />
                  </div>
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>

          {/* Mensaje cuando no hay resultados */}
          {filteredContent.length === 0 && searchQuery.trim() !== "" && (
            <div className="no-results">
              <i className="fas fa-search-minus no-results-icon"></i>
              <h3>{t("lists.noResults")}</h3>
              <p>
                {t("lists.noMatchesFor")} <em>"{searchQuery}"</em>{" "}
                {t("lists.inYour")}{" "}
                {activeTab === "favorites"
                  ? t("lists.favorites").toLowerCase()
                  : t("lists.myLists").toLowerCase()}
                .
              </p>
              <button
                className="btn-secondary"
                onClick={() => setSearchQuery("")}
              >
                <i className="fas fa-arrow-left"></i> {t("lists.backToAll")}
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default ListsPage;
