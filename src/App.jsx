import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './styles/global.css';
import './App.css';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.opacity = '1';
  }, [location.pathname]);

  return (
    <div className="App">
      <main className="main-content">
        <HomePage />
      </main>
    </div>
  );
}

export default App;