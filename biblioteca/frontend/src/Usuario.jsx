import { useState, useEffect } from "react";
import UsuarioFormulario from "./UsuarioFormulario";
import Modal from "./Modal";
import Paginacion from "./Paginacion";
import { usePaginacion } from "./usePaginacion";
import { apiService } from "./services/apiService";

function Usuario({ usuariosApp = [], setUsuariosApp }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarios, setUsuarios] = useState(usuariosApp);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const paginacion = usePaginacion(usuarios);

  const actualizarUsuarios = (datos) => {
    setUsuarios(datos);
    if (setUsuariosApp) setUsuariosApp(datos);
  };

  const cargarUsuarios = async () => {
    setCargando(true);
    setError(null);
    try {
      actualizarUsuarios(await apiService.getUsuarios());
    } catch (err) {
      setError("Error al cargar usuarios: " + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const agregarUsuario = async (usuario) => {
    try {
      if (usuarioEnEdicion !== null) {
        await apiService.updateUsuario(usuarioEnEdicion.id, usuario);
      } else {
        await apiService.createUsuario(usuario);
      }
      actualizarUsuarios(await apiService.getUsuarios());
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

  const abrirModalEditar = (usuario) => {
    setUsuarioEnEdicion(usuario);
    setModalAbierto(true);
  };

  const eliminarUsuario = async (usuario) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await apiService.deleteUsuario(usuario.id);
        actualizarUsuarios(await apiService.getUsuarios());
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
        <button onClick={abrirModalNuevo} className="btn-agregar">
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
          {paginacion.visibles.length > 0 ? (
            paginacion.visibles.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.identificacion}</td>
                <td>{usuario.nombres}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefono}</td>
                <td className="acciones-celda">
                  <button
                    onClick={() => abrirModalEditar(usuario)}
                    className="btn-editar"
                    title="Editar usuario"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarUsuario(usuario)}
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

      <Paginacion
        paginaActual={paginacion.paginaActual}
        totalPaginas={paginacion.totalPaginas}
        total={paginacion.total}
        desde={paginacion.desde}
        hasta={paginacion.hasta}
        onCambiar={paginacion.irAPagina}
        etiqueta="usuarios"
      />

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)}>
        <UsuarioFormulario
          onAgregarUsuario={agregarUsuario}
          usuarioEditar={usuarioEnEdicion}
          esEdicion={usuarioEnEdicion !== null}
        />
      </Modal>
    </div>
  );
}

export default Usuario;
