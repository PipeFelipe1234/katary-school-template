import { useState, useEffect } from "react";
import FormularioLibro from "./FormularioLibro";
import { apiService } from "./services/apiService";

function Libro({ librosApp = [], setLibrosApp }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [libros, setLibros] = useState(librosApp);
  const [libroEnEdicion, setLibroEnEdicion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar libros al montar el componente
  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await apiService.getLibros();
      setLibros(datos);
      if (setLibrosApp) setLibrosApp(datos);
    } catch (err) {
      setError("Error al cargar libros: " + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const actualizarLibros = (nuevosLibros) => {
    setLibros(nuevosLibros);
    if (setLibrosApp) setLibrosApp(nuevosLibros);
  };

  const agregarLibro = async (libro) => {
    console.log("Agregando libro:", libro);
    try {
      if (libroEnEdicion !== null) {
        // Actualizar libro existente
        const libroId = libros[libroEnEdicion].id;
        await apiService.updateLibro(libroId, libro);
        const nuevosLibros = [...libros];
        nuevosLibros[libroEnEdicion] = { ...libro, id: libroId };
        actualizarLibros(nuevosLibros);
        setLibroEnEdicion(null);
      } else {
        // Crear nuevo libro
        const libroCreado = await apiService.createLibro(libro);
        actualizarLibros([...libros, libroCreado]);
      }
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

  const abrirModalEditar = (index) => {
    setLibroEnEdicion(index);
    setModalAbierto(true);
  };

  const eliminarLibro = async (index) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
      try {
        const libroId = libros[index].id;
        await apiService.deleteLibro(libroId);
        const nuevosLibros = libros.filter((_, i) => i !== index);
        actualizarLibros(nuevosLibros);
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
        <button 
          onClick={abrirModalNuevo} 
          className="btn-agregar"
        >
          + Agregar Libro
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
          {libros.length > 0 ? (
            libros.map((libro, index) => (
              <tr key={libro.id || index}>
                <td>{libro.titulo}</td>
                <td>{libro.autor}</td>
                <td>{libro.genero}</td>
                <td>{libro.cantidad}</td>
                <td className="acciones-celda">
                  <button 
                    onClick={() => abrirModalEditar(index)}
                    className="btn-editar"
                    title="Editar libro"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => eliminarLibro(index)}
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
                📚 No hay libros registrados aún. ¡Agrega uno para comenzar!
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
            
            <FormularioLibro 
              onAgregarLibro={agregarLibro}
              libroEditar={libroEnEdicion !== null ? libros[libroEnEdicion] : null}
              esEdicion={libroEnEdicion !== null}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Libro;


