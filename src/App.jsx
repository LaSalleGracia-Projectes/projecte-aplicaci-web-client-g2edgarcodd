import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import Footer from './components/Footer/Footer';
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
      <Header />
      <main className="main-content">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default App;