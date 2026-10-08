import { useState, useEffect } from "react";
import EntregaFormulario from "./EntregaFormulario";
import { apiService } from "./services/apiService";

function Entrega({ libros = [], setLibrosApp, usuarios = [], prestamosApp = [], setPrestamosApp, entregasApp = [], setEntregasApp }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [entregaEnEdicion, setEntregaEnEdicion] = useState(null);
  const [entregas, setEntregas] = useState(entregasApp);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar entregas al montar
  useEffect(() => {
    cargarEntregas();
  }, []);

  const cargarEntregas = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await apiService.getEntregas();
      setEntregas(datos);
      if (setEntregasApp) setEntregasApp(datos);
    } catch (err) {
      setError("Error al cargar entregas: " + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const refrescar = async () => {
    const [datosEntregas, datosPrestamos, datosLibros] = await Promise.all([
      apiService.getEntregas(),
      apiService.getPrestamos(),
      apiService.getLibros()
    ]);
    setEntregas(datosEntregas);
    if (setEntregasApp) setEntregasApp(datosEntregas);
    if (setPrestamosApp) setPrestamosApp(datosPrestamos);
    if (setLibrosApp) setLibrosApp(datosLibros);
  };

  const agregarEntrega = async (entrega) => {
    try {
      if (entregaEnEdicion !== null) {
        const actual = entregas[entregaEnEdicion];
        await apiService.updateEntrega(actual.id, {
          prestamoId: actual.prestamoId,
          estado: entrega.estado,
          fechaEntrega: actual.fechaEntrega
        });
        setEntregaEnEdicion(null);
      } else {
        for (const prestamoId of entrega.prestamoIds) {
          await apiService.createEntrega({ prestamoId, estado: entrega.estado });
        }
      }
      await refrescar();
      setModalAbierto(false);
      setError(null);
    } catch (error) {
      await refrescar().catch(() => {});
      setError("Error al procesar entrega: " + error.message);
      console.error("Error al procesar entrega:", error);
    }
  };

  const abrirModalNuevo = () => {
    setEntregaEnEdicion(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (index) => {
    setEntregaEnEdicion(index);
    setModalAbierto(true);
  };

  const eliminarEntrega = async (index) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro de entrega?")) {
      try {
        await apiService.deleteEntrega(entregas[index].id);
        await refrescar();
        setError(null);
      } catch (error) {
        setError("Error al eliminar entrega: " + error.message);
        console.error("Error al eliminar entrega:", error);
      }
    }
  };

  const getNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    return usuario ? usuario.nombres : "N/A";
  };

  const getPrestamoInfo = (prestamoId) => {
    const prestamo = prestamosApp.find(p => p.id === prestamoId);
    if (prestamo) {
      const libro = libros.find(l => l.id === prestamo.libroId);
      return {
        libroTitulo: libro ? libro.titulo : "N/A",
        usuarioId: prestamo.usuarioId,
        fechaPrestamo: prestamo.fechaPrestamo
      };
    }
    return { libroTitulo: "N/A", usuarioId: null, fechaPrestamo: null };
  };

  if (cargando) {
    return <div className="entrega-container"><p>Cargando entregas...</p></div>;
  }

  return (
    <div className="entrega-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="entrega-header">
        <h2>📥 Gestión de Entregas</h2>
        <button 
          onClick={abrirModalNuevo} 
          className="btn-agregar"
        >
          + Registrar Entrega
        </button>
      </div>
      
      <table className="tabla-entregas">
        <thead>
          <tr>
            <th>🆔 ID Entrega</th>
            <th>📖 Libro</th>
            <th>👤 Usuario</th>
            <th>📅 Fecha Préstamo</th>
            <th>📅 Fecha Entrega</th>
            <th>⚠️ Estado</th>
            <th>⚙️ Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entregas.length > 0 ? (
            entregas.map((entrega, index) => {
              const prestamoInfo = getPrestamoInfo(entrega.prestamoId);
              const nombreUsuario = prestamoInfo.usuarioId ? getNombreUsuario(prestamoInfo.usuarioId) : "N/A";
              
              return (
                <tr key={entrega.id || index}>
                  <td>{entrega.id}</td>
                  <td>{prestamoInfo.libroTitulo}</td>
                  <td>{nombreUsuario}</td>
                  <td>{prestamoInfo.fechaPrestamo ? new Date(prestamoInfo.fechaPrestamo).toLocaleDateString() : "N/A"}</td>
                  <td>{new Date(entrega.fechaEntrega).toLocaleDateString()}</td>
                  <td>{entrega.estado}</td>
                  <td className="acciones-celda">
                    <button 
                      onClick={() => abrirModalEditar(index)}
                      className="btn-editar"
                      title="Editar entrega"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => eliminarEntrega(index)}
                      className="btn-eliminar"
                      title="Eliminar entrega"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="tabla-vacia">
                📥 No hay entregas registradas aún. ¡Registra una entrega para comenzar!
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
            
            <EntregaFormulario 
              onAgregarEntrega={agregarEntrega}
              entregaEditar={entregaEnEdicion !== null ? entregas[entregaEnEdicion] : null}
              esEdicion={entregaEnEdicion !== null}
              libros={libros}
              usuarios={usuarios}
              prestamosApp={prestamosApp}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Entrega;
