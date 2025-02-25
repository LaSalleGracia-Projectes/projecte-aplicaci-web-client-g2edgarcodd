// src/components/layout/SearchOverlay.jsx
import React from 'react';

const SearchOverlay = ({ active, onClose }) => {
  return (
    <div 
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-40 transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl px-5"
        onClick={e => e.stopPropagation()}
      >
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full p-4 text-xl rounded border-none"
          autoFocus={active}
        />
      </div>
    </div>
  );
};

export default SearchOverlay;