import { useState, useEffect } from "react";
import EntregaFormulario from "./EntregaFormulario";
import Modal from "./Modal";
import Paginacion from "./Paginacion";
import { usePaginacion } from "./usePaginacion";
import { contiene } from "./utils";
import { apiService } from "./services/apiService";

const FILTROS_INICIALES = { identificacion: "", nombres: "", libro: "", estado: "" };

function Entrega({ libros = [], setLibrosApp, usuarios = [], prestamosApp = [], setPrestamosApp, entregasApp = [], setEntregasApp }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [entregaEnEdicion, setEntregaEnEdicion] = useState(null);
  const [entregas, setEntregas] = useState(entregasApp);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const getPrestamoInfo = (prestamoId) => {
    const prestamo = prestamosApp.find((p) => p.id === prestamoId);
    if (prestamo) {
      const libro = libros.find((l) => l.id === prestamo.libroId);
      const usuario = usuarios.find((u) => u.id === prestamo.usuarioId);
      return {
        libroTitulo: libro ? libro.titulo : "N/A",
        usuario,
        fechaPrestamo: prestamo.fechaPrestamo
      };
    }
    return { libroTitulo: "N/A", usuario: undefined, fechaPrestamo: null };
  };

  const entregasFiltradas = entregas.filter((e) => {
    const info = getPrestamoInfo(e.prestamoId);
    return (
      contiene(info.usuario?.identificacion, filtros.identificacion) &&
      contiene(info.usuario?.nombres, filtros.nombres) &&
      contiene(info.libroTitulo, filtros.libro) &&
      (filtros.estado === "" || e.estado === filtros.estado)
    );
  });
  const paginacion = usePaginacion(entregasFiltradas);
  const hayFiltros = Object.values(filtros).some((v) => v.trim() !== "");

  const cambiarFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
    paginacion.reiniciar();
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    paginacion.reiniciar();
  };

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

  useEffect(() => {
    cargarEntregas();
  }, []);

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
        await apiService.updateEntrega(entregaEnEdicion.id, {
          prestamoId: entregaEnEdicion.prestamoId,
          estado: entrega.estado,
          fechaEntrega: entregaEnEdicion.fechaEntrega
        });
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

  const abrirModalEditar = (entrega) => {
    setEntregaEnEdicion(entrega);
    setModalAbierto(true);
  };

  const eliminarEntrega = async (entrega) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro de entrega?")) {
      try {
        await apiService.deleteEntrega(entrega.id);
        await refrescar();
        setError(null);
      } catch (error) {
        setError("Error al eliminar entrega: " + error.message);
        console.error("Error al eliminar entrega:", error);
      }
    }
  };

  if (cargando) {
    return <div className="entrega-container"><p>Cargando entregas...</p></div>;
  }

  return (
    <div className="entrega-container">
      {error && <div className="error-message">{error}</div>}

      <div className="entrega-header">
        <h2>📥 Gestión de Entregas</h2>
        <button onClick={abrirModalNuevo} className="btn-agregar">
          + Registrar Entrega
        </button>
      </div>

      <div className="filtros-barra">
        <div className="filtro-campo">
          <label htmlFor="filtro-entrega-identificacion">🆔 Identificación</label>
          <input
            id="filtro-entrega-identificacion"
            type="text"
            placeholder="Buscar por identificación..."
            value={filtros.identificacion}
            onChange={(e) => cambiarFiltro("identificacion", e.target.value)}
          />
        </div>
        <div className="filtro-campo">
          <label htmlFor="filtro-entrega-nombres">👤 Nombres</label>
          <input
            id="filtro-entrega-nombres"
            type="text"
            placeholder="Buscar por nombres..."
            value={filtros.nombres}
            onChange={(e) => cambiarFiltro("nombres", e.target.value)}
          />
        </div>
        <div className="filtro-campo">
          <label htmlFor="filtro-entrega-libro">📖 Libro</label>
          <input
            id="filtro-entrega-libro"
            type="text"
            placeholder="Buscar por libro..."
            value={filtros.libro}
            onChange={(e) => cambiarFiltro("libro", e.target.value)}
          />
        </div>
        <div className="filtro-campo">
          <label htmlFor="filtro-entrega-estado">⚠️ Estado</label>
          <select
            id="filtro-entrega-estado"
            value={filtros.estado}
            onChange={(e) => cambiarFiltro("estado", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Buen Estado">Buen Estado</option>
            <option value="Mal Estado">Mal Estado</option>
            <option value="Deteriorado">Deteriorado</option>
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
          {paginacion.visibles.length > 0 ? (
            paginacion.visibles.map((entrega) => {
              const prestamoInfo = getPrestamoInfo(entrega.prestamoId);

              return (
                <tr key={entrega.id}>
                  <td>{entrega.id}</td>
                  <td>{prestamoInfo.libroTitulo}</td>
                  <td>{prestamoInfo.usuario ? prestamoInfo.usuario.nombres : "N/A"}</td>
                  <td>{prestamoInfo.fechaPrestamo ? new Date(prestamoInfo.fechaPrestamo).toLocaleDateString() : "N/A"}</td>
                  <td>{new Date(entrega.fechaEntrega).toLocaleDateString()}</td>
                  <td>{entrega.estado}</td>
                  <td className="acciones-celda">
                    <button
                      onClick={() => abrirModalEditar(entrega)}
                      className="btn-editar"
                      title="Editar entrega"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarEntrega(entrega)}
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
                {hayFiltros
                  ? "🔍 No se encontraron entregas con los filtros aplicados."
                  : "📥 No hay entregas registradas aún. ¡Registra una entrega para comenzar!"}
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
        etiqueta="entregas"
      />

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)}>
        <EntregaFormulario
          onAgregarEntrega={agregarEntrega}
          entregaEditar={entregaEnEdicion}
          esEdicion={entregaEnEdicion !== null}
          libros={libros}
          usuarios={usuarios}
          prestamosApp={prestamosApp}
        />
      </Modal>
    </div>
  );
}

export default Entrega;
