import { useState, useEffect } from "react";

function FormularioLibro({ onAgregarLibro, libroEditar, esEdicion }) {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [genero, setGenero] = useState("");
    const [cantidad, setCantidad] = useState("");

    useEffect(() => {
        if (esEdicion && libroEditar) {
            // Cargar datos del libro en edición
            setTitulo(libroEditar.titulo);
            setAutor(libroEditar.autor);
            setGenero(libroEditar.genero);
            setCantidad(libroEditar.cantidad || "");
        } else {
            // Limpiar formulario para nuevo libro
            setTitulo("");
            setAutor("");
            setGenero("");
            setCantidad("");
        }
    }, [esEdicion, libroEditar]);

    const handleAgregarClick = () => {
        if (titulo.trim() && autor.trim() && genero.trim() && cantidad.trim()) {
            onAgregarLibro({ titulo, autor, genero, cantidad });
            setTitulo("");
            setAutor("");
            setGenero("");
            setCantidad("");
        } else {
            alert("Por favor completa todos los campos");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAgregarClick();
        }
    };

    return (
        <div className="formulario-container">
            <h2>{esEdicion ? "✏️ Editar Libro" : "✍️ Agregar Nuevo Libro"}</h2>
            
            <div className="formulario-group">
                <p>📖 Título del libro:</p>
                <input 
                    type="text" 
                    placeholder="Ej: El Quijote"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <div className="formulario-group">
                <p>✍️ Autor:</p>
                <input 
                    type="text" 
                    placeholder="Ej: Miguel de Cervantes"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <div className="formulario-group">
                <p>🏷️ Género:</p>
                <input 
                    type="text" 
                    placeholder="Ej: Novela, Ficción, etc."
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <div className="formulario-group">
                <p>📦 Cantidad:</p>
                <input 
                    type="number" 
                    placeholder="Ej: 5"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    onKeyPress={handleKeyPress}
                    min="1"
                />
            </div>

            <button type="button" onClick={handleAgregarClick} className="btn-agregar-libro">
                {esEdicion ? "💾 Actualizar Libro" : "✅ Agregar Libro"}
            </button>
        </div>
    );
}

export default FormularioLibro;