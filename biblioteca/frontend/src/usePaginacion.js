import { useState } from "react";

export const REGISTROS_POR_PAGINA = 10;

export function usePaginacion(items, porPagina = REGISTROS_POR_PAGINA) {
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(items.length / porPagina));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * porPagina;

  return {
    visibles: items.slice(inicio, inicio + porPagina),
    paginaActual,
    totalPaginas,
    total: items.length,
    desde: items.length === 0 ? 0 : inicio + 1,
    hasta: Math.min(inicio + porPagina, items.length),
    irAPagina: (numero) => setPagina(Math.min(Math.max(1, numero), totalPaginas)),
    reiniciar: () => setPagina(1),
  };
}
