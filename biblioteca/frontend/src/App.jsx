import { useState, useEffect } from "react";
import Libro from "./Libro";
import Usuario from "./Usuario";
import Prestamo from "./Prestamo";
import Entrega from "./Entrega";
import TomaInventario from "./TomaInventario";
import { apiService } from "./services/apiService";

const CLAVE_SESION = "biblioteca.sesion";

const leerSesion = () => {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SESION)) || {};
  } catch {
    return {};
  }
};

const VISTAS_VALIDAS = ["libros", "usuarios", "prestamos", "entregas", "tomaInventario"];

function App() {
  const [sesionGuardada] = useState(leerSesion);
  const [nombre, setNombre] = useState(sesionGuardada.nombre || "");
  const [contraseña, setContraseña] = useState("");
  const [sesionIniciada, setSesionIniciada] = useState(Boolean(sesionGuardada.sesionIniciada));
  const [vistaActual, setVistaActual] = useState(
    VISTAS_VALIDAS.includes(sesionGuardada.vistaActual) ? sesionGuardada.vistaActual : "libros"
  );
  const [libros, setLibros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [tomaInventario, setTomaInventario] = useState([]);

  useEffect(() => {
    if (sesionIniciada) {
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ sesionIniciada, nombre, vistaActual }));
    } else {
      sessionStorage.removeItem(CLAVE_SESION);
    }
  }, [sesionIniciada, nombre, vistaActual]);

  useEffect(() => {
    if (!sesionIniciada) return;
    Promise.all([
      apiService.getLibros(),
      apiService.getUsuarios(),
      apiService.getPrestamos(),
      apiService.getEntregas(),
    ])
      .then(([l, u, p, e]) => {
        setLibros(l);
        setUsuarios(u);
        setPrestamos(p);
        setEntregas(e);
      })
      .catch((err) => console.error("Error al cargar datos iniciales:", err));
  }, [sesionIniciada]);

  const manejarInicioSesion = () => {
    if (nombre.trim() !== "" && contraseña.trim() !== "") {
      setContraseña("");
      setSesionIniciada(true);
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const manejarKeyPress = (e) => {
    if (e.key === "Enter") {
      manejarInicioSesion();
    }
  };

  const manejarCierreSesion = () => {
    setSesionIniciada(false);
    setNombre("");
    setContraseña("");
    setVistaActual("libros");
  };

  return (
    <div className="App">
      <h1>📚 Biblioteca Digital</h1>

      {!sesionIniciada ? (
        <div className="login-container">
          <div className="login-box">
            <h3>Bienvenido</h3>
            <p>Por favor, inicia sesión para continuar</p>
            
            <p>Usuario:</p>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              onKeyPress={manejarKeyPress}
              placeholder="Ingresa tu usuario"
            />
            
            <p>Contraseña:</p>
            <input 
              type="password" 
              value={contraseña} 
              onChange={(e) => setContraseña(e.target.value)}
              onKeyPress={manejarKeyPress}
              placeholder="Ingresa tu contraseña"
            />
            
            <button onClick={manejarInicioSesion}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      ) : (
        <div className="biblioteca-container">
          <div className="biblioteca-header">
            <h3>¡Bienvenido, {nombre}! 👋</h3>
            <p>Explora nuestra colección de libros y recursos digitales</p>
            <hr />
          </div>

          <div className="navegacion-tabs">
            <button 
              className={`tab-button ${vistaActual === "libros" ? "activo" : ""}`}
              onClick={() => setVistaActual("libros")}
            >
              📚 Libros
            </button>
            <button 
              className={`tab-button ${vistaActual === "usuarios" ? "activo" : ""}`}
              onClick={() => setVistaActual("usuarios")}
            >
              👥 Usuarios
            </button>
            <button 
              className={`tab-button ${vistaActual === "prestamos" ? "activo" : ""}`}
              onClick={() => setVistaActual("prestamos")}
            >
              📤 Préstamos
            </button>
            <button 
              className={`tab-button ${vistaActual === "entregas" ? "activo" : ""}`}
              onClick={() => setVistaActual("entregas")}
            >
              📥 Entregas
            </button>
            <button 
              className={`tab-button ${vistaActual === "tomaInventario" ? "activo" : ""}`}
              onClick={() => setVistaActual("tomaInventario")}
            >
              📋 Toma Inventario
            </button>
            <button 
              className="btn-cerrar-sesion"
              onClick={manejarCierreSesion}
            >
              🚪 Cerrar Sesión
            </button>
          </div>

          {vistaActual === "libros" && <Libro librosApp={libros} setLibrosApp={setLibros} />}
          {vistaActual === "usuarios" && <Usuario usuariosApp={usuarios} setUsuariosApp={setUsuarios} />}
          {vistaActual === "prestamos" && <Prestamo libros={libros} setLibrosApp={setLibros} usuarios={usuarios} prestamosApp={prestamos} setPrestamosApp={setPrestamos} entregasApp={entregas} />}
          {vistaActual === "entregas" && <Entrega libros={libros} setLibrosApp={setLibros} usuarios={usuarios} prestamosApp={prestamos} setPrestamosApp={setPrestamos} entregasApp={entregas} setEntregasApp={setEntregas} />}
          {vistaActual === "tomaInventario" && <TomaInventario libros={libros} setLibrosApp={setLibros} tomaInventarioApp={tomaInventario} setTomaInventarioApp={setTomaInventario} />}
        </div>
      )}
    </div>
  );
}
export default App
