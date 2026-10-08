import { useState, useEffect } from "react";

const fechaHoy = () => new Date().toISOString().split("T")[0];

function PrestamoFormulario({ onAgregarPrestamo, prestamoEditar, esEdicion, libros = [], usuarios = [] }) {
    const [libro1, setLibro1] = useState("");
    const [libro2, setLibro2] = useState("");
    const [identificacionUsuario, setIdentificacionUsuario] = useState("");
    const [usuarioId, setUsuarioId] = useState(null);
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [fecha, setFecha] = useState(fechaHoy());

    useEffect(() => {
        if (esEdicion && prestamoEditar) {
            const usuario = usuarios.find(u => u.id === prestamoEditar.usuarioId);
            setLibro1(String(prestamoEditar.libroId));
            setLibro2("");
            setUsuarioId(prestamoEditar.usuarioId);
            setIdentificacionUsuario(usuario ? usuario.identificacion : "");
            setNombreUsuario(usuario ? usuario.nombres : "");
            setFecha(prestamoEditar.fechaPrestamo.split("T")[0]);
        } else {
            setLibro1("");
            setLibro2("");
            setUsuarioId(null);
            setIdentificacionUsuario("");
            setNombreUsuario("");
            setFecha(fechaHoy());
        }
    }, [esEdicion, prestamoEditar, usuarios]);

    const handleIdentificacionChange = (e) => {
        const identificacion = e.target.value;
        setIdentificacionUsuario(identificacion);

        const usuario = usuarios.find(u => u.identificacion === identificacion.trim());
        setUsuarioId(usuario ? usuario.id : null);
        setNombreUsuario(usuario ? usuario.nombres : "");
    };

    const handleAgregarClick = () => {
        if (!libro1) {
            alert("Por favor selecciona al menos un libro");
            return;
        }

        if (libro2 && libro1 === libro2) {
            alert("Los libros deben ser diferentes. No puedes prestar dos del mismo libro");
            return;
        }

        if (!identificacionUsuario.trim()) {
            alert("Por favor ingresa la identificación del usuario");
            return;
        }

        if (usuarioId === null) {
            alert("El usuario no existe. Verifica la identificación");
            return;
        }

        const libroIds = [parseInt(libro1)];
        if (libro2) {
            libroIds.push(parseInt(libro2));
        }

        onAgregarPrestamo({
            usuarioId,
            libroIds,
            fechaPrestamo: fecha
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAgregarClick();
        }
    };

    const opcionesLibros = libros.map((libro) => (
        <option key={libro.id} value={libro.id} disabled={libro.cantidad <= 0 && String(libro.id) !== libro1}>
            {libro.titulo} - {libro.autor} (Qty: {libro.cantidad})
        </option>
    ));

    return (
        <div className="formulario-container">
            <h2>{esEdicion ? "✏️ Editar Préstamo" : "📤 Nuevo Préstamo"}</h2>

            <div className="formulario-group">
                <p>📖 Seleccionar Libro 1 (Requerido):</p>
                <select
                    value={libro1}
                    onChange={(e) => setLibro1(e.target.value)}
                    className="formulario-select"
                >
                    <option value="">-- Selecciona un libro --</option>
                    {opcionesLibros}
                </select>
            </div>

            {!esEdicion && (
                <div className="formulario-group">
                    <p>📖 Seleccionar Libro 2 (Opcional):</p>
                    <select
                        value={libro2}
                        onChange={(e) => setLibro2(e.target.value)}
                        className="formulario-select"
                    >
                        <option value="">-- Sin libro adicional --</option>
                        {opcionesLibros}
                    </select>
                    <small className="campo-ayuda">Máximo 2 libros y deben ser diferentes</small>
                </div>
            )}

            <div className="formulario-group">
                <p>🆔 Identificación del Usuario:</p>
                <input
                    type="text"
                    placeholder="Ej: 123456789"
                    value={identificacionUsuario}
                    onChange={handleIdentificacionChange}
                    onKeyPress={handleKeyPress}
                />
                <small className="campo-ayuda">
                    Ingresa la identificación y se precargará el nombre automáticamente
                </small>
            </div>

            <div className="formulario-group">
                <p>👤 Nombre del Usuario (Precargado):</p>
                <input
                    type="text"
                    placeholder="Se precargará automáticamente"
                    value={nombreUsuario}
                    readOnly
                    className="input-readonly"
                />
            </div>

            <div className="formulario-group">
                <p>📅 Fecha del Préstamo:</p>
                <input
                    type="date"
                    value={fecha}
                    readOnly
                    className="input-readonly"
                />
                <small className="campo-ayuda">La fecha se registra automáticamente (vence a los 14 días)</small>
            </div>

            <button type="button" onClick={handleAgregarClick} className="btn-agregar-libro">
                {esEdicion ? "💾 Actualizar Préstamo" : "✅ Registrar Préstamo"}
            </button>
        </div>
    );
}

export default PrestamoFormulario;
