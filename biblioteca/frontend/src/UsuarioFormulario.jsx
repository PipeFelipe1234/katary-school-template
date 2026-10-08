import { useState, useEffect } from "react";

function UsuarioFormulario({ onAgregarUsuario, usuarioEditar, esEdicion }) {
    const [identificacion, setIdentificacion] = useState("");
    const [nombres, setNombres] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");

    useEffect(() => {
        if (esEdicion && usuarioEditar) {
            // Cargar datos del usuario en edición
            setIdentificacion(usuarioEditar.identificacion);
            setNombres(usuarioEditar.nombres);
            setEmail(usuarioEditar.email);
            setTelefono(usuarioEditar.telefono);
        } else {
            // Limpiar formulario para nuevo usuario
            setIdentificacion("");
            setNombres("");
            setEmail("");
            setTelefono("");
        }
    }, [esEdicion, usuarioEditar]);

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validarTelefono = (telefono) => {
        const regex = /^\d{7,}$/;
        return regex.test(telefono.replace(/\D/g, ""));
    };

    const handleAgregarClick = () => {
        if (!identificacion.trim()) {
            alert("Por favor ingresa la identificación");
            return;
        }
        if (!nombres.trim()) {
            alert("Por favor ingresa los nombres");
            return;
        }
        if (!email.trim() || !validarEmail(email)) {
            alert("Por favor ingresa un email válido");
            return;
        }
        if (!telefono.trim() || !validarTelefono(telefono)) {
            alert("Por favor ingresa un teléfono válido (mínimo 7 dígitos)");
            return;
        }

        onAgregarUsuario({ identificacion, nombres, email, telefono });
        setIdentificacion("");
        setNombres("");
        setEmail("");
        setTelefono("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAgregarClick();
        }
    };

    return (
        <div className="formulario-container">
            <h2>{esEdicion ? "✏️ Editar Usuario" : "👤 Agregar Nuevo Usuario"}</h2>
            
            <div className="formulario-group">
                <p>🆔 Identificación:</p>
                <input 
                    type="text" 
                    placeholder="Ej: 123456789"
                    value={identificacion}
                    onChange={(e) => setIdentificacion(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <div className="formulario-group">
                <p>👤 Nombres Completos:</p>
                <input 
                    type="text" 
                    placeholder="Ej: Juan Pérez García"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <div className="formulario-group">
                <p>📧 Email:</p>
                <input 
                    type="email" 
                    placeholder="Ej: juan@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <div className="formulario-group">
                <p>📱 Teléfono:</p>
                <input 
                    type="tel" 
                    placeholder="Ej: 3012345678"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <button type="button" onClick={handleAgregarClick} className="btn-agregar-libro">
                {esEdicion ? "💾 Actualizar Usuario" : "✅ Agregar Usuario"}
            </button>
        </div>
    );
}

export default UsuarioFormulario;
