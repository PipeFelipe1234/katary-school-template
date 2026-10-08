import { useState, useEffect } from "react";
import TomaInventarioFormulario from "./TomaInventarioFormulario";
import Modal from "./Modal";
import Paginacion from "./Paginacion";
import { usePaginacion } from "./usePaginacion";
import { contiene } from "./utils";
import { apiService } from "./services/apiService";

function TomaInventario({ libros = [], setLibrosApp, tomaInventarioApp = [], setTomaInventarioApp }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tomaEnEdicion, setTomaEnEdicion] = useState(null);
  const [tomas, setTomas] = useState(tomaInventarioApp);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const getTituloLibro = (libroId) => {
    const libro = libros.find((l) => l.id === libroId);
    return libro ? libro.titulo : "";
  };

  const tomasFiltradas = tomas.filter((t) => contiene(getTituloLibro(t.libroId), busqueda));
  const paginacion = usePaginacion(tomasFiltradas);
  const hayBusqueda = busqueda.trim() !== "";

  const cambiarBusqueda = (valor) => {
    setBusqueda(valor);
    paginacion.reiniciar();
  };

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

  useEffect(() => {
    cargarTomas();
  }, []);

  const refrescar = async () => {
    const [datosTomas, datosLibros] = await Promise.all([apiService.getTomaInventarios(), apiService.getLibros()]);
    setTomas(datosTomas);
    if (setTomaInventarioApp) setTomaInventarioApp(datosTomas);
    if (setLibrosApp) setLibrosApp(datosLibros);
  };

  const agregarToma = async (toma) => {
    try {
      if (tomaEnEdicion !== null) {
        await apiService.updateTomaInventario(tomaEnEdicion.id, { ...toma, libroId: tomaEnEdicion.libroId });
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

  const abrirModalEditar = (toma) => {
    setTomaEnEdicion(toma);
    setModalAbierto(true);
  };

  const eliminarToma = async (toma) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro de toma de inventario?")) {
      try {
        await apiService.deleteTomaInventario(toma.id);
        await refrescar();
        setError(null);
      } catch (error) {
        setError("Error al eliminar toma de inventario: " + error.message);
        console.error("Error al eliminar toma de inventario:", error);
      }
    }
  };

  const getLibroInfo = (libroId) => {
    const libro = libros.find((l) => l.id === libroId);
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
        <button onClick={abrirModalNuevo} className="btn-agregar">
          + Agregar Toma
        </button>
      </div>

      <div className="filtros-barra">
        <div className="filtro-campo">
          <label htmlFor="filtro-toma-libro">📖 Nombre del libro</label>
          <input
            id="filtro-toma-libro"
            type="text"
            placeholder="Escribe para filtrar por nombre de libro..."
            value={busqueda}
            onChange={(e) => cambiarBusqueda(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn-limpiar-filtros"
          onClick={() => cambiarBusqueda("")}
          disabled={!hayBusqueda}
        >
          ✕ Limpiar
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
          {paginacion.visibles.length > 0 ? (
            paginacion.visibles.map((toma) => (
              <tr key={toma.id}>
                <td>{toma.id}</td>
                <td>{getLibroInfo(toma.libroId)}</td>
                <td>{new Date(toma.fecha).toLocaleDateString()}</td>
                <td className="cantidad-fisica">{toma.cantidadFisica}</td>
                <td className="cantidad-sistema">{toma.cantidadSistema}</td>
                <td className={toma.diferencia === 0 ? "diferencia-ok" : "diferencia-error"}>
                  {toma.diferencia}
                </td>
                <td>{toma.notas || "-"}</td>
                <td className="acciones-celda">
                  <button
                    onClick={() => abrirModalEditar(toma)}
                    className="btn-editar"
                    title="Editar toma"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarToma(toma)}
                    className="btn-eliminar"
                    title="Eliminar toma"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="tabla-vacia">
                {hayBusqueda
                  ? "🔍 No se encontraron tomas de inventario para ese libro."
                  : "📋 No hay tomas de inventario registradas aún. ¡Agrega una para comenzar!"}
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
        etiqueta="tomas de inventario"
      />

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)}>
        <TomaInventarioFormulario
          onAgregarToma={agregarToma}
          tomaEditar={tomaEnEdicion}
          esEdicion={tomaEnEdicion !== null}
          libros={libros}
        />
      </Modal>
    </div>
  );
}

export default TomaInventario;
