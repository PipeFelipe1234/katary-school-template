import { useState, useEffect } from "react";
import TomaInventarioFormulario from "./TomaInventarioFormulario";
import { apiService } from "./services/apiService";

function TomaInventario({ libros = [], setLibrosApp, tomaInventarioApp = [], setTomaInventarioApp }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tomaEnEdicion, setTomaEnEdicion] = useState(null);
  const [tomas, setTomas] = useState(tomaInventarioApp);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar tomas al montar
  useEffect(() => {
    cargarTomas();
  }, []);

  const cargarTomas = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await apiService.getTomaInventarios();
      setTomas(datos);
      if (setTomaInventarioApp) setTomaInventarioApp(datos);
    } catch (err) {
      setError("Error al cargar tomas de inventario: " + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const refrescar = async () => {
    const [datosTomas, datosLibros] = await Promise.all([apiService.getTomaInventarios(), apiService.getLibros()]);
    setTomas(datosTomas);
    if (setTomaInventarioApp) setTomaInventarioApp(datosTomas);
    if (setLibrosApp) setLibrosApp(datosLibros);
  };

  const agregarToma = async (toma) => {
    try {
      if (tomaEnEdicion !== null) {
        const actual = tomas[tomaEnEdicion];
        await apiService.updateTomaInventario(actual.id, { ...toma, libroId: actual.libroId });
        setTomaEnEdicion(null);
      } else {
        await apiService.createTomaInventario(toma);
      }
      await refrescar();
      setModalAbierto(false);
      setError(null);
    } catch (error) {
      setError("Error al procesar toma de inventario: " + error.message);
      console.error("Error al procesar toma de inventario:", error);
    }
  };

  const abrirModalNuevo = () => {
    setTomaEnEdicion(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (index) => {
    setTomaEnEdicion(index);
    setModalAbierto(true);
  };

  const eliminarToma = async (index) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro de toma de inventario?")) {
      try {
        await apiService.deleteTomaInventario(tomas[index].id);
        await refrescar();
        setError(null);
      } catch (error) {
        setError("Error al eliminar toma de inventario: " + error.message);
        console.error("Error al eliminar toma de inventario:", error);
      }
    }
  };

  const getLibroInfo = (libroId) => {
    const libro = libros.find(l => l.id === libroId);
    if (libro) {
      return `${libro.titulo} - ${libro.autor} (${libro.genero})`;
    }
    return "N/A";
  };

  if (cargando) {
    return <div className="toma-inventario-container"><p>Cargando tomas de inventario...</p></div>;
  }

  return (
    <div className="toma-inventario-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="toma-inventario-header">
        <h2>📋 Toma de Inventario</h2>
        <button 
          onClick={abrirModalNuevo} 
          className="btn-agregar"
        >
          + Agregar Toma
        </button>
      </div>
      
      <table className="tabla-toma-inventario">
        <thead>
          <tr>
            <th>🆔 ID</th>
            <th>📖 Libro</th>
            <th>📅 Fecha</th>
            <th>📦 Cantidad Física</th>
            <th>📦 Cantidad Sistema</th>
            <th>📊 Diferencia</th>
            <th>📝 Notas</th>
            <th>⚙️ Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tomas.length > 0 ? (
            tomas.map((toma, index) => {
              const libroInfo = getLibroInfo(toma.libroId);
              
              return (
                <tr key={toma.id || index}>
                  <td>{toma.id}</td>
                  <td>{libroInfo}</td>
                  <td>{new Date(toma.fecha).toLocaleDateString()}</td>
                  <td className="cantidad-fisica">{toma.cantidadFisica}</td>
                  <td className="cantidad-sistema">{toma.cantidadSistema}</td>
                  <td className={toma.diferencia === 0 ? "diferencia-ok" : "diferencia-error"}>
                    {toma.diferencia}
                  </td>
                  <td>{toma.notas || "-"}</td>
                  <td className="acciones-celda">
                    <button 
                      onClick={() => abrirModalEditar(index)}
                      className="btn-editar"
                      title="Editar toma"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => eliminarToma(index)}
                      className="btn-eliminar"
                      title="Eliminar toma"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="tabla-vacia">
                📋 No hay tomas de inventario registradas aún. ¡Agrega una para comenzar!
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
            
            <TomaInventarioFormulario 
              onAgregarToma={agregarToma}
              tomaEditar={tomaEnEdicion !== null ? tomas[tomaEnEdicion] : null}
              esEdicion={tomaEnEdicion !== null}
              libros={libros}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TomaInventario;

