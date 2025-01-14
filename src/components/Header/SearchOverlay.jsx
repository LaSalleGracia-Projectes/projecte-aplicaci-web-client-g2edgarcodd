// src/components/Header/SearchOverlay.jsx
import React from 'react';

function SearchOverlay({ active }) {
  return (
    <div className={`search-overlay ${active ? 'active' : ''}`} id="searchOverlay">
      <div className="search-box">
        <input type="text" placeholder="Buscar..." />
      </div>
    </div>
  );
}

export default SearchOverlay;