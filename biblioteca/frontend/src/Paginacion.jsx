const construirPaginas = (actual, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const paginas = new Set([1, total, actual - 1, actual, actual + 1]);
  const ordenadas = [...paginas].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const resultado = [];
  ordenadas.forEach((p, i) => {
    if (i > 0 && p - ordenadas[i - 1] > 1) resultado.push("...");
    resultado.push(p);
  });
  return resultado;
};

function Paginacion({ paginaActual, totalPaginas, total, desde, hasta, onCambiar, etiqueta = "registros" }) {
  if (total === 0) return null;

  return (
    <nav className="paginacion" aria-label="Paginación">
      <span className="paginacion-info">
        Mostrando {desde}–{hasta} de {total} {etiqueta}
      </span>

      <div className="paginacion-controles">
        <button
          type="button"
          onClick={() => onCambiar(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          ‹ Anterior
        </button>

        {construirPaginas(paginaActual, totalPaginas).map((p, i) =>
          p === "..." ? (
            <span key={`puntos-${i}`} className="paginacion-puntos">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={p === paginaActual ? "activa" : ""}
              aria-current={p === paginaActual ? "page" : undefined}
              onClick={() => onCambiar(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onCambiar(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente ›
        </button>
      </div>
    </nav>
  );
}

export default Paginacion;
