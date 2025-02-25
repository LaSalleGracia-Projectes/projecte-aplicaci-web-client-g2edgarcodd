// src/components/ui/LanguageSelector.jsx
import React, { useState } from 'react';
import { FaGlobe } from 'react-icons/fa';

const LanguageSelector = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [language, setLanguage] = useState('Español');
  
  const languages = ['Español', 'Catalán', 'Inglés'];
  
  return (
    <div 
      className="relative cursor-pointer transition duration-200 hover:scale-105"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <div className="flex items-center gap-2 text-text">
        <FaGlobe />
        <span>{language}</span>
      </div>
      
      {dropdownOpen && (
        <ul className="absolute top-full right-0 bg-background-light min-w-[120px] py-2 rounded shadow-lg z-50">
          {languages.map((lang) => (
            <li 
              key={lang}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => setLanguage(lang)}
            >
              {lang}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;