import React from "react";

const AdminVerificationAnimation = () => {
  return (
    <div className="admin-verification-animation">
      {/* Fondo de partículas */}
      <div className="admin-verification-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      <svg
        className="admin-verification-svg"
        width="200"
        height="200"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Círculos giratorios con trazos graduales */}
        <circle
          className="admin-verification-circle admin-verification-circle-1"
          cx="50"
          cy="50"
          r="45"
          strokeWidth="2"
          fill="none"
          stroke="url(#gradient1)"
        />
        <circle
          className="admin-verification-circle admin-verification-circle-2"
          cx="50"
          cy="50"
          r="35"
          strokeWidth="1.5"
          fill="none"
          stroke="url(#gradient2)"
        />

        {/* Efecto hexagonal */}
        <path
          className="admin-verification-hex"
          d="M50,18 L77,32 L77,68 L50,82 L23,68 L23,32 Z"
          fill="none"
          strokeWidth="1.2"
          stroke="url(#gradient3)"
        />

        {/* Círculo interior pulsante */}
        <circle
          className="admin-verification-pulse"
          cx="50"
          cy="50"
          r="25"
          fill="none"
          strokeWidth="2"
          stroke="url(#gradient4)"
        />

        {/* Símbolo de escudo/admin */}
        <path
          className="admin-verification-shield"
          d="M50,25 L65,35 L65,55 C65,62 58,68 50,75 C42,68 35,62 35,55 L35,35 Z"
          fill="url(#shieldFill)"
          strokeWidth="1.5"
          stroke="var(--color-accent)"
        />

        {/* Símbolo de verificación dentro del escudo */}
        <path
          className="admin-verification-check"
          d="M42,53 L47.5,59 L59,43"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="var(--color-bg)"
        />

        {/* Puntos de escaneo que se mueven horizontalmente */}
        <g className="admin-verification-scanning">
          <circle
            className="admin-verification-scan-dot scan-dot-1"
            cx="20"
            cy="50"
            r="1.5"
            fill="var(--color-accent)"
          />
          <circle
            className="admin-verification-scan-dot scan-dot-2"
            cx="40"
            cy="50"
            r="1.5"
            fill="var(--color-accent)"
          />
          <circle
            className="admin-verification-scan-dot scan-dot-3"
            cx="60"
            cy="50"
            r="1.5"
            fill="var(--color-accent)"
          />
          <circle
            className="admin-verification-scan-dot scan-dot-4"
            cx="80"
            cy="50"
            r="1.5"
            fill="var(--color-accent)"
          />
        </g>

        {/* Definiciones de gradientes */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBC500" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FBC500" stopOpacity="1" />
            <stop offset="100%" stopColor="#FBC500" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3182CE" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#3182CE" stopOpacity="1" />
            <stop offset="100%" stopColor="#3182CE" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="gradient3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FBC500" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#FBC500" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FBC500" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="gradient4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBC500" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3182CE" stopOpacity="0.5" />
          </linearGradient>

          <radialGradient
            id="shieldFill"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="20%"
          >
            <stop offset="0%" stopColor="#FBC500" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FBC500" stopOpacity="0.3" />
          </radialGradient>
        </defs>
      </svg>

      {/* Efecto de luz brillante en el fondo */}
      <div className="admin-verification-glow"></div>
    </div>
  );
};

export default AdminVerificationAnimation;
