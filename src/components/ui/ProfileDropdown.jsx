// src/components/ui/ProfileDropdown.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';

const ProfileDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const menuItems = [
    { label: 'Perfil', href: '/perfil' },
    { label: 'Favoritos', href: '/favoritos' },
    { label: 'Listas', href: '/listas' },
    { label: 'Opciones', href: '/opciones' },
    { label: 'Desconectar', href: '/logout' },
  ];
  
  return (
    <div 
      className="relative cursor-pointer transition duration-200 hover:scale-105"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <FaUser className="text-text" />
      
      {dropdownOpen && (
        <ul className="absolute top-full right-0 bg-background-light min-w-[150px] py-2 rounded shadow-lg z-50">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link 
                href={item.href}
                className="block px-4 py-2 hover:bg-gray-700"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;