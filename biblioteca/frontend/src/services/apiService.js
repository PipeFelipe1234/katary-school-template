const API_BASE_URL = 'http://localhost:5254/api';

const leerError = async (response, mensajePorDefecto) => {
  try {
    const texto = await response.text();
    if (!texto) return mensajePorDefecto;
    try {
      const json = JSON.parse(texto);
      if (typeof json === 'string') return json;
      if (json.errors) return Object.values(json.errors).flat().join(' ');
      return json.title || json.detail || mensajePorDefecto;
    } catch {
      return texto;
    }
  } catch {
    return mensajePorDefecto;
  }
};

const solicitar = async (ruta, { metodo = 'GET', cuerpo, mensaje }) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/${ruta}`, {
      method: metodo,
      headers: cuerpo !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch (error) {
    console.error(`Error de red en ${metodo} ${ruta}:`, error);
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.', { cause: error });
  }

  if (!response.ok) {
    const detalle = await leerError(response, mensaje);
    console.error(`Error en ${metodo} ${ruta}:`, detalle);
    throw new Error(detalle);
  }

  if (response.status === 204) return true;
  return response.json();
};

const crudDe = (ruta, singular) => ({
  getAll: () => solicitar(ruta, { mensaje: `Error al obtener ${singular}s` }),
  getById: (id) => solicitar(`${ruta}/${id}`, { mensaje: `Error al obtener ${singular}` }),
  create: (datos) => solicitar(ruta, { metodo: 'POST', cuerpo: datos, mensaje: `Error al crear ${singular}` }),
  update: (id, datos) =>
    solicitar(`${ruta}/${id}`, { metodo: 'PUT', cuerpo: { ...datos, id }, mensaje: `Error al actualizar ${singular}` }),
  remove: (id) => solicitar(`${ruta}/${id}`, { metodo: 'DELETE', mensaje: `Error al eliminar ${singular}` }),
});

const usuarios = crudDe('usuarios', 'usuario');
const libros = crudDe('libros', 'libro');
const prestamos = crudDe('prestamos', 'préstamo');
const entregas = crudDe('entregas', 'entrega');
const tomas = crudDe('tomainventarios', 'toma de inventario');

export const apiService = {
  getUsuarios: usuarios.getAll,
  getUsuario: usuarios.getById,
  createUsuario: usuarios.create,
  updateUsuario: usuarios.update,
  deleteUsuario: usuarios.remove,

  getLibros: libros.getAll,
  getLibro: libros.getById,
  createLibro: libros.create,
  updateLibro: libros.update,
  deleteLibro: libros.remove,

  getPrestamos: prestamos.getAll,
  getPrestamo: prestamos.getById,
  createPrestamo: prestamos.create,
  updatePrestamo: prestamos.update,
  deletePrestamo: prestamos.remove,

  getEntregas: entregas.getAll,
  getEntrega: entregas.getById,
  createEntrega: entregas.create,
  updateEntrega: entregas.update,
  deleteEntrega: entregas.remove,

  getTomaInventarios: tomas.getAll,
  getTomaInventario: tomas.getById,
  createTomaInventario: tomas.create,
  updateTomaInventario: tomas.update,
  deleteTomaInventario: tomas.remove,
};
