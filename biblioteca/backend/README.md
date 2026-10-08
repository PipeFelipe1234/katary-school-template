# 📚 Sistema de Biblioteca - Backend .NET

## Estado Actual

✅ **Backend completamente configurado con:**
- Entity Framework Core 8.0 + SQL Server
- 5 Modelos de datos (Usuario, Libro, Préstamo, Entrega, TomaInventario)
- 5 Controllers con operaciones CRUD completas
- Swagger para pruebas de API
- CORS configurado para React
- Migraciones Entity Framework creadas

✅ **Frontend modificado para consumir API:**
- Servicio `apiService.js` con todas las operaciones CRUD
- Componentes Usuario y Libro actualizados para usar backend
- Manejo de errores y carga de datos

---

## 🚀 Próximos Pasos

### 1. **Preparar Base de Datos SQL Server**

Necesitas crear la base de datos en SQL Server. Abre SQL Server Management Studio o SQL Server Command Line y ejecuta:

```sql
CREATE DATABASE BibliotecaDB;
```

La cadena de conexión está en `appsettings.json`:
```json
"DefaultConnection": "Server=localhost;Database=BibliotecaDB;Trusted_Connection=true;TrustServerCertificate=true;Encrypt=false;"
```

### 2. **Ejecutar Migraciones**

Una vez que la base de datos exista, ejecuta las migraciones desde la carpeta del proyecto:

```bash
cd C:\Users\ANDRES FELIPE\Desktop\REACT\biblioteca\backend\Biblioteca.API
dotnet ef database update --context BibliotecaDbContext
```

Esto creará automáticamente todas las tablas basadas en los modelos C#.

### 3. **Iniciar el Backend**

Desde la carpeta del proyecto:

```bash
cd C:\Users\ANDRES FELIPE\Desktop\REACT\biblioteca\backend\Biblioteca.API
dotnet run
```

El servidor estará disponible en: `http://localhost:5000`
Swagger estará en: `http://localhost:5000/swagger`

### 4. **Iniciar el Frontend**

En otra terminal:

```bash
cd C:\Users\ANDRES FELIPE\Desktop\REACT\biblioteca\frontend
npm run dev
```

Frontend estará en: `http://localhost:5173` o `http://localhost:5174`

---

## 📋 Endpoints Disponibles

### Usuarios
- `GET /api/usuarios` - Obtener todos
- `GET /api/usuarios/{id}` - Obtener por ID
- `POST /api/usuarios` - Crear
- `PUT /api/usuarios/{id}` - Actualizar
- `DELETE /api/usuarios/{id}` - Eliminar

### Libros
- `GET /api/libros` - Obtener todos
- `GET /api/libros/{id}` - Obtener por ID
- `POST /api/libros` - Crear
- `PUT /api/libros/{id}` - Actualizar
- `DELETE /api/libros/{id}` - Eliminar

### Préstamos
- `GET /api/prestamos` - Obtener todos
- `GET /api/prestamos/{id}` - Obtener por ID
- `POST /api/prestamos` - Crear
- `PUT /api/prestamos/{id}` - Actualizar
- `DELETE /api/prestamos/{id}` - Eliminar

### Entregas
- `GET /api/entregas` - Obtener todos
- `GET /api/entregas/{id}` - Obtener por ID
- `POST /api/entregas` - Crear
- `PUT /api/entregas/{id}` - Actualizar
- `DELETE /api/entregas/{id}` - Eliminar

### Toma Inventario
- `GET /api/tomainventarios` - Obtener todos
- `GET /api/tomainventarios/{id}` - Obtener por ID
- `POST /api/tomainventarios` - Crear
- `PUT /api/tomainventarios/{id}` - Actualizar
- `DELETE /api/tomainventarios/{id}` - Eliminar

---

## 📊 Estructura de Datos

### Usuario
```json
{
  "id": 1,
  "identificacion": "123456789",
  "nombres": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "telefono": "3012345678"
}
```

### Libro
```json
{
  "id": 1,
  "titulo": "Clean Code",
  "autor": "Robert Martin",
  "genero": "Programación",
  "cantidad": 5
}
```

### Préstamo
```json
{
  "id": 1,
  "usuarioId": 1,
  "libroId": 1,
  "fechaPrestamo": "2026-10-07T00:00:00",
  "fechaVencimiento": "2026-10-21T00:00:00",
  "estado": "Activo"
}
```

### Entrega
```json
{
  "id": 1,
  "prestamoId": 1,
  "fechaEntrega": "2026-10-15T00:00:00",
  "estado": "Entregado"
}
```

### Toma Inventario
```json
{
  "id": 1,
  "libroId": 1,
  "fecha": "2026-10-07T00:00:00",
  "cantidadFisica": 5,
  "cantidadSistema": 5,
  "diferencia": 0,
  "notas": ""
}
```

---

## 🔧 Tecnologías Utilizadas

**Backend:**
- .NET 10
- Entity Framework Core 8.0
- SQL Server
- Swagger/OpenAPI
- ASP.NET Core

**Frontend:**
- React 18
- JavaScript ES6+
- Fetch API

---

## ✅ Checklist para Próxima Ejecución

- [ ] Crear base de datos `BibliotecaDB` en SQL Server
- [ ] Ejecutar migraciones de Entity Framework
- [ ] Iniciar backend (.NET)
- [ ] Iniciar frontend (React)
- [ ] Probar CRUD en Swagger
- [ ] Probar CRUD en la interfaz React

---

## 📝 Notas Importantes

1. **Conexión a SQL Server**: Asegúrate de que SQL Server está corriendo localmente
2. **Puertos**: Backend usa puerto 5000 (default HTTPS), Frontend usa 5173/5174
3. **CORS**: Ya está configurado para comunicación Frontend-Backend
4. **Migraciones**: Las tablas se crean automáticamente con `dotnet ef database update`
5. **DBeaver**: Úsalo después de migrar para ver la estructura real de la BD

---

Creado con ❤️ por Copilot - Unificación Frontend/Backend
