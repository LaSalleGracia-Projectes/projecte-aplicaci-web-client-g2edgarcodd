import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProfileHeader from '../components/Profile/ProfileHeader';
import AccountSummary from '../components/Profile/AccountSummary';
import ActivityFeed from '../components/Profile/ActivityFeed';
import ProfileSettings from '../components/Profile/ProfileSettings';
import '../styles/components/profile.css';

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  
  // Simulamos obtener datos del usuario
  useEffect(() => {
    // En una aplicación real, aquí harías una llamada a la API
    setTimeout(() => {
      setUserData({
        id: 'user123',
        username: 'mateo_cinephile',
        fullName: 'Mateo Acha',
        email: 'mateo.acha@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
        coverImage: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        statusMessage: 'Explorando el universo cinematográfico',
        memberSince: '2021-05-18',
        plan: 'Premium',
        planExpiry: '2025-08-15',
        watchTime: 523, 
        favoriteGenres: ['Acción', 'Ciencia Ficción', 'Suspense'],
        genreStats: [
          { name: 'Acción', percentage: 45, hours: 235 },
          { name: 'Ciencia Ficción', percentage: 30, hours: 157 },
          { name: 'Suspense', percentage: 15, hours: 78 },
          { name: 'Drama', percentage: 10, hours: 53 }
        ],
        watchByMonth: [
          { month: 'Ene', hours: 42 },
          { month: 'Feb', hours: 38 },
          { month: 'Mar', hours: 47 },
          { month: 'Abr', hours: 35 },
          { month: 'May', hours: 50 },
          { month: 'Jun', hours: 55 }
        ],
        watchByDevice: [
          { device: 'TV', percentage: 55, hours: 287 },
          { device: 'Móvil', percentage: 25, hours: 131 },
          { device: 'Tablet', percentage: 10, hours: 52 },
          { device: 'Ordenador', percentage: 10, hours: 53 }
        ],
        watchByTimeOfDay: [
          { time: 'Mañana', percentage: 10, hours: 52 },
          { time: 'Tarde', percentage: 30, hours: 157 },
          { time: 'Noche', percentage: 60, hours: 314 }
        ],
        totalMovies: 87,
        totalSeries: 24,
        completedSeries: 14,
        totalEpisodes: 345,
        watchlist: [
          { id: 1, title: 'The Gentlemen', posterPath: 'https://image.tmdb.org/t/p/w500/jtrhTYB7xSrJxR1vusu99nvnZ1g.jpg' },
          { id: 3, title: 'The Boys', posterPath: 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg' },
          { id: 7, title: 'Blade Runner 2049', posterPath: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' },
          { id: 9, title: 'Tenet', posterPath: 'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg' }
        ],
        favorites: [
          { id: 4, title: 'The Dark Knight', posterPath: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
          { id: 5, title: 'Dune', posterPath: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg' },
          { id: 6, title: 'Better Call Saul', posterPath: 'https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR31b6ys.jpg' }
        ],
        customLists: [
          {
            id: 'list1',
            name: 'Maratón de fin de semana',
            items: [
              { id: 2, title: 'The Mandalorian', posterPath: 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg' },
              { id: 8, title: 'Peaky Blinders', posterPath: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg' }
            ]
          },
          {
            id: 'list2',
            name: 'Películas de culto',
            items: [
              { id: 10, title: 'Fight Club', posterPath: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
              { id: 11, title: 'Pulp Fiction', posterPath: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' }
            ]
          },
          {
            id: 'list3',
            name: 'Ciencia Ficción',
            items: [
              { id: 7, title: 'Blade Runner 2049', posterPath: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' },
              { id: 12, title: 'Arrival', posterPath: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg' }
            ]
          }
        ],
        activities: [
          {
            id: 1,
            type: 'watch',
            date: new Date(Date.now() - 60000 * 30), // 30 minutos atrás
            contentId: 4,
            contentType: 'movie',
            contentTitle: 'The Dark Knight',
            contentPoster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
          },
          {
            id: 2,
            type: 'rate',
            date: new Date(Date.now() - 60000 * 60 * 3), // 3 horas atrás
            contentId: 6,
            contentType: 'series',
            contentTitle: 'Better Call Saul',
            contentPoster: 'https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR31b6ys.jpg',
            rating: 9
          },
          {
            id: 3,
            type: 'review',
            date: new Date(Date.now() - 60000 * 60 * 24 * 2), // 2 días atrás
            contentId: 5,
            contentType: 'movie',
            contentTitle: 'Dune',
            contentPoster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
            review: 'Una adaptación espectacular que hace justicia al libro. La cinematografía y la banda sonora son impresionantes. Denis Villeneuve ha conseguido capturar la esencia de la obra de Frank Herbert.'
          },
          {
            id: 4,
            type: 'favorite',
            date: new Date(Date.now() - 60000 * 60 * 24 * 4), // 4 días atrás
            contentId: 7,
            contentType: 'movie',
            contentTitle: 'Blade Runner 2049',
            contentPoster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg'
          },
          {
            id: 5,
            type: 'list',
            date: new Date(Date.now() - 60000 * 60 * 24 * 6), // 6 días atrás
            contentId: 8,
            contentType: 'series',
            contentTitle: 'Peaky Blinders',
            contentPoster: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg'
          }
        ]
      });
      setIsLoading(false);
    }, 600); // Reducido el tiempo de carga para mejor experiencia
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="profile-page">
        <ProfileHeader userData={userData} />
        
        <div className="profile-navigation">
          <button 
            className={`profile-nav-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <i className="fas fa-user"></i>
            <span>Resumen</span>
          </button>
          <button 
            className={`profile-nav-button ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <i className="fas fa-history"></i>
            <span>Actividad</span>
          </button>
          <button 
            className={`profile-nav-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i>
            <span>Ajustes</span>
          </button>
        </div>
        
        <div className="profile-content">
          {activeTab === 'summary' && <AccountSummary userData={userData} />}
          {activeTab === 'activity' && <ActivityFeed userData={userData} />}
          {activeTab === 'settings' && <ProfileSettings userData={userData} />}
        </div>
      </div>
    </MainLayout>
  );
}

export default ProfilePage;