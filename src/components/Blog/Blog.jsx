import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import "../../styles/components/Blog.css";

// Datos de muestra para el blog
const blogCategories = [
  { id: "all", name: "allCategories", count: 28 },
  { id: "streaming", name: "streaming", count: 12 },
  { id: "reviews", name: "reviews", count: 7 },
  { id: "tech", name: "tech", count: 5 },
  { id: "industry", name: "industry", count: 4 },
];

// Post principales
const blogPosts = [
  {
    id: 1,
    title: "Las 10 series más esperadas para este 2025",
    excerpt:
      "Descubre las producciones más anticipadas que llegarán a las principales plataformas de streaming este año y por qué no puedes perdértelas.",
    image:
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    category: "streaming",
    author: "María González",
    authorImage: "https://randomuser.me/api/portraits/women/45.jpg",
    date: "10 Feb 2025",
    readTime: "5 min",
    views: 1245,
    comments: 32,
    featured: "main",
  },
  {
    id: 2,
    title: "El futuro de la realidad virtual en el contenido streaming",
    excerpt:
      "Cómo las tecnologías VR están transformando nuestra forma de consumir películas y series. Un vistazo a los próximos lanzamientos y desarrollos.",
    image:
      "https://images.unsplash.com/photo-1626387346567-68d0b1ee4f22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    category: "tech",
    author: "Carlos Martínez",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "5 Feb 2025",
    readTime: "8 min",
    views: 980,
    comments: 18,
    featured: "secondary",
  },
  {
    id: 3,
    title: "Análisis: Los efectos visuales en 'Duna: Parte Dos'",
    excerpt:
      "Un profundo análisis de la revolución técnica que supone esta película para la industria cinematográfica.",
    image:
      "https://images.unsplash.com/photo-1617113930975-f9c7243ae527?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    category: "reviews",
    author: "Ana Pérez",
    authorImage: "https://randomuser.me/api/portraits/women/68.jpg",
    date: "1 Feb 2025",
    readTime: "10 min",
    views: 1432,
    comments: 45,
  },
  {
    id: 4,
    title:
      "Cómo las plataformas de streaming están cambiando la producción cinematográfica",
    excerpt:
      "El impacto de Netflix, Prime Video y otros servicios en la forma en que se financian y distribuyen las películas actualmente.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    category: "industry",
    author: "Roberto Sánchez",
    authorImage: "https://randomuser.me/api/portraits/men/54.jpg",
    date: "28 Ene 2025",
    readTime: "7 min",
    views: 867,
    comments: 12,
  },
  {
    id: 5,
    title: "Las mejores apps para mejorar tu experiencia de streaming",
    excerpt:
      "Aplicaciones complementarias que harán que disfrutes aún más de tus series y películas favoritas.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    category: "tech",
    author: "Lucía Fernández",
    authorImage: "https://randomuser.me/api/portraits/women/33.jpg",
    date: "20 Ene 2025",
    readTime: "6 min",
    views: 712,
    comments: 8,
  },
  {
    id: 6,
    title: "La evolución de los superhéroes en el streaming moderno",
    excerpt:
      "De los cómics a las series premium: análisis de cómo han evolucionado las historias de superhéroes.",
    image:
      "https://images.unsplash.com/photo-1559803424-045ec8c53682?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    category: "streaming",
    author: "Miguel Torres",
    authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
    date: "15 Ene 2025",
    readTime: "9 min",
    views: 934,
    comments: 24,
  },
];

const popularPosts = [
  {
    id: 7,
    title:
      "Guía definitiva para configurar el audio perfecto en tu home cinema",
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    date: "12 Ene 2025",
    views: 2453,
  },
  {
    id: 8,
    title: "Entrevista exclusiva con el director de 'El Pingüino'",
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0822045d55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    date: "8 Ene 2025",
    views: 1876,
  },
  {
    id: 9,
    title: "Los secretos detrás de las mejores series de ciencia ficción",
    image:
      "https://images.unsplash.com/photo-1506512420485-c8d01230766b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    date: "3 Ene 2025",
    views: 2089,
  },
];

function Blog() {
  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const postsPerPage = 6;

  // Obtener la función de traducción
  const { t, language } = useLanguage();

  // Cargar datos inicialmente
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredPosts(blogPosts);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filtrar por categoría y búsqueda
  useEffect(() => {
    let results = [...blogPosts];

    // Filtrar por categoría
    if (activeCategory !== "all") {
      results = results.filter((post) => post.category === activeCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.excerpt.toLowerCase().includes(search)
      );
    }

    setFilteredPosts(results);
    setCurrentPage(1); // Volver a la primera página al cambiar filtros
  }, [activeCategory, searchTerm]);

  // Posts destacados
  const mainFeatured = blogPosts.find((post) => post.featured === "main");
  const secondaryFeatured = blogPosts.find(
    (post) => post.featured === "secondary"
  );

  // Paginación
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Manejadores de eventos
  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 450);
  };

  // Traducción de categorías con mejor manejo de errores
  const getCategoryName = (category) => {
    try {
      // Valores por defecto según el idioma
      const defaults = {
        allCategories:
          language === "ca" ? "Totes" : language === "en" ? "All" : "Todas",
        streaming: "Streaming",
        reviews:
          language === "ca"
            ? "Ressenyes"
            : language === "en"
            ? "Reviews"
            : "Reseñas",
        tech:
          language === "ca"
            ? "Tecnologia"
            : language === "en"
            ? "Technology"
            : "Tecnología",
        industry:
          language === "ca"
            ? "Indústria"
            : language === "en"
            ? "Industry"
            : "Industria",
      };

      let translationKey = "";
      switch (category) {
        case "allCategories":
          translationKey = "blog.allCategories";
          break;
        case "streaming":
        case "reviews":
        case "tech":
        case "industry":
          translationKey = `blog.categories.${category}`;
          break;
        default:
          return category; // Si no coincide con ninguna categoría conocida
      }

      // Intentar obtener la traducción, con fallback al valor por defecto
      const translation = t(translationKey, defaults[category] || category);
      return translation;
    } catch (error) {
      console.error(`Error al traducir categoría ${category}:`, error);
      // Si hay un error, devolver el nombre de la categoría tal cual
      return category;
    }
  };

  // Función de seguridad para traducciones
  const safeTranslate = (key, defaultValue) => {
    try {
      return t(key, defaultValue);
    } catch (error) {
      console.error(`Error al traducir ${key}:`, error);
      return defaultValue;
    }
  };

  return (
    <div className="blog-container">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1>StreamHub {safeTranslate("blog.blogTitle", "Blog")}</h1>
          <p>
            {safeTranslate(
              "blog.blogSubtitle",
              "Descubre las últimas tendencias, análisis y noticias sobre el mundo del streaming, cine y televisión"
            )}
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="blog-search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={safeTranslate(
              "blog.searchPlaceholder",
              "Buscar en el blog..."
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="search-btn"
            aria-label={safeTranslate("common.search", "Buscar")}
          >
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      <div className="blog-content">
        {/* Sidebar */}
        <aside className="blog-sidebar">
          {/* Categorías */}
          <div className="blog-categories">
            <h3>{safeTranslate("blog.categories", "Categorías")}</h3>
            <ul>
              {blogCategories.map((category) => (
                <li
                  key={category.id}
                  className={activeCategory === category.id ? "active" : ""}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {getCategoryName(category.name)}
                  <span className="category-count">{category.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="blog-newsletter">
            <h3>
              {safeTranslate(
                "blog.subscribeNewsletter",
                "Suscríbete a nuestro boletín"
              )}
            </h3>
            <p>
              {safeTranslate(
                "blog.newsletterDescription",
                "Recibe las últimas noticias y actualizaciones directamente en tu correo electrónico"
              )}
            </p>
            <form>
              <input
                type="email"
                placeholder={safeTranslate(
                  "blog.emailPlaceholder",
                  "Tu correo electrónico"
                )}
                required
              />
              <button type="submit">
                {safeTranslate("blog.subscribe", "Suscribirme")}
              </button>
            </form>
          </div>

          {/* Posts populares */}
          <div className="popular-posts">
            <h3>
              {safeTranslate("blog.popularPosts", "Publicaciones populares")}
            </h3>
            <div className="popular-posts-list">
              {popularPosts.map((post) => (
                <Link
                  to={`/blog/${post.id}`}
                  key={post.id}
                  className="popular-post-item"
                >
                  <div className="popular-post-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                  <div className="popular-post-content">
                    <h4>{post.title}</h4>
                    <span>
                      <i className="far fa-calendar"></i> {post.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="blog-main">
          {/* Posts destacados */}
          {!isLoading && !searchTerm && currentPage === 1 && (
            <div className="featured-posts">
              {mainFeatured && (
                <Link
                  to={`/blog/${mainFeatured.id}`}
                  className="featured-post main-featured"
                >
                  <div className="featured-post-image">
                    <img src={mainFeatured.image} alt={mainFeatured.title} />
                  </div>
                  <div className="featured-post-overlay">
                    <span className="featured-post-category">
                      {getCategoryName(mainFeatured.category)}
                    </span>
                    <h2 className="featured-post-title">
                      {mainFeatured.title}
                    </h2>
                    <div className="featured-post-meta">
                      <div className="featured-post-author">
                        <img
                          src={mainFeatured.authorImage}
                          alt={mainFeatured.author}
                        />
                        <span>{mainFeatured.author}</span>
                      </div>
                      <div className="featured-post-date">
                        <i className="far fa-calendar"></i> {mainFeatured.date}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {secondaryFeatured && (
                <Link
                  to={`/blog/${secondaryFeatured.id}`}
                  className="featured-post secondary-featured"
                >
                  <div className="featured-post-image">
                    <img
                      src={secondaryFeatured.image}
                      alt={secondaryFeatured.title}
                    />
                  </div>
                  <div className="featured-post-overlay">
                    <span className="featured-post-category">
                      {getCategoryName(secondaryFeatured.category)}
                    </span>
                    <h2 className="featured-post-title">
                      {secondaryFeatured.title}
                    </h2>
                    <div className="featured-post-meta">
                      <div className="featured-post-author">
                        <img
                          src={secondaryFeatured.authorImage}
                          alt={secondaryFeatured.author}
                        />
                        <span>{secondaryFeatured.author}</span>
                      </div>
                      <div className="featured-post-date">
                        <i className="far fa-calendar"></i>{" "}
                        {secondaryFeatured.date}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* Estado de carga o posts */}
          {isLoading ? (
            <div className="blog-loading">
              <div className="loading-spinner"></div>
              <p>{safeTranslate("blog.loading", "Cargando artículos...")}</p>
            </div>
          ) : currentPosts.length > 0 ? (
            <div className="blog-posts-grid">
              {currentPosts.map((post) => (
                <Link
                  to={`/blog/${post.id}`}
                  key={post.id}
                  className="blog-post-card"
                >
                  <div className="blog-post-image">
                    <span className="blog-post-category">
                      {getCategoryName(post.category)}
                    </span>
                    <img src={post.image} alt={post.title} />
                  </div>
                  <div className="blog-post-content">
                    <h2 className="blog-post-title">{post.title}</h2>
                    <p className="blog-post-excerpt">{post.excerpt}</p>
                    <div className="blog-post-meta">
                      <div className="blog-post-author">
                        <img src={post.authorImage} alt={post.author} />
                        <span>{post.author}</span>
                      </div>
                      <div className="blog-post-date">
                        <i className="far fa-calendar"></i> {post.date}
                      </div>
                    </div>
                    <div className="blog-post-stats">
                      <span>
                        <i className="far fa-clock"></i> {post.readTime}
                      </span>
                      <span>
                        <i className="far fa-eye"></i> {post.views}
                      </span>
                      <span>
                        <i className="far fa-comment"></i> {post.comments}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-posts-found">
              <i className="far fa-frown"></i>
              <h3>
                {safeTranslate(
                  "blog.noPostsFound",
                  "No se encontraron publicaciones"
                )}
              </h3>
              <p>
                {safeTranslate(
                  "blog.tryDifferentSearch",
                  "Intenta con otra búsqueda o navegación por categorías"
                )}
              </p>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="blog-pagination">
              <button
                className={`pagination-btn prev ${
                  currentPage === 1 ? "disabled" : ""
                }`}
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>{" "}
                {safeTranslate("common.previous", "Anterior")}
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className={`pagination-btn next ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                {safeTranslate("common.next", "Siguiente")}{" "}
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blog;
