import { useState, useEffect } from "react";

const fechaHoy = () => new Date().toISOString().split("T")[0];

function EntregaFormulario({ onAgregarEntrega, entregaEditar, esEdicion, libros = [], usuarios = [], prestamosApp = [] }) {
    const [identificacionUsuario, setIdentificacionUsuario] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [seleccionados, setSeleccionados] = useState([]);
    const [estado, setEstado] = useState("Buen Estado");
    const [fechaEntrega, setFechaEntrega] = useState(fechaHoy());

    const getTituloLibro = (libroId) => {
        const libro = libros.find(l => l.id === libroId);
        return libro ? `${libro.titulo} - ${libro.autor}` : "N/A";
    };

    const pendientesDe = (usuarioId) =>
        prestamosApp.filter(p => p.usuarioId === usuarioId && p.estado !== "Entregado");

    useEffect(() => {
        if (esEdicion && entregaEditar) {
            const prestamo = prestamosApp.find(p => p.id === entregaEditar.prestamoId);
            const usuarioPrestamo = prestamo ? usuarios.find(u => u.id === prestamo.usuarioId) : null;
            setUsuario(usuarioPrestamo || null);
            setIdentificacionUsuario(usuarioPrestamo ? usuarioPrestamo.identificacion : "");
            setSeleccionados([entregaEditar.prestamoId]);
            setEstado(entregaEditar.estado);
            setFechaEntrega(entregaEditar.fechaEntrega.split("T")[0]);
        } else {
            setIdentificacionUsuario("");
            setUsuario(null);
            setSeleccionados([]);
            setEstado("Buen Estado");
            setFechaEntrega(fechaHoy());
        }
    }, [esEdicion, entregaEditar, prestamosApp, usuarios]);

    const prestamosMostrados = esEdicion
        ? prestamosApp.filter(p => seleccionados.includes(p.id))
        : usuario ? pendientesDe(usuario.id) : [];

    const handleIdentificacionChange = (e) => {
        const identificacion = e.target.value;
        setIdentificacionUsuario(identificacion);
        const encontrado = usuarios.find(u => u.identificacion === identificacion.trim()) || null;
        setUsuario(encontrado);
        setSeleccionados(encontrado ? pendientesDe(encontrado.id).map(p => p.id) : []);
    };

    const alternarSeleccion = (id) => {
        setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleAgregarClick = () => {
        if (!esEdicion) {
            if (!identificacionUsuario.trim()) {
                alert("Por favor ingresa la identificación del usuario");
                return;
            }
            if (!usuario) {
                alert("El usuario no existe. Verifica la identificación");
                return;
            }
            if (prestamosMostrados.length === 0) {
                alert("Este usuario no tiene préstamos pendientes de entrega");
                return;
            }
            if (seleccionados.length === 0) {
                alert("Selecciona al menos un libro que se entrega");
                return;
            }
        }

        onAgregarEntrega({
            prestamoIds: seleccionados,
            estado
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAgregarClick();
        }
    };

    return (
        <div className="formulario-container">
            <h2>{esEdicion ? "✏️ Editar Entrega" : "📥 Nueva Entrega"}</h2>

            <div className="formulario-group">
                <p>🆔 Identificación del Usuario:</p>
                <input
                    type="text"
                    placeholder="Ej: 123456789"
                    value={identificacionUsuario}
                    onChange={handleIdentificacionChange}
                    onKeyPress={handleKeyPress}
                    readOnly={esEdicion}
                    className={esEdicion ? "input-readonly" : ""}
                />
                <small className="campo-ayuda">
                    Ingresa la identificación y se precargarán sus libros prestados
                </small>
            </div>

            <div className="formulario-group">
                <p>👤 Nombre del Usuario (Precargado):</p>
                <input
                    type="text"
                    placeholder="Se precargará automáticamente"
                    value={usuario ? usuario.nombres : ""}
                    readOnly
                    className="input-readonly"
                />
            </div>

            <div className="formulario-group">
                <p>📖 Libros prestados (Precargado):</p>
                {prestamosMostrados.length > 0 ? (
                    prestamosMostrados.map(p => (
                        <label key={p.id} style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" }}>
                            <input
                                type="checkbox"
                                checked={seleccionados.includes(p.id)}
                                onChange={() => alternarSeleccion(p.id)}
                                disabled={esEdicion}
                            />
                            <span>
                                {getTituloLibro(p.libroId)} (prestado el {new Date(p.fechaPrestamo).toLocaleDateString()})
                            </span>
                        </label>
                    ))
                ) : (
                    <input
                        type="text"
                        placeholder="Se precargarán automáticamente"
                        value=""
                        readOnly
                        className="input-readonly"
                    />
                )}
                <small className="campo-ayuda">Desmarca los libros que aún no se devuelven</small>
            </div>

            <div className="formulario-group">
                <p>⚠️ Estado del Libro:</p>
                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="formulario-select"
                >
                    <option value="Buen Estado">✅ Buen Estado</option>
                    <option value="Mal Estado">⚠️ Mal Estado</option>
                    <option value="Deteriorado">❌ Deteriorado</option>
                </select>
            </div>

            <div className="formulario-group">
                <p>📅 Fecha de Entrega:</p>
                <input
                    type="date"
                    value={fechaEntrega}
                    readOnly
                    className="input-readonly"
                />
                <small className="campo-ayuda">Se registra automáticamente la fecha actual</small>
            </div>

            <button type="button" onClick={handleAgregarClick} className="btn-agregar-libro">
                {esEdicion ? "💾 Actualizar Entrega" : "✅ Registrar Entrega"}
            </button>
        </div>
    );
}

export default EntregaFormulario;
