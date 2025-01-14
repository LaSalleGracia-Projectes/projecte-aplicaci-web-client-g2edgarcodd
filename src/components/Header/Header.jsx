import React from 'react';
import Navbar from './Navbar';
import SearchOverlay from './SearchOverlay';
import logoImage from '../../assets/streamhub.png'; 
import '../../styles/components/header.css';

function Header() {
  const [searchActive, setSearchActive] = React.useState(false);
  
  const toggleSearch = () => {
    setSearchActive(!searchActive);
  };

  return (
    <header>
      <Navbar toggleSearch={toggleSearch} logo={logoImage} />
      <SearchOverlay active={searchActive} />
    </header>
  );
}

export default Header;