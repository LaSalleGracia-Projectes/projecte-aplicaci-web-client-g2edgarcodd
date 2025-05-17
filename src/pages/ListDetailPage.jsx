import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/listDetail.css";

function ListDetailPage() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [listData, setListData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, currentLanguage } = useLanguage();

  // Nuevos estados para la funcionalidad
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  // Estado para controlar la visualización de la barra de herramientas
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    // Simulación de datos de lista con contenido más atractivo
    const mockLists = {
      list1: {
        id: "list1",
        name: t("lists.weekendMarathon"),
        description: t("lists.weekendMarathonDesc"),
        createdAt: "2024-02-15",
        updatedAt: "2024-03-20",
        items: [
          {
            id: 1,
            title: "The Dark Knight",
            posterPath:
              "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            type: "movie",
            year: "2008",
            rating: 9.0,
            duration: "152 min",
          },
          {
            id: 2,
            title: "Breaking Bad",
            posterPath:
              "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
            type: "series",
            year: "2008-2013",
            rating: 9.5,
            seasons: 5,
          },
          {
            id: 3,
            title: "Inception",
            posterPath:
              "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            type: "movie",
            year: "2010",
            rating: 8.8,
            duration: "148 min",
          },
          {
            id: 4,
            title: "Stranger Things",
            posterPath:
              "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
            type: "series",
            year: "2016-2024",
            rating: 8.7,
            seasons: 4,
          },
        ],
      },
      oscars2023: {
        id: "oscars2023",
        name: t("lists.oscarWinners"),
        description: t("lists.oscarWinnersDesc"),
        createdAt: "2023-04-10",
        updatedAt: "2023-12-15",
        items: [
          {
            id: 5,
            title: "Everything Everywhere All at Once",
            posterPath:
              "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
            type: "movie",
            year: "2022",
            rating: 8.7,
            duration: "139 min",
          },
          {
            id: 6,
            title: "All Quiet on the Western Front",
            posterPath:
              "https://image.tmdb.org/t/p/w500/2IRjbi9cADuDMKmHdLK7LaqQDKA.jpg",
            type: "movie",
            year: "2022",
            rating: 7.8,
            duration: "147 min",
          },
          {
            id: 7,
            title: "The Whale",
            posterPath:
              "https://image.tmdb.org/t/p/w500/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg",
            type: "movie",
            year: "2022",
            rating: 7.5,
            duration: "117 min",
          },
        ],
      },
      scienceFiction: {
        id: "scienceFiction",
        name: t("lists.sciFiEssentials"),
        description: t("lists.sciFiEssentialsDesc"),
        createdAt: "2022-08-15",
        updatedAt: "2024-01-10",
        items: [
          {
            id: 8,
            title: "Dune",
            posterPath:
              "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
            type: "movie",
            year: "2021",
            rating: 8.0,
            duration: "155 min",
          },
          {
            id: 9,
            title: "Blade Runner 2049",
            posterPath:
              "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
            type: "movie",
            year: "2017",
            rating: 8.3,
            duration: "164 min",
          },
          {
            id: 10,
            title: "The Expanse",
            posterPath:
              "https://image.tmdb.org/t/p/w500/wikmaI7OVqmq2O9PKR9w1AJbHSO.jpg",
            type: "series",
            year: "2015-2022",
            rating: 8.5,
            seasons: 6,
          },
        ],
      },
    };

    // Comprobar si existe la lista y cargar datos
    setTimeout(() => {
      if (mockLists[listId]) {
        setListData(mockLists[listId]);
        setIsLoading(false);
      } else {
        setListData(null);
        setIsLoading(false);
      }
    }, 800);

    // Configurar URL para compartir
    if (listData) {
      setShareUrl(`${window.location.origin}/lists/${listId}`);
    }
  }, [listId, t, listData]);

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      currentLanguage === "es"
        ? "es-ES"
        : currentLanguage === "ca"
        ? "ca-ES"
        : "en-US",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  const handleRemoveItem = (itemId) => {
    setListData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((item) => item.id !== itemId),
    }));
  };

  // Nueva función para marcar un elemento como visto/no visto
  const handleToggleWatched = (itemId) => {
    setListData((prevData) => ({
      ...prevData,
      items: prevData.items.map((item) =>
        item.id === itemId ? { ...item, watched: !item.watched } : item
      ),
    }));
  };

  // Nueva función para ordenar los elementos
  const sortItems = (items) => {
    if (!items || items.length === 0) return [];

    const itemsCopy = [...items];

    switch (sortOrder) {
      case "title-asc":
        return itemsCopy.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return itemsCopy.sort((a, b) => b.title.localeCompare(a.title));
      case "rating-desc":
        return itemsCopy.sort((a, b) => b.rating - a.rating);
      case "newest":
        return itemsCopy.sort((a, b) => {
          const yearA = a.year.split("-")[0];
          const yearB = b.year.split("-")[0];
          return parseInt(yearB) - parseInt(yearA);
        });
      case "oldest":
        return itemsCopy.sort((a, b) => {
          const yearA = a.year.split("-")[0];
          const yearB = b.year.split("-")[0];
          return parseInt(yearA) - parseInt(yearB);
        });
      case "watched":
        return itemsCopy.sort((a, b) =>
          a.watched === b.watched ? 0 : a.watched ? -1 : 1
        );
      case "unwatched":
        return itemsCopy.sort((a, b) =>
          a.watched === b.watched ? 0 : a.watched ? 1 : -1
        );
      default:
        return itemsCopy;
    }
  };

  // Nueva función para manejar la compartición de la lista
  const handleShare = async () => {
    setShowShareModal(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${listData.name} - StreamHub`,
          text: t("lists.shareListDescription", { name: listData.name }),
          url: shareUrl,
        });
        setShareSuccess(true);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(true);
      }
    } catch (error) {
      console.error(t("lists.errorSharing"), error);
    }
  };

  // Filtrar elementos basados en el término de búsqueda y luego ordenarlos
  const getFilteredAndSortedItems = () => {
    if (!listData || !listData.items) return [];

    let filteredItems = listData.items;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.year.toLowerCase().includes(term)
      );
    }

    return sortItems(filteredItems);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="list-detail-page">
          <div className="list-detail-loading">
            <div className="loading-spinner"></div>
            <p>{t("lists.loadingList")}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!listData) {
    return (
      <MainLayout>
        <div className="list-detail-page">
          <div className="list-detail-error">
            <i className="fas fa-exclamation-circle error-icon"></i>
            <h2>{t("lists.listNotFound")}</h2>
            <p>{t("lists.listNotFoundMessage")}</p>
            <button className="btn-primary" onClick={() => navigate("/lists")}>
              <i className="fas fa-arrow-left"></i> {t("lists.backToMyLists")}
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const filteredAndSortedItems = getFilteredAndSortedItems();
  const hasResults = filteredAndSortedItems.length > 0;

  return (
    <MainLayout>
      <div className="list-detail-page">
        <div className="list-detail-container">
          <div className="list-detail-breadcrumb">
            <Link to="/lists/collections" className="breadcrumb-link">
              <i className="fas fa-bookmark"></i> {t("lists.myLists")}
            </Link>
            <i className="fas fa-chevron-right breadcrumb-separator"></i>
            <span className="breadcrumb-current" title={listData?.name}>
              {listData?.name}
            </span>
          </div>

          <div className="list-detail-header">
            <h1 className="list-detail-title">{listData.name}</h1>
            <p className="list-detail-description">{listData.description}</p>
            <div className="list-detail-meta">
              <div className="list-meta-item">
                <i className="fas fa-film"></i>
                <span>
                  {listData.items.length} {t("lists.elements")}
                </span>
              </div>
              <div className="list-meta-item">
                <i className="fas fa-calendar-alt"></i>
                <span>
                  {t("lists.updatedOn")} {formatDate(listData.updatedAt)}
                </span>
              </div>
              <div className="list-meta-item">
                <i className="fas fa-plus-circle"></i>
                <span>
                  {t("lists.createdOn")} {formatDate(listData.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="list-detail-actions">
            <button className="btn-secondary">
              <i className="fas fa-edit"></i> {t("lists.editList")}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setShowToolbar(!showToolbar)}
            >
              <i className="fas fa-sliders-h"></i> {t("lists.manageList")}
            </button>
            <button className="btn-secondary" onClick={handleShare}>
              <i className="fas fa-share-alt"></i> {t("lists.shareList")}
            </button>
            <button className="btn-danger">
              <i className="fas fa-trash-alt"></i> {t("common.delete")}
            </button>
          </div>

          {showToolbar && (
            <div className="list-detail-toolbar">
              <div className="list-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder={t("lists.searchInList")}
                  className="list-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="search-clear"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              <div className="list-sort">
                <label htmlFor="sort-order">{t("lists.sortBy")}</label>
                <select
                  id="sort-order"
                  className="sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="default">{t("lists.sortDefault")}</option>
                  <option value="title-asc">{t("lists.sortTitleAsc")}</option>
                  <option value="title-desc">{t("lists.sortTitleDesc")}</option>
                  <option value="rating-desc">
                    {t("lists.sortRatingDesc")}
                  </option>
                  <option value="newest">{t("lists.sortNewest")}</option>
                  <option value="oldest">{t("lists.sortOldest")}</option>
                  <option value="watched">{t("lists.sortWatched")}</option>
                  <option value="unwatched">{t("lists.sortUnwatched")}</option>
                </select>
              </div>
            </div>
          )}

          {searchTerm.trim() !== "" && (
            <div className="search-results-info">
              <span>
                {filteredAndSortedItems.length}{" "}
                {filteredAndSortedItems.length !== 1
                  ? t("lists.searchResults")
                  : t("lists.searchResult")}{" "}
                <em>"{searchTerm}"</em>
              </span>
              {filteredAndSortedItems.length === 0 && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  {t("lists.clearSearch")}
                </button>
              )}
            </div>
          )}

          <div className="list-items-grid">
            {hasResults ? (
              filteredAndSortedItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`list-item-card ${item.watched ? "watched" : ""}`}
                  style={{ "--item-index": index }}
                >
                  <div className="list-item-poster-wrapper">
                    <img
                      src={item.posterPath}
                      alt={item.title}
                      className="list-item-poster"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x450?text=No+Image";
                      }}
                    />
                    {item.watched && (
                      <div className="watched-badge">
                        <i className="fas fa-check"></i> {t("lists.watched")}
                      </div>
                    )}
                    <div className="list-item-overlay">
                      <button className="list-item-play-btn">
                        <i className="fas fa-play"></i>
                      </button>
                    </div>
                    <span className={`list-item-type-badge ${item.type}`}>
                      {item.type === "movie"
                        ? t("common.movie")
                        : t("common.series")}
                    </span>
                  </div>
                  <div className="list-item-info">
                    <h3 className="list-item-title">{item.title}</h3>
                    <div className="list-item-details">
                      <p className="list-item-year">{item.year}</p>
                      <p className="list-item-rating">
                        <i className="fas fa-star"></i> {item.rating}
                      </p>
                      {item.type === "movie" ? (
                        <p className="list-item-duration">
                          <i className="fas fa-clock"></i> {item.duration}
                        </p>
                      ) : (
                        <p className="list-item-seasons">
                          <i className="fas fa-tv"></i> {item.seasons}{" "}
                          {t("common.seasons")}
                        </p>
                      )}
                    </div>

                    <div className="list-item-actions">
                      <button
                        className="list-item-watched-btn"
                        onClick={() => handleToggleWatched(item.id)}
                        title={
                          item.watched
                            ? t("lists.markAsUnwatched")
                            : t("lists.markAsWatched")
                        }
                      >
                        <i
                          className={`fas ${
                            item.watched ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                      <button
                        className="list-item-remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={t("lists.removeItem")}
                        title={t("lists.removeItem")}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : searchTerm.trim() !== "" ? (
              <div className="list-empty-search">
                <i className="fas fa-search empty-search-icon"></i>
                <h3>{t("lists.noSearchResults")}</h3>
                <p>{t("lists.tryDifferentSearch")}</p>
                <button
                  className="btn-primary"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="fas fa-times"></i> {t("lists.clearSearch")}
                </button>
              </div>
            ) : null}

            {!searchTerm.trim() && (
              <div className="list-item-add-card">
                <div className="list-item-add-content">
                  <i className="fas fa-plus-circle"></i>
                  <p>{t("lists.addContent")}</p>
                </div>
              </div>
            )}
          </div>

          {filteredAndSortedItems.length === 0 && !searchTerm.trim() && (
            <div className="list-empty-state">
              <i className="fas fa-film empty-icon"></i>
              <h3>{t("lists.emptyList")}</h3>
              <p>{t("lists.emptyListMessage")}</p>
              <button className="btn-primary">
                <i className="fas fa-plus"></i> {t("lists.addContent")}
              </button>
            </div>
          )}

          {showShareModal && (
            <div className="share-modal active">
              <div className="share-modal-content">
                <button
                  className="modal-close"
                  onClick={() => setShowShareModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
                <h3>{t("lists.shareList")}</h3>
                <div className="share-url-container">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="share-url-input"
                  />
                  <button
                    className="copy-url-btn"
                    onClick={async () => {
                      await navigator.clipboard.writeText(shareUrl);
                      setShareSuccess(true);
                      setTimeout(() => setShareSuccess(false), 2000);
                    }}
                  >
                    <i
                      className={`fas ${shareSuccess ? "fa-check" : "fa-copy"}`}
                    ></i>
                  </button>
                </div>
                <div className="share-options">
                  <button
                    className="share-option whatsapp"
                    title={t("lists.shareOnWhatsApp")}
                  >
                    <i className="fab fa-whatsapp"></i>
                  </button>
                  <button
                    className="share-option twitter"
                    title={t("lists.shareOnTwitter")}
                  >
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button
                    className="share-option facebook"
                    title={t("lists.shareOnFacebook")}
                  >
                    <i className="fab fa-facebook"></i>
                  </button>
                  <button
                    className="share-option telegram"
                    title={t("lists.shareOnTelegram")}
                  >
                    <i className="fab fa-telegram"></i>
                  </button>
                </div>
                {shareSuccess && (
                  <div className="share-success">
                    <i className="fas fa-check-circle"></i>{" "}
                    {t("lists.linkCopied")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default ListDetailPage;
