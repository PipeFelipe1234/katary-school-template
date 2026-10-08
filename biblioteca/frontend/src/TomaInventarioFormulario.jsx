import { useState, useEffect } from "react";

function TomaInventarioFormulario({ onAgregarToma, tomaEditar, esEdicion, libros = [] }) {
    const [libroId, setLibroId] = useState("");
    const [cantidadFisica, setCantidadFisica] = useState("");
    const [notas, setNotas] = useState("");

    useEffect(() => {
        if (esEdicion && tomaEditar) {
            setLibroId(String(tomaEditar.libroId));
            setCantidadFisica(String(tomaEditar.cantidadFisica));
            setNotas(tomaEditar.notas || "");
        } else {
            setLibroId("");
            setCantidadFisica("");
            setNotas("");
        }
    }, [esEdicion, tomaEditar]);

    const libroSeleccionado = libros.find(l => String(l.id) === libroId);

    const handleAgregarClick = () => {
        if (!libroId) {
            alert("Por favor selecciona un libro");
            return;
        }
        if (cantidadFisica === "") {
            alert("Por favor ingresa la cantidad física contada");
            return;
        }

        const cantidadFisicaNum = parseInt(cantidadFisica);
        if (isNaN(cantidadFisicaNum) || cantidadFisicaNum < 0) {
            alert("La cantidad física debe ser un número válido mayor o igual a 0");
            return;
        }

        onAgregarToma({
            libroId: parseInt(libroId),
            cantidadFisica: cantidadFisicaNum,
            notas
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAgregarClick();
        }
    };

    return (
        <div className="formulario-container">
            <h2>{esEdicion ? "✏️ Editar Toma de Inventario" : "📋 Nueva Toma de Inventario"}</h2>

            <div className="formulario-group">
                <p>📖 Seleccionar Libro:</p>
                <select
                    value={libroId}
                    onChange={(e) => setLibroId(e.target.value)}
                    className="formulario-select"
                    disabled={esEdicion}
                >
                    <option value="">-- Selecciona un libro --</option>
                    {libros.map((libro) => (
                        <option key={libro.id} value={libro.id}>
                            {libro.titulo} - {libro.autor} ({libro.genero})
                        </option>
                    ))}
                </select>
            </div>

            <div className="formulario-group">
                <p>📦 Cantidad en Sistema:</p>
                <input
                    type="number"
                    placeholder="Se precargará automáticamente"
                    value={libroSeleccionado ? libroSeleccionado.cantidad : ""}
                    readOnly
                    className="input-readonly"
                />
                <small className="campo-ayuda">
                    Esta es la cantidad actual del libro en el sistema
                </small>
            </div>

            <div className="formulario-group">
                <p>📦 Cantidad Física (contada):</p>
                <input
                    type="number"
                    placeholder="Ej: 8"
                    value={cantidadFisica}
                    onChange={(e) => setCantidadFisica(e.target.value)}
                    onKeyPress={handleKeyPress}
                    min="0"
                />
                <small className="campo-ayuda">
                    Ingresa la cantidad que verificaste en el inventario. El sistema quedará con este valor.
                </small>
            </div>

            <div className="formulario-group">
                <p>📝 Notas (opcional):</p>
                <input
                    type="text"
                    placeholder="Ej: Faltan 2 ejemplares"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <button type="button" onClick={handleAgregarClick} className="btn-agregar-libro">
                {esEdicion ? "💾 Actualizar Toma" : "✅ Registrar Toma"}
            </button>
        </div>
    );
}

export default TomaInventarioFormulario;
