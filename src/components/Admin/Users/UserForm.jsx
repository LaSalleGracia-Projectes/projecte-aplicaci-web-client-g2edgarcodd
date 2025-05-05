import React, { useState, useEffect } from "react";

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: user?.id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || "",
    date_of_birth: user?.date_of_birth || "",
    role: user?.is_admin === 1 ? "admin" : "user",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        date_of_birth: user.date_of_birth || "",
        role: user.is_admin === 1 ? "admin" : "user",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("No hay token de autenticación disponible");
      }
      
      // Crear el objeto de datos según la estructura requerida por la API
      const updateData = {
        user_id: formData.id,
        name: formData.firstName,
        surname: formData.lastName,
        username: formData.username,
        date_of_birth: formData.date_of_birth,
        // Añadir contraseña vacía ya que es obligatoria en la API, pero no la modificamos
        password: "",
        password_confirmation: ""
      };
      
      const response = await fetch(
        "http://25.17.74.119:8000/api/updateUser",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updateData)
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        let errorMessage = "Error al actualizar usuario";
        
        // Si la API devuelve errores específicos, mostrarlos
        if (data.errors) {
          errorMessage = Object.values(data.errors).flat().join(", ");
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        throw new Error(errorMessage);
      }
      
      if (data.success) {
        // Crear el objeto actualizado para devolverlo al componente padre
        const updatedUser = {
          ...user,
          id: formData.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          username: formData.username,
          date_of_birth: formData.date_of_birth,
          role: formData.role,
          is_admin: user.is_admin // Mantener el mismo rol
        };
        
        if (onSave) {
          onSave(updatedUser);
        }
      } else {
        throw new Error("Error al actualizar usuario");
      }
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-users-form-edit">
      {error && (
        <div className="admin-form-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label htmlFor="firstName">Nombre</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="admin-form-input"
            required
          />
        </div>
        
        <div className="admin-form-group">
          <label htmlFor="lastName">Apellidos</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="admin-form-input"
            required
          />
        </div>
      </div>
      
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="admin-form-input"
            required
          />
        </div>
        
        <div className="admin-form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="admin-form-input"
            disabled
          />
          <small className="admin-form-help-text">
            El email no se puede modificar
          </small>
        </div>
      </div>
      
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label htmlFor="date_of_birth">Fecha de nacimiento</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="admin-form-input"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        
        <div className="admin-form-group">
          <label htmlFor="role">Rol</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="admin-form-select"
            disabled
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          <small className="admin-form-help-text">
            El rol no se puede modificar
          </small>
        </div>
      </div>
      
      <div className="admin-form-info-message">
        <i className="fas fa-info-circle"></i>
        <span>Los administradores no pueden cambiar las contraseñas de los usuarios. Cada usuario debe cambiar su propia contraseña.</span>
      </div>
      
      <div className="admin-form-actions">
        <button
          type="button"
          className="admin-form-button cancel"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="admin-form-button save"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Guardando...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i> Guardar Cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
