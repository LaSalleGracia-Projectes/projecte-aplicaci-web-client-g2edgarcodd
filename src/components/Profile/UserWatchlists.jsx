import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function UserWatchlists({ userData }) {
  const [newListName, setNewListName] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [editingListId, setEditingListId] = useState(null);
  const [activeList, setActiveList] = useState(userData.customLists[0]?.id || 'watchlist');
  
  // Manejar la creación de una nueva lista
  const handleCreateList = () => {
    if (newListName.trim() === '') return;
    
    // Aquí iría la lógica para guardar en base de datos
    console.log("Nueva lista creada:", newListName);
    
    // Limpiar el formulario y ocultarlo
    setNewListName('');
    setShowNewListForm(false);
  };
  
  // Calcular qué lista mostrar
  const currentList = activeList === 'watchlist' 
    ? { id: 'watchlist', name: 'Mi Lista', items: userData.watchlist }
    : userData.customLists.find(list => list.id === activeList);

  return (
    <div className="user-watchlists animate-fade-in">
      <div className="watchlists-header">
        <h2 className="section-title">Mis Listas</h2>
        
        <button 
          className="new-list-button" 
          onClick={() => setShowNewListForm(true)}
        >
          <i className="fas fa-plus"></i> Nueva Lista
        </button>
      </div>
      
      {/* Formulario para crear nueva lista */}
      {showNewListForm && (
        <div className="new-list-form">
          <input
            type="text"
            placeholder="Nombre de la lista"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="new-list-input"
          />
          <div className="form-actions">
            <button 
              onClick={handleCreateList}
              className="create-list-button"
            >
              Crear
            </button>
            <button 
              onClick={() => setShowNewListForm(false)}
              className="cancel-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      
      {/* Navegación entre listas */}
      <div className="lists-navigation">
        <button 
          className={`list-nav-button ${activeList === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveList('watchlist')}
        >
          <i className="fas fa-bookmark"></i> Mi Lista
          <span className="item-count">{userData.watchlist.length}</span>
        </button>
        
        {userData.customLists.map(list => (
          <button 
            key={list.id} 
            className={`list-nav-button ${activeList === list.id ? 'active' : ''}`}
            onClick={() => setActiveList(list.id)}
          >
            <i className="fas fa-list-ul"></i> {list.name}
            <span className="item-count">{list.items.length}</span>
            
            {/* Solo mostramos opciones de edición en listas personalizadas */}
            <div className="list-options">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingListId(list.id === editingListId ? null : list.id);
                }}
                className="list-options-button"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              
              {editingListId === list.id && (
                <div className="list-dropdown">
                  <button className="list-dropdown-item">
                    <i className="fas fa-pencil-alt"></i> Renombrar
                  </button>
                  <button className="list-dropdown-item delete">
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* Contenido de la lista actual */}
      <div className="list-content">
        <div className="list-header">
          <h3 className="list-title">{currentList.name}</h3>
          <span className="list-counter">{currentList.items.length} elementos</span>
        </div>
        
        {currentList.items.length === 0 ? (
          <div className="empty-list">
            <i className="fas fa-film"></i>
            <p>Esta lista está vacía</p>
            <Link to="/explore" className="btn-primary">Explorar contenido</Link>
          </div>
        ) : (
          <div className="list-grid">
            {currentList.items.map(item => (
              <div key={item.id} className="list-item">
                <div className="list-item-poster">
                  <img src={item.posterPath} alt={item.title} />
                  <div className="list-item-overlay">
                    <Link to={`/movie/${item.id}`} className="play-button">
                      <i className="fas fa-play"></i>
                    </Link>
                    <button className="remove-button">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <h4 className="list-item-title">{item.title}</h4>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserWatchlists;