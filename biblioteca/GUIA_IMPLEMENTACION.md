# 🚀 GUÍA DE IMPLEMENTACIÓN - SISTEMA DE BIBLIOTECA UNIFICADO

## Estado Actual ✅

Tu sistema ya tiene:
- **Backend**: .NET API REST con Entity Framework Core
- **Frontend**: React actualizado para consumir la API
- **Base de Datos**: Migraciones Entity Framework preparadas
- **API Service**: Centralizado en `apiService.js`

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Paso 1: Preparar SQL Server ✅

```sql
-- Abrir SQL Server Management Studio o línea de comandos
CREATE DATABASE BibliotecaDB;
```

**Conexión en `appsettings.json`:**
```
Server=localhost;Database=BibliotecaDB;Trusted_Connection=true;TrustServerCertificate=true;Encrypt=false;
```

---

### Paso 2: Ejecutar Migraciones 🔄

Abre PowerShell o CMD en la carpeta del backend:

```bash
cd C:\Users\ANDRES FELIPE\Desktop\REACT\biblioteca\backend\Biblioteca.API
dotnet ef database update --context BibliotecaDbContext
```

**Resultado esperado:**
- Tablas creadas en BibliotecaDB:
  - ✅ Usuarios
  - ✅ Libros
  - ✅ Prestamos
  - ✅ Entregas
  - ✅ TomaInventarios

---

### Paso 3: Iniciar Backend 🎯

```bash
cd C:\Users\ANDRES FELIPE\Desktop\REACT\biblioteca\backend\Biblioteca.API
dotnet run
```

**Esperado:**
- Servidor inicia en: `https://localhost:5001` o `http://localhost:5000`
- Swagger disponible en: `http://localhost:5000/swagger`

---

### Paso 4: Iniciar Frontend ⚛️

En otra terminal:

```bash
cd C:\Users\ANDRES FELIPE\Desktop\REACT\biblioteca\frontend
npm run dev
```

**Esperado:**
- Frontend en: `http://localhost:5173` o `http://localhost:5174`
- Hace login y debería cargar datos del backend

---

## 🧪 Pruebas

### Test 1: Swagger (Recomendado Primero)
1. Ir a: `http://localhost:5000/swagger`
2. Expandir "Usuarios"
3. Probar "POST /api/usuarios" con datos:
```json
{
  "identificacion": "123456789",
  "nombres": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "telefono": "3012345678"
}
```
4. Debería retornar 201 Created con el usuario creado

### Test 2: Frontend (UI)
1. Abrir `http://localhost:5173`
2. Hacer login (cualquier usuario/contraseña)
3. Ir a pestaña "Usuarios"
4. Click en "+ Agregar Usuario"
5. Llenar formulario
6. Click "Agregar Usuario"
7. **Esperado**: Dato se guarda en BD y aparece en tabla

### Test 3: Persistencia
1. Agregar un usuario en la UI
2. Refrescar la página (F5)
3. **Esperado**: El usuario sigue visible (viene del backend)

### Test 4: DBeaver (Verificación BD)
1. Abrir DBeaver
2. Conectar a SQL Server local
3. BD: `BibliotecaDB`
4. Ver tablas y datos insertados

---

## 📊 Estructura de Datos a Enviar

### Crear Usuario
**POST** `/api/usuarios`
```json
{
  "identificacion": "123456789",
  "nombres": "Juan Pérez García",
  "email": "juan@ejemplo.com",
  "telefono": "3012345678"
}
```

### Crear Libro
**POST** `/api/libros`
```json
{
  "titulo": "Clean Code",
  "autor": "Robert Martin",
  "genero": "Programación",
  "cantidad": 5
}
```

### Crear Préstamo
**POST** `/api/prestamos`
```json
{
  "usuarioId": 1,
  "libroId": 1,
  "fechaPrestamo": "2026-10-07T00:00:00",
  "fechaVencimiento": "2026-10-21T00:00:00",
  "estado": "Activo"
}
```

### Crear Entrega
**POST** `/api/entregas`
```json
{
  "prestamoId": 1,
  "fechaEntrega": "2026-10-15T00:00:00",
  "estado": "Entregado"
}
```

### Crear Toma Inventario
**POST** `/api/tomainventarios`
```json
{
  "libroId": 1,
  "fecha": "2026-10-07T00:00:00",
  "cantidadFisica": 5,
  "cantidadSistema": 5,
  "diferencia": 0,
  "notas": ""
}
```

---

## 🔄 Flujo de Datos

```
Frontend (React)
    ↓
    [Click Agregar Usuario]
    ↓
    UsuarioFormulario valida
    ↓
    apiService.createUsuario()
    ↓
    fetch POST /api/usuarios
    ↓
    Backend (.NET)
    ├─ UsuariosController
    ├─ DbContext valida
    └─ Inserta en BD
    ↓
    Retorna JSON con ID
    ↓
    Frontend actualiza tabla
    ↓
    Usuario ve dato en pantalla
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Cannot GET /api/usuarios"
**Solución**: Backend no está corriendo. Ejecuta `dotnet run`

### ❌ Error: "CORS policy blocked"
**Solución**: Ya está configurado. Reinicia ambos servidores.

### ❌ Error: "Database connection failed"
**Solución**: 
1. Verifica que SQL Server está corriendo
2. Verifica nombre de BD en `appsettings.json`
3. Ejecuta migraciones: `dotnet ef database update`

### ❌ Error: "Port 5000 already in use"
**Solución**: Cambia puerto en launchSettings.json o mata proceso anterior

### ❌ Tabla vacía en Frontend
**Solución**:
1. Abre DevTools (F12)
2. Consola → mira errores
3. Network → mira requests a API
4. Verifica que backend está corriendo

---

## 📁 Archivos Clave

| Archivo | Ubicación | Propósito |
|---------|-----------|----------|
| `apiService.js` | `frontend/src/services/` | Llamadas HTTP a backend |
| `Program.cs` | `backend/Biblioteca.API/` | Configuración .NET |
| `BibliotecaDbContext.cs` | `backend/Biblioteca.API/Data/` | Modelos ORM |
| `appsettings.json` | `backend/Biblioteca.API/` | Cadena conexión BD |
| `Usuario.jsx` | `frontend/src/` | Componente actualizado |
| `Libro.jsx` | `frontend/src/` | Componente actualizado |
| `Prestamo.jsx` | `frontend/src/` | Componente actualizado |
| `Entrega.jsx` | `frontend/src/` | Componente actualizado |
| `TomaInventario.jsx` | `frontend/src/` | Componente actualizado |

---

## 🎯 Próximas Mejoras Opcionales

- [ ] Agregar autenticación JWT
- [ ] Validaciones más estrictas
- [ ] Paginación en tablas
- [ ] Búsqueda/filtrado
- [ ] Reporte PDF
- [ ] Gráficas de estadísticas
- [ ] Notificaciones en tiempo real

---

## ✅ Verificación Final

Antes de dar por completado, verifica:

- [ ] Backend compila sin errores
- [ ] BD se crea y migraciones aplican
- [ ] Frontend carga sin errores
- [ ] Datos se guardan en BD
- [ ] Datos persisten al refrescar
- [ ] CRUD completo funciona (Create, Read, Update, Delete)
- [ ] Swagger muestra todos los endpoints

---

## 📞 Resumen Rápido

1. **Crear BD**: `CREATE DATABASE BibliotecaDB;`
2. **Migrar**: `dotnet ef database update`
3. **Backend**: `dotnet run` (en carpeta Backend)
4. **Frontend**: `npm run dev` (en carpeta Frontend)
5. **Probar**: Ir a http://localhost:5173

¡Listo! 🎉

---

**Creado**: 2026-10-07  
**Versión**: 1.0  
**Estado**: Listo para implementación
