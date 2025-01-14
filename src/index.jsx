import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import MovieDetailPage from './pages/MovieDetailPage';
import Forum from './components/Forum/Forum';
import Blog from './components/Blog/Blog';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import UpdateProfile from './components/Auth/UpdateProfile';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/series/:id" element={<MovieDetailPage />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/blog" element={<Blog />} />
        
        {/* Rutas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile/update" element={<UpdateProfile />} />
        
      </Routes>
    </Router>
  </React.StrictMode>
);