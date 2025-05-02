import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useLanguage } from "../../contexts/LanguageContext";
import "../../styles/components/Forum.css";

function Forum() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [newTopic, setNewTopic] = useState({
    title: "",
    content: "",
    category: "general",
  });

  // Simulación de carga de datos
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTopics(forumTopics);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filtrar y ordenar temas
  const filteredAndSortedTopics = React.useMemo(() => {
    let filtered = topics.filter((topic) => {
      const matchesCategory =
        activeCategory === "all" || topic.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "popular") {
        return b.views - a.views;
      } else if (sortBy === "activity") {
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      }
      return 0;
    });
  }, [topics, activeCategory, searchQuery, sortBy]);

  // Paginación
  const topicsPerPage = 5;
  const totalPages = Math.ceil(filteredAndSortedTopics.length / topicsPerPage);
  const paginatedTopics = filteredAndSortedTopics.slice(
    (currentPage - 1) * topicsPerPage,
    currentPage * topicsPerPage
  );

  // Manejar la creación de un nuevo tema
  const handleNewTopicSubmit = (e) => {
    e.preventDefault();

    if (newTopic.title.trim() === "" || newTopic.content.trim() === "") {
      return;
    }

    const currentDate = new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const newTopicObj = {
      id: Date.now(),
      title: newTopic.title,
      content: newTopic.content,
      category: newTopic.category,
      author: "Tu usuario",
      avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      createdAt: currentDate,
      replies: 0,
      views: 1,
      isNew: true,
      isHot: false,
      lastActivity: "Justo ahora",
    };

    setTopics([newTopicObj, ...topics]);

    setNewTopic({
      title: "",
      content: "",
      category: "general",
    });

    setShowNewTopicForm(false);

    setActiveCategory("all");
    setCurrentPage(1);
    setSortBy("recent");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTopic((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigateToTopic = (topicId) => {
    navigate(`/forum/topic/${topicId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Obtener categorías únicas para el sidebar
  const categories = [
    { id: "all", name: "all", icon: "layer-group" },
    { id: "general", name: "general", icon: "comments" },
    { id: "peliculas", name: "movies", icon: "film" },
    { id: "series", name: "series", icon: "tv" },
    { id: "noticias", name: "news", icon: "newspaper" },
    { id: "recomendaciones", name: "recommendations", icon: "thumbs-up" },
  ];

  const getCategoryTranslation = (categoryId) => {
    return t(`forum.categoryNames.${categoryId}`);
  };

  return (
    <MainLayout>
      <div className="forum-container">
        <div className="forum-hero">
          <div className="forum-hero-content">
            <h1>{t("forum.title")} StreamHub</h1>
            <p>{t("forum.subtitle")}</p>
          </div>
        </div>

        <div className="forum-actions">
          <div className="forum-search">
            <div className="forum-input-container">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="forum-search-input"
                placeholder={t("forum.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <button
            className="forum-create-topic-btn"
            onClick={() => setShowNewTopicForm(true)}
          >
            <i className="fas fa-plus"></i> {t("forum.newTopic")}
          </button>
        </div>

        <div className="forum-content">
          <aside className="forum-sidebar">
            <div className="forum-sidebar-section">
              <h3>{t("forum.categories")}</h3>
              <ul className="forum-category-list">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className={activeCategory === category.id ? "active" : ""}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setCurrentPage(1);
                    }}
                  >
                    <i className={`fas fa-${category.icon}`}></i>
                    {t(`forum.categoryNames.${category.name}`)}
                    {category.id !== "all" && (
                      <span className="forum-category-count">
                        {
                          topics.filter((t) => t.category === category.id)
                            .length
                        }
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="forum-sidebar-section">
              <h3>{t("forum.forumStats")}</h3>
              <div className="forum-stats-grid">
                <div className="forum-stat-item">
                  <i className="fas fa-comments"></i>
                  <div className="forum-stat-info">
                    <span className="forum-stat-value">{topics.length}</span>
                    <span className="forum-stat-label">
                      {t("forum.topics")}
                    </span>
                  </div>
                </div>
                <div className="forum-stat-item">
                  <i className="fas fa-reply-all"></i>
                  <div className="forum-stat-info">
                    <span className="forum-stat-value">
                      {topics.reduce((acc, t) => acc + t.replies, 0)}
                    </span>
                    <span className="forum-stat-label">
                      {t("forum.replies")}
                    </span>
                  </div>
                </div>
                <div className="forum-stat-item">
                  <i className="fas fa-users"></i>
                  <div className="forum-stat-info">
                    <span className="forum-stat-value">8,923</span>
                    <span className="forum-stat-label">
                      {t("forum.members")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="forum-sidebar-section">
              <h3>{t("forum.activeUsers")}</h3>
              <ul className="forum-active-users">
                <li>
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt={t("forum.userImageAlt")}
                  />
                  <div className="forum-user-info">
                    <span className="forum-username">CineExpert</span>
                    <span className="forum-user-status">
                      {t("forum.online")}
                    </span>
                  </div>
                </li>
                <li>
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt={t("forum.userImageAlt")}
                  />
                  <div className="forum-user-info">
                    <span className="forum-username">FilmLover22</span>
                    <span className="forum-user-status">
                      {t("forum.online")}
                    </span>
                  </div>
                </li>
                <li>
                  <img
                    src="https://randomuser.me/api/portraits/women/33.jpg"
                    alt={t("forum.userImageAlt")}
                  />
                  <div className="forum-user-info">
                    <span className="forum-username">SeriesAddict</span>
                    <span className="forum-user-status">
                      {t("forum.minutesAgo", { minutes: 10 })}
                    </span>
                  </div>
                </li>
                <li>
                  <img
                    src="https://randomuser.me/api/portraits/men/54.jpg"
                    alt={t("forum.userImageAlt")}
                  />
                  <div className="forum-user-info">
                    <span className="forum-username">MovieBuff</span>
                    <span className="forum-user-status">
                      {t("forum.minutesAgo", { minutes: 30 })}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="forum-sidebar-section forum-trending-topics">
              <h3>{t("forum.trendingTopics")}</h3>
              <ul>
                {topics
                  .filter((t) => t.isHot)
                  .slice(0, 3)
                  .map((topic) => (
                    <li
                      key={`hot-${topic.id}`}
                      onClick={() => navigateToTopic(topic.id)}
                    >
                      <i className="fas fa-fire"></i>
                      <span>{topic.title}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>

          <main className="forum-topics">
            {isLoading ? (
              <div className="forum-loading-spinner">
                <div className="forum-spinner"></div>
                <p>{t("forum.loading")}</p>
              </div>
            ) : (
              <>
                <div className="forum-topics-header">
                  <h2>
                    {activeCategory === "all"
                      ? t("forum.allTopics")
                      : t("forum.topicsInCategory", {
                          category: getCategoryTranslation(activeCategory),
                        })}
                  </h2>
                  <div className="forum-topics-sort">
                    <span>{t("forum.sortBy")}:</span>
                    <select
                      className="forum-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="recent">{t("forum.mostRecent")}</option>
                      <option value="popular">{t("forum.mostViewed")}</option>
                      <option value="activity">
                        {t("forum.recentActivity")}
                      </option>
                    </select>
                  </div>
                </div>

                {paginatedTopics.length === 0 ? (
                  <div className="forum-no-topics">
                    <i className="fas fa-search"></i>
                    <h3>{t("forum.noTopicsFound")}</h3>
                    <p>{t("forum.noTopicsFoundDescription")}</p>
                    <button
                      className="forum-create-topic-btn"
                      onClick={() => setShowNewTopicForm(true)}
                    >
                      <i className="fas fa-plus"></i>{" "}
                      {t("forum.createNewTopic")}
                    </button>
                  </div>
                ) : (
                  <div className="forum-topics-list">
                    {paginatedTopics.map((topic) => (
                      <div
                        className={`forum-topic-item ${
                          topic.isNew ? "new" : ""
                        }`}
                        key={topic.id}
                        onClick={() => navigateToTopic(topic.id)}
                      >
                        <div className="forum-topic-author">
                          <img src={topic.avatarUrl} alt={topic.author} />
                        </div>
                        <div className="forum-topic-content">
                          <h3>
                            {topic.title}
                            {topic.isNew && (
                              <span className="forum-topic-tag new">
                                {t("forum.new")}
                              </span>
                            )}
                            {topic.isHot && (
                              <span className="forum-topic-tag hot">
                                {t("forum.popular")}
                              </span>
                            )}
                          </h3>
                          <div className="forum-topic-meta">
                            <span className="forum-topic-author-name">
                              <i className="fas fa-user"></i> {topic.author}
                            </span>
                            <span className="forum-topic-category">
                              <i className="fas fa-folder"></i>{" "}
                              {getCategoryTranslation(topic.category)}
                            </span>
                            <span className="forum-topic-date">
                              <i className="fas fa-calendar-alt"></i>{" "}
                              {topic.createdAt}
                            </span>
                          </div>
                          <p className="forum-topic-excerpt">{topic.content}</p>
                        </div>

                        <div className="forum-topic-stats">
                          <div className="forum-stat">
                            <i className="fas fa-eye"></i>
                            <span>{topic.views}</span>
                          </div>
                          <div className="forum-stat">
                            <i className="fas fa-comment"></i>
                            <span>{topic.replies}</span>
                          </div>
                        </div>

                        <div className="forum-topic-activity">
                          <span>{t("forum.lastActivity")}</span>
                          <span className="forum-activity-time">
                            {topic.lastActivity}
                          </span>
                          <i className="fas fa-history"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="forum-pagination">
                    <button
                      className="forum-pagination-btn prev"
                      disabled={currentPage === 1}
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                    >
                      <i className="fas fa-chevron-left"></i>{" "}
                      {t("common.previous")}
                    </button>

                    <div className="forum-pagination-numbers">
                      {[...Array(totalPages)].map((_, i) => (
                        <span
                          key={i + 1}
                          className={currentPage === i + 1 ? "active" : ""}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </span>
                      ))}
                    </div>

                    <button
                      className="forum-pagination-btn next"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                    >
                      {t("common.next")}{" "}
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {showNewTopicForm && (
        <div className="forum-modal-overlay">
          <div className="forum-new-topic-form-container">
            <div className="forum-new-topic-form-header">
              <h3>{t("forum.createNewTopic")}</h3>
              <button
                onClick={() => setShowNewTopicForm(false)}
                className="forum-close-form-btn"
                aria-label={t("forum.closeForm")}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form
              onSubmit={handleNewTopicSubmit}
              className="forum-new-topic-form"
            >
              <div className="forum-form-group">
                <label htmlFor="title">{t("forum.topicTitle")}</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTopic.title}
                  onChange={handleInputChange}
                  placeholder={t("forum.topicTitlePlaceholder")}
                  required
                />
              </div>

              <div className="forum-form-group">
                <label htmlFor="category">{t("forum.category")}</label>
                <select
                  id="category"
                  name="category"
                  value={newTopic.category}
                  onChange={handleInputChange}
                >
                  <option value="general">
                    {t("forum.categoryNames.general")}
                  </option>
                  <option value="peliculas">
                    {t("forum.categoryNames.movies")}
                  </option>
                  <option value="series">
                    {t("forum.categoryNames.series")}
                  </option>
                  <option value="noticias">
                    {t("forum.categoryNames.news")}
                  </option>
                  <option value="recomendaciones">
                    {t("forum.categoryNames.recommendations")}
                  </option>
                </select>
              </div>

              <div className="forum-form-group">
                <label htmlFor="content">{t("forum.content")}</label>
                <textarea
                  id="content"
                  name="content"
                  value={newTopic.content}
                  onChange={handleInputChange}
                  placeholder={t("forum.contentPlaceholder")}
                  rows="8"
                  required
                ></textarea>
              </div>

              <div className="forum-form-actions">
                <button
                  type="button"
                  onClick={() => setShowNewTopicForm(false)}
                  className="forum-cancel-btn"
                >
                  {t("common.cancel")}
                </button>
                <button type="submit" className="forum-submit-btn">
                  <i className="fas fa-paper-plane"></i>{" "}
                  {t("forum.publishTopic")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

const forumTopics = [
  {
    id: 1,
    title: "¿Cuál es la mejor serie de ciencia ficción de todos los tiempos?",
    content:
      "Estoy buscando una buena serie de ciencia ficción para maratonear este fin de semana. ¿Cuáles me recomendarían como las mejores de todos los tiempos? Ya he visto Battlestar Galactica y The Expanse pero busco algo nuevo que realmente valga la pena.",
    category: "series",
    author: "CineExpert",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    createdAt: "5 Mar 2025",
    replies: 24,
    views: 342,
    isNew: false,
    isHot: true,
    lastActivity: "Hace 2 horas",
  },
  {
    id: 2,
    title: "Netflix aumentará sus precios en abril 2025",
    content:
      "Según un comunicado oficial, Netflix planea aumentar el precio de sus suscripciones a partir de abril. Los planes básicos subirán un 12% y los premium hasta un 15%. ¿Qué opinan? ¿Vale la pena seguir pagando con tantas opciones disponibles?",
    category: "noticias",
    author: "StreamNews",
    avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg",
    createdAt: "7 Mar 2025",
    replies: 18,
    views: 156,
    isNew: true,
    isHot: false,
    lastActivity: "Hace 5 horas",
  },
  {
    id: 3,
    title: "Análisis: El último estreno de Christopher Nolan",
    content:
      "Acabo de ver la última película de Nolan y quería compartir mis impresiones. Sin spoilers, creo que es una de sus mejores obras hasta la fecha por su narrativa compleja pero accesible, y los efectos visuales que complementan perfectamente la historia sin sobresaturarla.",
    category: "peliculas",
    author: "FilmCritic87",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    createdAt: "2 Mar 2025",
    replies: 42,
    views: 520,
    isNew: false,
    isHot: true,
    lastActivity: "Ayer",
  },
  {
    id: 4,
    title: "Recomendaciones de documentales sobre naturaleza",
    content:
      "Estoy buscando buenos documentales sobre naturaleza y vida salvaje. ¿Alguien tiene recomendaciones aparte de los de David Attenborough? Me interesan especialmente los que tratan sobre conservación marina o ecosistemas poco conocidos.",
    category: "recomendaciones",
    author: "NatureLover",
    avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    createdAt: "6 Mar 2025",
    replies: 12,
    views: 98,
    isNew: true,
    isHot: false,
    lastActivity: "Hace 1 día",
  },
  {
    id: 5,
    title: "¿Qué plataforma de streaming ofrece mejor relación calidad-precio?",
    content:
      "Con tantas plataformas disponibles (Netflix, HBO Max, Disney+, Prime Video, Apple TV+...), me pregunto cuál creen que ofrece el mejor catálogo por el precio que se paga actualmente. Tengo que recortar gastos y solo puedo mantener dos suscripciones.",
    category: "general",
    author: "DecisionMaker",
    avatarUrl: "https://randomuser.me/api/portraits/men/54.jpg",
    createdAt: "1 Mar 2025",
    replies: 35,
    views: 310,
    isNew: false,
    isHot: false,
    lastActivity: "Hace 3 días",
  },
  {
    id: 6,
    title: "¿Han cancelado tu serie favorita? Comparte tu indignación",
    content:
      "Mi serie favorita acaba de ser cancelada después de solo dos temporadas dejando muchas tramas sin resolver. ¿A alguien más le ha pasado? ¿Qué series creen que merecían más temporadas para desarrollar adecuadamente su historia?",
    category: "series",
    author: "SeriesAddict",
    avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    createdAt: "28 Feb 2025",
    replies: 48,
    views: 425,
    isNew: false,
    isHot: true,
    lastActivity: "Hace 4 días",
  },
  {
    id: 7,
    title: "Las mejores películas de superhéroes de la última década",
    content:
      "¿Cuáles consideran que son las películas de superhéroes más destacadas de los últimos años? Personalmente creo que Logan, The Dark Knight y Spider-Man: Into the Spider-Verse están muy por encima del resto, pero me gustaría conocer otras opiniones.",
    category: "peliculas",
    author: "ComicBookFan",
    avatarUrl: "https://randomuser.me/api/portraits/men/88.jpg",
    createdAt: "26 Feb 2025",
    replies: 29,
    views: 276,
    isNew: false,
    isHot: false,
    lastActivity: "Hace 5 días",
  },
  {
    id: 8,
    title: "Debate: ¿Están las plataformas de streaming matando al cine?",
    content:
      "Con el creciente dominio de las plataformas de streaming y sus producciones originales, ¿creen que estamos presenciando el declive de la experiencia cinematográfica tradicional? ¿O simplemente es una evolución natural del medio?",
    category: "general",
    author: "CinemaLover",
    avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    createdAt: "22 Feb 2025",
    replies: 64,
    views: 580,
    isNew: false,
    isHot: true,
    lastActivity: "Hace 1 semana",
  },
];

export default Forum;
