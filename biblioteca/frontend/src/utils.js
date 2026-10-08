export const normalizar = (texto) =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Búsqueda sin distinguir mayúsculas ni tildes
export const contiene = (valor, busqueda) => normalizar(valor).includes(normalizar(busqueda));
