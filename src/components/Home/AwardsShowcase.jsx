import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import "../../styles/components/awards.css";

function AwardsShowcase() {
  const [activeAward, setActiveAward] = useState(0);
  const sliderRef = useRef(null);
  const { t } = useLanguage();

  // Datos para la sección de premios
  const awardedContent = [
    {
      id: 1,
      titleKey: "awards.movies.silenceMelody.title",
      directorKey: "awards.movies.silenceMelody.director",
      image:
        "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      awards: [
        {
          nameKey: "awards.names.oscar",
          categoryKey: "awards.categories.bestPicture",
          year: "2024",
        },
        {
          nameKey: "awards.names.goldenGlobe",
          categoryKey: "awards.categories.bestDirector",
          year: "2024",
        },
      ],
      synopsisKey: "awards.movies.silenceMelody.synopsis",
      type: "movie",
    },
    {
      id: 2,
      titleKey: "awards.movies.lostHorizons.title",
      directorKey: "awards.movies.lostHorizons.director",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      awards: [
        {
          nameKey: "awards.names.bafta",
          categoryKey: "awards.categories.bestCinematography",
          year: "2024",
        },
        {
          nameKey: "awards.names.cannes",
          categoryKey: "awards.categories.palmeDor",
          year: "2023",
        },
      ],
      synopsisKey: "awards.movies.lostHorizons.synopsis",
      type: "movie",
    },
    {
      id: 3,
      titleKey: "awards.series.dawnChronicles.title",
      directorKey: "awards.series.dawnChronicles.director",
      image:
        "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
      awards: [
        {
          nameKey: "awards.names.emmy",
          categoryKey: "awards.categories.bestDramaSeries",
          year: "2023",
        },
        {
          nameKey: "awards.names.criticsChoice",
          categoryKey: "awards.categories.bestEnsemble",
          year: "2023",
        },
      ],
      synopsisKey: "awards.series.dawnChronicles.synopsis",
      type: "series",
    },
  ];

  const handleSelect = (index) => {
    setActiveAward(index);

    // Scroll al elemento seleccionado en móvil
    if (sliderRef.current && window.innerWidth < 768) {
      const scrollPosition = index * 120; // Ancho aproximado de cada ítem + margen
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="awards-showcase">
      <div className="section-header">
        <h2>{t("home.awards.title")}</h2>
        <p className="section-description">{t("home.awards.subtitle")}</p>
      </div>

      <div className="awards-container">
        <div className="awards-feature">
          <div className="awards-image">
            <img
              src={awardedContent[activeAward].image}
              alt={t(awardedContent[activeAward].titleKey)}
            />
            <div className="awards-overlay"></div>
            <div className="awards-badges">
              {awardedContent[activeAward].awards.map((award, index) => (
                <div key={index} className="award-badge">
                  <div className="award-icon">
                    {award.nameKey === "awards.names.oscar" && (
                      <i className="fas fa-award"></i>
                    )}
                    {award.nameKey === "awards.names.goldenGlobe" && (
                      <i className="fas fa-globe-americas"></i>
                    )}
                    {award.nameKey === "awards.names.bafta" && (
                      <i className="fas fa-mask"></i>
                    )}
                    {award.nameKey === "awards.names.emmy" && (
                      <i className="fas fa-tv"></i>
                    )}
                    {award.nameKey === "awards.names.cannes" && (
                      <i className="fas fa-film"></i>
                    )}
                    {award.nameKey === "awards.names.criticsChoice" && (
                      <i className="fas fa-star"></i>
                    )}
                  </div>
                  <div className="award-info">
                    <span className="award-name">{t(award.nameKey)}</span>
                    <span className="award-category">
                      {t(award.categoryKey)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to={`/explore?content=${
                awardedContent[activeAward].type === "movie"
                  ? "films"
                  : "series"
              }`}
              className="watch-now-btn"
            >
              <i className="fas fa-play"></i> {t("common.exploreMovies")}
            </Link>
          </div>

          <div className="awards-info">
            <h3>{t(awardedContent[activeAward].titleKey)}</h3>
            <p className="awards-director">
              {t("home.awards.director")}:{" "}
              {t(awardedContent[activeAward].directorKey)}
            </p>
            <p className="awards-synopsis">
              {t(awardedContent[activeAward].synopsisKey)}
            </p>
            <div className="awards-type">
              <span
                className={
                  awardedContent[activeAward].type === "movie"
                    ? "movie-badge"
                    : "series-badge"
                }
              >
                {awardedContent[activeAward].type === "movie"
                  ? t("common.movie")
                  : t("common.series")}
              </span>
            </div>
          </div>
        </div>

        <div className="awards-selector" ref={sliderRef}>
          {awardedContent.map((item, index) => (
            <div
              key={index}
              className={`award-select-item ${
                index === activeAward ? "active" : ""
              }`}
              onClick={() => handleSelect(index)}
            >
              <div className="award-select-image">
                <img src={item.image} alt={t(item.titleKey)} />
              </div>
              <div className="award-select-info">
                <h4>{t(item.titleKey)}</h4>
                <span className="award-select-badge">
                  {t(item.awards[0].nameKey)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AwardsShowcase;
