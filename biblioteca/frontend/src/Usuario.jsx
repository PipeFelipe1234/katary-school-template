import { useState, useEffect } from "react";
import UsuarioFormulario from "./UsuarioFormulario";
import { apiService } from "./services/apiService";

function Usuario({ usuariosApp = [], setUsuariosApp }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarios, setUsuarios] = useState(usuariosApp);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await apiService.getUsuarios();
      setUsuarios(datos);
      if (setUsuariosApp) setUsuariosApp(datos);
    } catch (err) {
      setError("Error al cargar usuarios: " + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const actualizarUsuarios = (nuevosUsuarios) => {
    setUsuarios(nuevosUsuarios);
    if (setUsuariosApp) setUsuariosApp(nuevosUsuarios);
  };

  const agregarUsuario = async (usuario) => {
    console.log("Procesando usuario:", usuario);
    try {
      if (usuarioEnEdicion !== null) {
        // Actualizar usuario existente
        const usuarioId = usuarios[usuarioEnEdicion].id;
        await apiService.updateUsuario(usuarioId, usuario);
        const nuevosUsuarios = [...usuarios];
        nuevosUsuarios[usuarioEnEdicion] = { ...usuario, id: usuarioId };
        actualizarUsuarios(nuevosUsuarios);
        setUsuarioEnEdicion(null);
      } else {
        // Crear nuevo usuario
        const usuarioCreado = await apiService.createUsuario(usuario);
        actualizarUsuarios([...usuarios, usuarioCreado]);
      }
      setModalAbierto(false);
      setError(null);
    } catch (error) {
      setError("Error al procesar usuario: " + error.message);
      console.error("Error al procesar usuario:", error);
    }
  };

  const abrirModalNuevo = () => {
    setUsuarioEnEdicion(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (index) => {
    setUsuarioEnEdicion(index);
    setModalAbierto(true);
  };

  const eliminarUsuario = async (index) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const usuarioId = usuarios[index].id;
        await apiService.deleteUsuario(usuarioId);
        const nuevosUsuarios = usuarios.filter((_, i) => i !== index);
        actualizarUsuarios(nuevosUsuarios);
        setError(null);
      } catch (error) {
        setError("Error al eliminar usuario: " + error.message);
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  if (cargando) {
    return <div className="usuario-container"><p>Cargando usuarios...</p></div>;
  }

  return (
    <div className="usuario-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="usuario-header">
        <h2>👥 Nuestros Usuarios</h2>
        <button 
          onClick={abrirModalNuevo} 
          className="btn-agregar"
        >
          + Agregar Usuario
        </button>
      </div>
      
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>🆔 Identificación</th>
            <th>👤 Nombres</th>
            <th>📧 Email</th>
            <th>📱 Teléfono</th>
            <th>⚙️ Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario, index) => (
              <tr key={usuario.id || index}>
                <td>{usuario.identificacion}</td>
                <td>{usuario.nombres}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefono}</td>
                <td className="acciones-celda">
                  <button 
                    onClick={() => abrirModalEditar(index)}
                    className="btn-editar"
                    title="Editar usuario"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => eliminarUsuario(index)}
                    className="btn-eliminar"
                    title="Eliminar usuario"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="tabla-vacia">
                👥 No hay usuarios registrados aún. ¡Agrega uno para comenzar!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setModalAbierto(false)} 
              className="btn-cerrar"
            >
              ✕
            </button>
            
            <UsuarioFormulario 
              onAgregarUsuario={agregarUsuario}
              usuarioEditar={usuarioEnEdicion !== null ? usuarios[usuarioEnEdicion] : null}
              esEdicion={usuarioEnEdicion !== null}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuario;


