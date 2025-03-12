import React from 'react';

function StreamingProviders({ providers, activeProvider, onProviderSelect }) {
  return (
    <div className="streaming-providers">
      <div className="providers-container">
        {providers.map(provider => (
          <div 
            key={provider.id}
            className={`provider-item ${activeProvider === provider.id ? 'active' : ''}`}
            onClick={() => onProviderSelect(provider.id)}
          >
            {provider.id === 'all' ? (
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
                    e.target.src = "https://via.placeholder.com/80x40?text=" + provider.name;
                  }}
                />
              </div>
            )}
            <span className="provider-name">{provider.name}</span>
            {activeProvider === provider.id && <div className="active-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StreamingProviders;