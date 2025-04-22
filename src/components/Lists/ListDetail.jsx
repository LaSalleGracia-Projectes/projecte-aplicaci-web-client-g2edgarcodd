import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import "../styles/components/lists.css";

function ListDetail() {
  const { t } = useLanguage();
  const { listId } = useParams();
  const navigate = useNavigate();
  const [listData, setListData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulación de datos de lista (en producción, se obtendría de una API)
    const mockData = {
      id: listId,
      name: "Maratón de fin de semana",
      description: "Películas y series para ver en un fin de semana",
      items: [
        {
          id: 1,
          title: "The Dark Knight",
          posterPath:
            "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          type: "movie",
        },
        {
          id: 2,
          title: "Breaking Bad",
          posterPath:
            "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
          type: "series",
        },
        {
          id: 3,
          title: "Inception",
          posterPath:
            "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
          type: "movie",
        },
      ],
    };

    setTimeout(() => {
      setListData(mockData);
      setIsLoading(false);
    }, 800);
  }, [listId]);

  if (isLoading) {
    return (
      <div className="lists-page">
        <div className="lists-loading">
          <div className="loading-spinner"></div>
          <p>
            {t("common.loading")} {t("lists.list").toLowerCase()}...
          </p>
        </div>
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="lists-page">
        <div className="lists-error">
          <p>{t("lists.notFound")}</p>
          <button className="btn-primary" onClick={() => navigate(-1)}>
            {t("common.goBack")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lists-page">
      <div className="lists-container">
        <div className="list-detail-header">
          <h1 className="list-detail-title">{listData.name}</h1>
          <p className="list-detail-description">{listData.description}</p>
        </div>
        <div className="list-items-grid">
          {listData.items.map((item) => (
            <div key={item.id} className="list-item-card">
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
              <h3 className="list-item-title">{item.title}</h3>
              <p className="list-item-type">
                {item.type === "movie" ? t("common.movie") : t("common.series")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListDetail;
