import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function StreamingProviders({ providers, activeProvider, onProviderSelect }) {
  const { t } = useLanguage();

  if (!providers || providers.length === 0) {
    return null;
  }

  return (
    <div className="streaming-providers">
      <h3>{t("explore.streamingProviders")}</h3>
      <ul className="provider-list">
        {providers.map((provider) => (
          <li
            key={provider.id}
            className={`provider-item ${
              activeProvider === provider.id ? "active" : ""
            }`}
            onClick={() => onProviderSelect(provider.id)}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onProviderSelect(provider.id);
              }
            }}
          >
            <div className="provider-content">
              {provider.logo && (
                <img
                  src={provider.logo}
                  alt={provider.name}
                  className="provider-logo"
                />
              )}
              <span className="provider-name">{provider.name}</span>
              {activeProvider === provider.id && (
                <span className="provider-check">
                  <i className="fas fa-check"></i>
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamingProviders;
