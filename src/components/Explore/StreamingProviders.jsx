import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function StreamingProviders({ providers, activeProvider, onProviderSelect }) {
  const { t } = useLanguage();

  return (
    <div className="streaming-providers">
      <div className="providers-container">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`provider-item ${
              activeProvider === provider.id ? "active" : ""
            }`}
            onClick={() => onProviderSelect(provider.id)}
            role="button"
            aria-pressed={activeProvider === provider.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onProviderSelect(provider.id);
              }
            }}
          >
            {provider.id === "all" ? (
              <div className="all-providers-icon">
                <i className="fas fa-globe"></i>
              </div>
            ) : (
              <div className="provider-logo">
                <img
                  src={provider.logo}
                  alt={provider.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/80x40?text=${provider.name.charAt(
                      0
                    )}`;
                  }}
                  loading="lazy"
                />
              </div>
            )}
            <span className="provider-name">{provider.name}</span>
            {activeProvider === provider.id && (
              <>
                <span className="provider-checkmark">
                  <i className="fas fa-check-circle"></i>
                </span>
                <div className="active-indicator"></div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StreamingProviders;
