import { useState, useEffect } from "react";
import PrestamoFormulario from "./PrestamoFormulario";
import { apiService } from "./services/apiService";

function Prestamo({ libros = [], setLibrosApp, usuarios = [], prestamosApp = [], setPrestamosApp }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [prestamoEnEdicion, setPrestamoEnEdicion] = useState(null);
  const [prestamos, setPrestamos] = useState(prestamosApp);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await apiService.getPrestamos();
      setPrestamos(datos);
      if (setPrestamosApp) setPrestamosApp(datos);
    } catch (err) {
      setError("Error al cargar préstamos: " + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const refrescar = async () => {
    const [datosPrestamos, datosLibros] = await Promise.all([apiService.getPrestamos(), apiService.getLibros()]);
    setPrestamos(datosPrestamos);
    if (setPrestamosApp) setPrestamosApp(datosPrestamos);
    if (setLibrosApp) setLibrosApp(datosLibros);
  };

  const agregarPrestamo = async ({ usuarioId, libroIds }) => {
    try {
      if (prestamoEnEdicion !== null) {
        const actual = prestamos[prestamoEnEdicion];
        await apiService.updatePrestamo(actual.id, {
          usuarioId,
          libroId: libroIds[0],
          fechaPrestamo: actual.fechaPrestamo,
          fechaVencimiento: actual.fechaVencimiento
        });
        setPrestamoEnEdicion(null);
      } else {
        for (const libroId of libroIds) {
          await apiService.createPrestamo({ usuarioId, libroId });
        }
      }
      await refrescar();
      setModalAbierto(false);
      setError(null);
    } catch (error) {
      await refrescar().catch(() => {});
      setError("Error al procesar préstamo: " + error.message);
      console.error("Error al procesar préstamo:", error);
    }
  };

  const abrirModalNuevo = () => {
    setPrestamoEnEdicion(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (index) => {
    setPrestamoEnEdicion(index);
    setModalAbierto(true);
  };

  const eliminarPrestamo = async (index) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
      try {
        await apiService.deletePrestamo(prestamos[index].id);
        await refrescar();
        setError(null);
      } catch (error) {
        setError("Error al eliminar préstamo: " + error.message);
        console.error("Error al eliminar préstamo:", error);
      }
    }
  };

  const getLibroInfo = (libroId) => {
    const libro = libros.find(l => l.id === libroId);
    if (libro) {
      return { titulo: libro.titulo, autor: libro.autor, genero: libro.genero };
    }
    return { titulo: "N/A", autor: "N/A", genero: "N/A" };
  };

  const getNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    return usuario ? usuario.nombres : "N/A";
  };

  if (cargando) {
    return <div className="prestamo-container"><p>Cargando préstamos...</p></div>;
  }

  return (
    <div className="prestamo-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="prestamo-header">
        <h2>📤 Gestión de Préstamos</h2>
        <button 
          onClick={abrirModalNuevo} 
          className="btn-agregar"
        >
          + Prestar Libro
        </button>
      </div>
      
      <table className="tabla-prestamos">
        <thead>
          <tr>
            <th>🆔 ID</th>
            <th>📖 Libro</th>
            <th>👤 Usuario</th>
            <th>📅 Fecha Préstamo</th>
            <th>📅 Vencimiento</th>
            <th>⚠️ Estado</th>
            <th>⚙️ Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.length > 0 ? (
            prestamos.map((prestamo, index) => {
              const libroInfo = getLibroInfo(prestamo.libroId);
              const nombreUsuario = getNombreUsuario(prestamo.usuarioId);
              const entregado = prestamo.estado === "Entregado";
              
              return (
                <tr key={prestamo.id || index} className={entregado ? "fila-entregada" : "fila-activa"}>
                  <td>{prestamo.id}</td>
                  <td>{libroInfo.titulo}</td>
                  <td>{nombreUsuario}</td>
                  <td>{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                  <td>{new Date(prestamo.fechaVencimiento).toLocaleDateString()}</td>
                  <td>{prestamo.estado}</td>
                  <td className="acciones-celda">
                    <button 
                      onClick={() => abrirModalEditar(index)}
                      className="btn-editar"
                      title="Editar préstamo"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => eliminarPrestamo(index)}
                      className="btn-eliminar"
                      title="Eliminar préstamo"
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
                📤 No hay préstamos registrados aún. ¡Agrega uno para comenzar!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="prestamo-leyenda">
        <div className="leyenda-item">
          <div className="leyenda-color activo"></div>
          <span>Activo - Préstamo sin entregar</span>
        </div>
        <div className="leyenda-item">
          <div className="leyenda-color entregado"></div>
          <span>Entregado - Libro(s) ya devuelto(s)</span>
        </div>
      </div>

      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setModalAbierto(false)} 
              className="btn-cerrar"
            >
              ✕
            </button>
            
            <PrestamoFormulario 
              onAgregarPrestamo={agregarPrestamo}
              prestamoEditar={prestamoEnEdicion !== null ? prestamos[prestamoEnEdicion] : null}
              esEdicion={prestamoEnEdicion !== null}
              libros={libros}
              usuarios={usuarios}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Prestamo;
