import React from "react";
import PropTypes from "prop-types";
import "../../styles/components/ui.css";

/**
 * Componente para mostrar una calificación con estrellas
 */
const Rating = ({
  value = 0,
  maxValue = 10,
  showValue = true,
  size = "md",
  className = "",
  type = "star",
}) => {
  // Convertir a escala de 5 estrellas (para simplificar la representación visual)
  const normalizedValue = (value / maxValue) * 5;

  // Determinar el número de estrellas completas, medias y vacías
  const fullStars = Math.floor(normalizedValue);
  const hasHalfStar = normalizedValue % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Determinar el color según la puntuación (normalizada a máximo valor)
  const ratingPercentage = (value / maxValue) * 100;
  let ratingColor = "";

  if (ratingPercentage >= 80) {
    ratingColor = "rating-excellent"; // Verde
  } else if (ratingPercentage >= 60) {
    ratingColor = "rating-good"; // Verde claro
  } else if (ratingPercentage >= 40) {
    ratingColor = "rating-average"; // Amarillo
  } else if (ratingPercentage >= 20) {
    ratingColor = "rating-poor"; // Naranja
  } else {
    ratingColor = "rating-bad"; // Rojo
  }

  // Seleccionar el icono según el tipo
  const fullIcon = type === "star" ? "fas fa-star" : "fas fa-circle";
  const halfIcon = type === "star" ? "fas fa-star-half-alt" : "fas fa-adjust";
  const emptyIcon = type === "star" ? "far fa-star" : "far fa-circle";

  return (
    <div className={`rating-container ${size} ${className} ${ratingColor}`}>
      <div className="rating-stars">
        {/* Estrellas completas */}
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className={fullIcon}></i>
        ))}

        {/* Media estrella si es necesario */}
        {hasHalfStar && <i className={halfIcon}></i>}

        {/* Estrellas vacías */}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className={emptyIcon}></i>
        ))}
      </div>

      {showValue && (
        <div className="rating-value">
          <span>{value.toFixed(1)}</span>
          {maxValue && <span className="rating-max">/{maxValue}</span>}
        </div>
      )}
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number,
  maxValue: PropTypes.number,
  showValue: PropTypes.bool,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  type: PropTypes.oneOf(["star", "circle"]),
};

export default Rating;
