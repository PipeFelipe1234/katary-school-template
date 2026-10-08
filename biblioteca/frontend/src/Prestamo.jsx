import { useState, useEffect } from "react";
import PrestamoFormulario from "./PrestamoFormulario";
import Modal from "./Modal";
import Paginacion from "./Paginacion";
import { usePaginacion } from "./usePaginacion";
import { contiene } from "./utils";
import { apiService } from "./services/apiService";

const FILTROS_INICIALES = { identificacion: "", nombres: "", estado: "" };

function Prestamo({ libros = [], setLibrosApp, usuarios = [], prestamosApp = [], setPrestamosApp }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [prestamoEnEdicion, setPrestamoEnEdicion] = useState(null);
  const [prestamos, setPrestamos] = useState(prestamosApp);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const getUsuario = (usuarioId) => usuarios.find((u) => u.id === usuarioId);

  const prestamosFiltrados = prestamos.filter((p) => {
    const usuario = getUsuario(p.usuarioId);
    return (
      contiene(usuario?.identificacion, filtros.identificacion) &&
      contiene(usuario?.nombres, filtros.nombres) &&
      (filtros.estado === "" || p.estado === filtros.estado)
    );
  });
  const paginacion = usePaginacion(prestamosFiltrados);
  const hayFiltros = Object.values(filtros).some((v) => v.trim() !== "");

  const cambiarFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
    paginacion.reiniciar();
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    paginacion.reiniciar();
  };

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

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const refrescar = async () => {
    const [datosPrestamos, datosLibros] = await Promise.all([apiService.getPrestamos(), apiService.getLibros()]);
    setPrestamos(datosPrestamos);
    if (setPrestamosApp) setPrestamosApp(datosPrestamos);
    if (setLibrosApp) setLibrosApp(datosLibros);
  };

  const agregarPrestamo = async ({ usuarioId, libroIds }) => {
    try {
      if (prestamoEnEdicion !== null) {
        await apiService.updatePrestamo(prestamoEnEdicion.id, {
          usuarioId,
          libroId: libroIds[0],
          fechaPrestamo: prestamoEnEdicion.fechaPrestamo,
          fechaVencimiento: prestamoEnEdicion.fechaVencimiento
        });
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

  const abrirModalEditar = (prestamo) => {
    setPrestamoEnEdicion(prestamo);
    setModalAbierto(true);
  };

  const eliminarPrestamo = async (prestamo) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
      try {
        await apiService.deletePrestamo(prestamo.id);
        await refrescar();
        setError(null);
      } catch (error) {
        setError("Error al eliminar préstamo: " + error.message);
        console.error("Error al eliminar préstamo:", error);
      }
    }
  };

  const getLibroInfo = (libroId) => {
    const libro = libros.find((l) => l.id === libroId);
    if (libro) {
      return { titulo: libro.titulo, autor: libro.autor, genero: libro.genero };
    }
    return { titulo: "N/A", autor: "N/A", genero: "N/A" };
  };

  const getNombreUsuario = (usuarioId) => {
    const usuario = getUsuario(usuarioId);
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
        <button onClick={abrirModalNuevo} className="btn-agregar">
          + Prestar Libro
        </button>
      </div>

      <div className="filtros-barra">
        <div className="filtro-campo">
          <label htmlFor="filtro-prestamo-identificacion">🆔 Identificación</label>
          <input
            id="filtro-prestamo-identificacion"
            type="text"
            placeholder="Buscar por identificación..."
            value={filtros.identificacion}
            onChange={(e) => cambiarFiltro("identificacion", e.target.value)}
          />
        </div>
        <div className="filtro-campo">
          <label htmlFor="filtro-prestamo-nombres">👤 Nombres</label>
          <input
            id="filtro-prestamo-nombres"
            type="text"
            placeholder="Buscar por nombres..."
            value={filtros.nombres}
            onChange={(e) => cambiarFiltro("nombres", e.target.value)}
          />
        </div>
        <div className="filtro-campo">
          <label htmlFor="filtro-prestamo-estado">⚠️ Estado</label>
          <select
            id="filtro-prestamo-estado"
            value={filtros.estado}
            onChange={(e) => cambiarFiltro("estado", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>
        <button
          type="button"
          className="btn-limpiar-filtros"
          onClick={limpiarFiltros}
          disabled={!hayFiltros}
        >
          ✕ Limpiar
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
          {paginacion.visibles.length > 0 ? (
            paginacion.visibles.map((prestamo) => {
              const libroInfo = getLibroInfo(prestamo.libroId);
              const nombreUsuario = getNombreUsuario(prestamo.usuarioId);
              const entregado = prestamo.estado === "Entregado";

              return (
                <tr key={prestamo.id} className={entregado ? "fila-entregada" : "fila-activa"}>
                  <td>{prestamo.id}</td>
                  <td>{libroInfo.titulo}</td>
                  <td>{nombreUsuario}</td>
                  <td>{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                  <td>{new Date(prestamo.fechaVencimiento).toLocaleDateString()}</td>
                  <td>{prestamo.estado}</td>
                  <td className="acciones-celda">
                    <button
                      onClick={() => abrirModalEditar(prestamo)}
                      className="btn-editar"
                      title="Editar préstamo"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarPrestamo(prestamo)}
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
                {hayFiltros
                  ? "🔍 No se encontraron préstamos con los filtros aplicados."
                  : "📤 No hay préstamos registrados aún. ¡Agrega uno para comenzar!"}
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
        etiqueta="préstamos"
      />

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

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)}>
        <PrestamoFormulario
          onAgregarPrestamo={agregarPrestamo}
          prestamoEditar={prestamoEnEdicion}
          esEdicion={prestamoEnEdicion !== null}
          libros={libros}
          usuarios={usuarios}
        />
      </Modal>
    </div>
  );
}

export default Prestamo;
