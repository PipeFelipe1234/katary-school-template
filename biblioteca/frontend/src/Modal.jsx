import { useState, useEffect } from "react";

// Debe coincidir con la duración de la animación de salida en styles.css
const DURACION_SALIDA_MS = 300;

function Modal({ abierto, onCerrar, children }) {
  const [visible, setVisible] = useState(abierto);
  const [contenido, setContenido] = useState(children);

  // Mientras está abierto sigue el contenido actual; al cerrar se congela
  // para que el formulario no cambie mientras se desvanece.
  if (abierto && !visible) setVisible(true);
  if (abierto && contenido !== children) setContenido(children);

  useEffect(() => {
    if (abierto || !visible) return undefined;
    const temporizador = setTimeout(() => setVisible(false), DURACION_SALIDA_MS);
    return () => clearTimeout(temporizador);
  }, [abierto, visible]);

  if (!visible) return null;

  return (
    <div className={`modal-overlay${abierto ? "" : " cerrando"}`} onClick={onCerrar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onCerrar} className="btn-cerrar" aria-label="Cerrar">
          ✕
        </button>
        {contenido}
      </div>
    </div>
  );
}

export default Modal;
