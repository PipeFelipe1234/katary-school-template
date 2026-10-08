import { useState, useEffect } from "react";
import FormularioLibro from "./FormularioLibro";
import Modal from "./Modal";
import Paginacion from "./Paginacion";
import { usePaginacion } from "./usePaginacion";
import { contiene } from "./utils";
import { apiService } from "./services/apiService";

const FILTROS_INICIALES = { titulo: "", autor: "", genero: "" };

function Libro({ librosApp = [], setLibrosApp }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [libros, setLibros] = useState(librosApp);
  const [libroEnEdicion, setLibroEnEdicion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const librosFiltrados = libros.filter(
    (l) =>
      contiene(l.titulo, filtros.titulo) &&
      contiene(l.autor, filtros.autor) &&
      contiene(l.genero, filtros.genero)
  );
  const paginacion = usePaginacion(librosFiltrados);
  const hayFiltros = Object.values(filtros).some((v) => v.trim() !== "");

  const cambiarFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
    paginacion.reiniciar();
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    paginacion.reiniciar();
  };

  const actualizarLibros = (datos) => {
    setLibros(datos);
    if (setLibrosApp) setLibrosApp(datos);
  };

  const cargarLibros = async () => {
    setCargando(true);
    setError(null);
    try {
      actualizarLibros(await apiService.getLibros());
    } catch (err) {
      setError("Error al cargar libros: " + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const agregarLibro = async (libro) => {
    try {
      if (libroEnEdicion !== null) {
        await apiService.updateLibro(libroEnEdicion.id, libro);
      } else {
        await apiService.createLibro(libro);
      }
      actualizarLibros(await apiService.getLibros());
      setModalAbierto(false);
      setError(null);
    } catch (error) {
      setError("Error al procesar libro: " + error.message);
      console.error("Error al procesar libro:", error);
    }
  };

  const abrirModalNuevo = () => {
    setLibroEnEdicion(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (libro) => {
    setLibroEnEdicion(libro);
    setModalAbierto(true);
  };

  const eliminarLibro = async (libro) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
      try {
        await apiService.deleteLibro(libro.id);
        actualizarLibros(await apiService.getLibros());
        setError(null);
      } catch (error) {
        setError("Error al eliminar libro: " + error.message);
        console.error("Error al eliminar libro:", error);
      }
    }
  };

  if (cargando) {
    return <div className="libro-container"><p>Cargando libros...</p></div>;
  }

  return (
    <div className="libro-container">
      {error && <div className="error-message">{error}</div>}

      <div className="libro-header">
        <h2>Nuestros Libros</h2>
        <button onClick={abrirModalNuevo} className="btn-agregar">
          + Agregar Libro
        </button>
      </div>

      <div className="filtros-barra">
        <div className="filtro-campo">
          <label htmlFor="filtro-libro-titulo">📖 Título</label>
          <input
            id="filtro-libro-titulo"
            type="text"
            placeholder="Buscar por título..."
            value={filtros.titulo}
            onChange={(e) => cambiarFiltro("titulo", e.target.value)}
          />
        </div>
        <div className="filtro-campo">
          <label htmlFor="filtro-libro-autor">✍️ Autor</label>
          <input
            id="filtro-libro-autor"
            type="text"
            placeholder="Buscar por autor..."
            value={filtros.autor}
            onChange={(e) => cambiarFiltro("autor", e.target.value)}
          />
        </div>
        <div className="filtro-campo">
          <label htmlFor="filtro-libro-genero">🏷️ Género</label>
          <input
            id="filtro-libro-genero"
            type="text"
            placeholder="Buscar por género..."
            value={filtros.genero}
            onChange={(e) => cambiarFiltro("genero", e.target.value)}
          />
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

      <table className="tabla-libros">
        <thead>
          <tr>
            <th>📖 Título</th>
            <th>✍️ Autor</th>
            <th>🏷️ Género</th>
            <th>📦 Cantidad</th>
            <th>⚙️ Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginacion.visibles.length > 0 ? (
            paginacion.visibles.map((libro) => (
              <tr key={libro.id}>
                <td>{libro.titulo}</td>
                <td>{libro.autor}</td>
                <td>{libro.genero}</td>
                <td>{libro.cantidad}</td>
                <td className="acciones-celda">
                  <button
                    onClick={() => abrirModalEditar(libro)}
                    className="btn-editar"
                    title="Editar libro"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarLibro(libro)}
                    className="btn-eliminar"
                    title="Eliminar libro"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="tabla-vacia">
                {hayFiltros
                  ? "🔍 No se encontraron libros con los filtros aplicados."
                  : "📚 No hay libros registrados aún. ¡Agrega uno para comenzar!"}
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
        etiqueta="libros"
      />

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)}>
        <FormularioLibro
          onAgregarLibro={agregarLibro}
          libroEditar={libroEnEdicion}
          esEdicion={libroEnEdicion !== null}
        />
      </Modal>
    </div>
  );
}

export default Libro;
