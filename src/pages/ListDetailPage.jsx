import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../styles/components/listDetail.css';

function ListDetailPage() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [listData, setListData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulación de datos de lista (en producción, se obtendría de una API)
    const mockData = {
      id: listId,
      name: 'Maratón de fin de semana',
      description: 'Películas y series para ver en un fin de semana',
      createdAt: '2024-02-15',
      updatedAt: '2024-03-20',
      items: [
        { id: 1, title: 'The Dark Knight', posterPath: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', type: 'movie', year: '2008' },
        { id: 2, title: 'Breaking Bad', posterPath: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', type: 'series', year: '2008-2013' },
        { id: 3, title: 'Inception', posterPath: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', type: 'movie', year: '2010' },
      ],
    };

    setTimeout(() => {
      setListData(mockData);
      setIsLoading(false);
    }, 800);
  }, [listId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="list-detail-page">
          <div className="list-detail-loading">
            <div className="loading-spinner"></div>
            <p>Cargando lista...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!listData) {
    return (
      <MainLayout>
        <div className="list-detail-page">
          <div className="list-detail-error">
            <i className="fas fa-exclamation-circle error-icon"></i>
            <h2>Lista no encontrada</h2>
            <p>La lista que estás buscando no existe o ha sido eliminada.</p>
            <button className="btn-primary" onClick={() => navigate('/lists')}>
              <i className="fas fa-arrow-left"></i> Volver a mis listas
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <MainLayout>
      <div className="list-detail-page">
        <div className="list-detail-container">
          {/* Navegación de migas de pan */}
          <div className="list-detail-breadcrumb">
            <Link to="/lists" className="breadcrumb-link">
              <i className="fas fa-bookmark"></i> Mis Listas
            </Link>
            <i className="fas fa-chevron-right breadcrumb-separator"></i>
            <span className="breadcrumb-current">{listData.name}</span>
          </div>
          
          <div className="list-detail-header">
            <h1 className="list-detail-title">{listData.name}</h1>
            <p className="list-detail-description">{listData.description}</p>
            <div className="list-detail-meta">
              <div className="list-meta-item">
                <i className="fas fa-film"></i>
                <span>{listData.items.length} elementos</span>
              </div>
              <div className="list-meta-item">
                <i className="fas fa-calendar-alt"></i>
                <span>Actualizado el {formatDate(listData.updatedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="list-detail-actions">
            <button className="btn-secondary">
              <i className="fas fa-edit"></i> Editar lista
            </button>
            <button className="btn-danger">
              <i className="fas fa-trash-alt"></i> Eliminar
            </button>
          </div>
          
          <div className="list-items-grid">
            {listData.items.map((item) => (
              <Link 
                to={`/${item.type === 'movie' ? 'movie' : 'series'}/${item.id}`} 
                key={item.id} 
                className="list-item-card"
              >
                <div className="list-item-poster-wrapper">
                  <img
                    src={item.posterPath}
                    alt={item.title}
                    className="list-item-poster"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                  />
                  <div className="list-item-overlay">
                    <button className="list-item-play-btn">
                      <i className="fas fa-play"></i>
                    </button>
                  </div>
                  <span className={`list-item-type-badge ${item.type}`}>
                    {item.type === 'movie' ? 'Película' : 'Serie'}
                  </span>
                </div>
                <div className="list-item-info">
                  <h3 className="list-item-title">{item.title}</h3>
                  <p className="list-item-year">{item.year}</p>
                  <button className="list-item-remove-btn" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Implementar función para remover item
                  }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </Link>
            ))}
            
            {/* Botón para añadir nuevo contenido */}
            <div className="list-item-add-card">
              <div className="list-item-add-content">
                <i className="fas fa-plus-circle"></i>
                <p>Añadir contenido</p>
              </div>
            </div>
          </div>
          
          {listData.items.length === 0 && (
            <div className="list-empty-state">
              <i className="fas fa-film empty-icon"></i>
              <h3>Lista vacía</h3>
              <p>Esta lista no tiene películas ni series. ¡Añade contenido para comenzar!</p>
              <button className="btn-primary">
                <i className="fas fa-plus"></i> Añadir contenido
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default ListDetailPage;