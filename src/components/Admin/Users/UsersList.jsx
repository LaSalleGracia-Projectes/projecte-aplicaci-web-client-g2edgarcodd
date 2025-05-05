import React, { useState, useEffect } from "react";
import UserForm from "./UserForm";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Nuevos estados para modales y usuario seleccionado
  const [viewUserModal, setViewUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Obtener el token de autenticación del almacenamiento local
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("No hay token de autenticación disponible");
      }

      // Codificar parámetros para la URL
      const params = new URLSearchParams({
        user_id: 4,
      }).toString();

      // Realizar la petición GET a la API
      const response = await fetch(
        `http://25.17.74.119:8000/api/getAllUsers?${params}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener usuarios");
      }

      if (data.success) {
        const formattedUsers = data.data.map((user) => ({
          id: user.id,
          name: `${user.name} ${user.surname}`,
          firstName: user.name,
          lastName: user.surname,
          email: user.email,
          role: user.is_admin === 1 ? "admin" : "user",
          status: user.email_verified_at ? "active" : "pending",
          avatar: user.image,
          username: user.username,
          date_of_birth: user.date_of_birth,
          created_at: new Date(user.created_at).toLocaleDateString("es-ES"),
          email_verified_at: user.email_verified_at,
          updated_at: user.updated_at,
          is_admin: user.is_admin,
        }));

        setUsers(formattedUsers);
      } else {
        throw new Error("Error al obtener usuarios");
      }
    } catch (err) {
      setError(
        "Error al cargar los usuarios. Por favor, inténtelo de nuevo."
      );
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando se busca
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando se cambia el filtro
  };

  // Función para ver detalles del usuario
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewUserModal(true);
  };

  // Función para editar usuario
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserModal(true);
  };

  // Función para confirmar eliminación de usuario
  const handleDeleteConfirm = (user) => {
    setSelectedUser(user);
    setDeleteConfirmModal(true);
  };

  // Función para eliminar usuario
  const handleDeleteUser = async () => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("No hay token de autenticación disponible");
      }

      const response = await fetch(
        "http://25.17.74.119:8000/api/deleteUser",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            admin_id: 4, // ID del usuario administrador
            user_id: selectedUser.id, // ID del usuario a eliminar
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar usuario");
      }

      if (data.success) {
        // Eliminar usuario de la lista local
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setSuccessMessage(
          `Usuario ${selectedUser.name} eliminado correctamente`
        );
        setDeleteConfirmModal(false);

        // Mostrar mensaje de éxito y ocultarlo después de 3 segundos
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        throw new Error("Error al eliminar usuario");
      }
    } catch (err) {
      setDeleteError(err.message);
      console.error("Error eliminando usuario:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cerrar todos los modales
  const closeAllModals = () => {
    setViewUserModal(false);
    setEditUserModal(false);
    setDeleteConfirmModal(false);
    setSelectedUser(null);
  };

  // Manejar la actualización de un usuario
  const handleUserUpdated = (updatedUser) => {
    // Actualizar el usuario en la lista
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    );
    setUsers(updatedUsers);
    setEditUserModal(false);
    setSuccessMessage(
      `Usuario ${updatedUser.name} actualizado correctamente`
    );

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.username &&
        user.username.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      filter === "all" ||
      (filter === "admin" && user.role === "admin") ||
      (filter === "user" && user.role === "user");

    return matchesSearch && matchesFilter;
  });

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  // Calcular usuarios para la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ir a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="admin-users-table-container dark-theme">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users-table-container dark-theme">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchUsers();
            }}
            className="admin-users-action-btn primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-table-container dark-theme">
      {successMessage && (
        <div className="admin-success-message">
          <i className="fas fa-check-circle"></i>
          {successMessage}
        </div>
      )}

      <div className="admin-users-header">
        <div className="admin-users-title">Panel de Usuarios</div>
      </div>

      <div className="admin-users-filters">
        <div className="admin-users-search">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={handleSearch}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>

        <div className="admin-users-filter-group">
          <label className="admin-users-filter-label">Filtrar:</label>
          <select
            className="admin-users-filter-select"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuarios</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Fecha registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id} className="user-row">
                  <td>
                    <div className="admin-users-table-user">
                      <div className={`admin-users-table-avatar ${user.role}`}>
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <div className="admin-users-table-user-info">
                        <div className="admin-users-table-name">
                          {user.name}
                        </div>
                        <div className="admin-users-table-email">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`admin-users-table-role ${user.role}`}>
                      {user.role === "admin" && "Administrador"}
                      {user.role === "user" && "Usuario"}
                    </div>
                  </td>
                  <td>{user.created_at}</td>
                  <td>
                    <div className="admin-users-table-actions">
                      <button
                        className="admin-users-table-action view"
                        title="Ver detalles"
                        onClick={() => handleViewUser(user)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="admin-users-table-action edit"
                        title="Editar"
                        onClick={() => handleEditUser(user)}
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button
                        className="admin-users-table-action delete"
                        title="Eliminar"
                        onClick={() => handleDeleteConfirm(user)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-state">
                  <div>
                    <i className="fas fa-users-slash"></i>
                    <p>No se encontraron usuarios</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación actualizada */}
      {filteredUsers.length > usersPerPage && (
        <div className="admin-users-pagination">
          <button 
            className="admin-users-page-button" 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {/* Generar botones de paginación */}
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => {
            const pageNumber = index + 1;
            
            // Mostrar siempre la primera y última página
            // También mostrar la página actual y las adyacentes
            if (
              pageNumber === 1 || 
              pageNumber === Math.ceil(filteredUsers.length / usersPerPage) ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  className={`admin-users-page-button ${pageNumber === currentPage ? "active" : ""}`}
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            }
            
            // Mostrar puntos suspensivos para páginas ocultas
            if (
              (pageNumber === currentPage - 2 && pageNumber > 1) || 
              (pageNumber === currentPage + 2 && pageNumber < Math.ceil(filteredUsers.length / usersPerPage))
            ) {
              return <span key={pageNumber} className="admin-users-page-ellipsis">...</span>;
            }
            
            return null;
          })}
          
          <button 
            className="admin-users-page-button" 
            onClick={goToNextPage}
            disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Modal para ver detalles del usuario */}
      {viewUserModal && selectedUser && (
        <div className="admin-modal">
          <div className="admin-modal-overlay" onClick={closeAllModals}></div>
          <div className="admin-modal-container">
            <div className="admin-modal-header">
              <h3>Detalles del Usuario</h3>
              <button className="admin-modal-close" onClick={closeAllModals}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-user-details">
                <div className="admin-user-details-avatar">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} />
                  ) : (
                    <div
                      className={`admin-avatar-placeholder ${selectedUser.role}`}
                    >
                      {getInitials(selectedUser.name)}
                    </div>
                  )}
                  <div
                    className={`admin-user-details-status ${selectedUser.status}`}
                  >
                    {selectedUser.status === "active" ? "Activo" : "Pendiente"}
                  </div>
                </div>

                <div className="admin-user-details-info">
                  <div className="admin-user-details-header">
                    <h4>{selectedUser.name}</h4>
                    <div
                      className={`admin-user-details-badge ${selectedUser.role}`}
                    >
                      {selectedUser.role === "admin"
                        ? "Administrador"
                        : "Usuario"}
                    </div>
                  </div>

                  <div className="admin-user-details-fields">
                    <div className="admin-user-details-field">
                      <div className="admin-user-details-label">
                        <i className="fas fa-user-tag"></i> Usuario:
                      </div>
                      <div className="admin-user-details-value">
                        {selectedUser.username || "No disponible"}
                      </div>
                    </div>

                    <div className="admin-user-details-field">
                      <div className="admin-user-details-label">
                        <i className="fas fa-envelope"></i> Email:
                      </div>
                      <div className="admin-user-details-value">
                        {selectedUser.email}
                      </div>
                    </div>

                    <div className="admin-user-details-field">
                      <div className="admin-user-details-label">
                        <i className="fas fa-calendar-day"></i> Fecha de
                        nacimiento:
                      </div>
                      <div className="admin-user-details-value">
                        {selectedUser.date_of_birth || "No disponible"}
                      </div>
                    </div>

                    <div className="admin-user-details-field">
                      <div className="admin-user-details-label">
                        <i className="fas fa-user-clock"></i> Fecha de registro:
                      </div>
                      <div className="admin-user-details-value">
                        {selectedUser.created_at}
                      </div>
                    </div>

                    <div className="admin-user-details-field">
                      <div className="admin-user-details-label">
                        <i className="fas fa-check-circle"></i> Email
                        verificado:
                      </div>
                      <div className="admin-user-details-value">
                        {selectedUser.email_verified_at ? (
                          <span className="verified-true">Sí</span>
                        ) : (
                          <span className="verified-false">No</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-modal-button secondary"
                onClick={closeAllModals}
              >
                Cerrar
              </button>
              <button
                className="admin-modal-button primary"
                onClick={() => {
                  closeAllModals();
                  handleEditUser(selectedUser);
                }}
              >
                <i className="fas fa-pencil-alt"></i> Editar Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar usuario */}
      {editUserModal && selectedUser && (
        <div className="admin-modal">
          <div className="admin-modal-overlay" onClick={closeAllModals}></div>
          <div className="admin-modal-container large">
            <div className="admin-modal-header">
              <h3>Editar Usuario</h3>
              <button className="admin-modal-close" onClick={closeAllModals}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <UserForm
                user={selectedUser}
                onSave={handleUserUpdated}
                onCancel={closeAllModals}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteConfirmModal && selectedUser && (
        <div className="admin-modal">
          <div className="admin-modal-overlay" onClick={closeAllModals}></div>
          <div className="admin-modal-container small">
            <div className="admin-modal-header">
              <h3>Confirmar Eliminación</h3>
              <button className="admin-modal-close" onClick={closeAllModals}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-confirm-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>
                  ¿Está seguro que desea eliminar el usuario{" "}
                  <strong>{selectedUser.name}</strong>?
                </p>
                <p className="admin-confirm-warning">
                  Esta acción no se puede deshacer.
                </p>

                {deleteError && (
                  <div className="admin-modal-error">
                    <i className="fas fa-times-circle"></i>
                    {deleteError}
                  </div>
                )}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-modal-button secondary"
                onClick={closeAllModals}
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              <button
                className="admin-modal-button danger"
                onClick={handleDeleteUser}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Eliminando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash"></i> Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
