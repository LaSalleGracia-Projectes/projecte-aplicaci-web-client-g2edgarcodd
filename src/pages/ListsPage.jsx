import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import MainLayout from "../layouts/MainLayout";
import TabNavigation from "../components/Lists/TabNavigation";
import FavoritesGrid from "../components/Lists/FavoritesGrid";
import ListsView from "../components/Lists/ListsView";
import CreateListButton from "../components/Lists/CreateListButton";
import { useFavorites } from "../contexts/FavoritesContext";
import "../styles/components/lists.css";

function ListsPage() {
  const [activeTab, setActiveTab] = useState("favorites");
  const [isLoading, setIsLoading] = useState(true);
  const [userLists, setUserLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const nodeRef = useRef(null);

  // Usar el contexto de favoritos
  const { favorites } = useFavorites();

  // Establecer pestaña activa basada en la URL y cargar datos simulados
  useEffect(() => {
    if (location.pathname.includes("/lists/collections")) {
      setActiveTab("lists");
    } else {
      setActiveTab("favorites");
    }

    // Simular carga de listas de usuario (no de favoritos)
    setTimeout(() => {
      setUserLists([
        {
          id: "list1",
          name: "Maratón de fin de semana",
          description: "Películas y series para ver en un fin de semana",
          createdAt: "2024-02-15",
          updatedAt: "2024-03-20",
          itemCount: 4,
          coverImage:
            "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
          items: [],
        },
        // Más listas pueden agregarse aquí
      ]);
      setIsLoading(false);
    }, 800);
  }, [location.pathname]);

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
            <p>Cargando tus colecciones...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Contenido filtrado
  const filteredContent = getFilteredContent();

  // Cambiar dinámicamente el título según la pestaña activa
  const pageTitle = activeTab === "favorites" ? "Favoritos" : "Mis Listas";

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
                placeholder={`Buscar en ${
                  activeTab === "favorites" ? "favoritos" : "listas"
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
                {filteredContent.length} resultado
                {filteredContent.length !== 1 ? "s" : ""} para{" "}
                <em>"{searchQuery}"</em>
              </span>
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                Limpiar búsqueda
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
                        {userLists.length}/25 listas
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
              <h3>No se encontraron resultados</h3>
              <p>
                No hay coincidencias para <em>"{searchQuery}"</em> en tus{" "}
                {activeTab === "favorites" ? "favoritos" : "listas"}.
              </p>
              <button
                className="btn-secondary"
                onClick={() => setSearchQuery("")}
              >
                <i className="fas fa-arrow-left"></i> Volver a todos los
                elementos
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default ListsPage;
