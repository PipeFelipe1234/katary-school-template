# ⚡ INICIO RÁPIDO EN 5 MINUTOS

## 🚀 TL;DR (Too Long; Didn't Read)

```bash
# 1. Crear BD
sqlcmd -S localhost
> CREATE DATABASE BibliotecaDB;
> GO
> EXIT

# 2. Migrar (en carpeta del backend)
cd C:\Users\ANDRES FELIPE\Desktop\REACT\biblioteca\backend\Biblioteca.API
dotnet ef database update

# 3. Iniciar Backend (Terminal 1)
dotnet run
# http://localhost:5000 ← Backend
# http://localhost:5000/swagger ← Swagger

# 4. Iniciar Frontend (Terminal 2)
cd C:\Users\ANDRES FELIPE\Desktop\REACT\biblioteca\frontend
npm run dev
# http://localhost:5173 ← Frontend

# 5. Probar
- Abrir Swagger
- Crear un usuario
- Ir al Frontend
- Ver usuario en tabla
```

---

## ✅ CHECKLIST (30 segundos)

- [ ] SQL Server corre localmente
- [ ] BD `BibliotecaDB` existe
- [ ] Backend compiló sin errores
- [ ] Frontend inicia sin errores
- [ ] Swagger accesible en localhost:5000
- [ ] React carga en localhost:5173
- [ ] Puedo crear usuario en Swagger
- [ ] Usuario aparece en BD

---

## 🐛 Si Algo Falla

### Error: "Cannot connect to database"
```bash
# Solución 1: Crear BD manualmente
sqlcmd -S localhost
CREATE DATABASE BibliotecaDB;
GO
EXIT

# Solución 2: Verificar connection string en appsettings.json
```

### Error: "Migration failed"
```bash
# Solución: Ejecutar desde carpeta correcta
cd C:\Users\ANDRES FELIPE\Desktop\REACT\biblioteca\backend\Biblioteca.API
dotnet ef database update --context BibliotecaDbContext -v
```

### Error: "Port already in use"
```bash
# Solución: Cambiar puerto en launchSettings.json
# O: Matar proceso anterior
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Error: "CORS blocked"
- Reinicia backend y frontend
- Limpia caché del navegador (Ctrl+Shift+Del)

### Frontend vacío
- Abre DevTools (F12)
- Consola → ¿hay errores?
- Network → ¿requests llegan a backend?
- Backend corre en http://localhost:5000?

---

## 📱 Vista Rápida de Endpoints

```
Usuarios:        GET/POST/PUT/DELETE /api/usuarios
Libros:          GET/POST/PUT/DELETE /api/libros
Préstamos:       GET/POST/PUT/DELETE /api/prestamos
Entregas:        GET/POST/PUT/DELETE /api/entregas
Toma Inventario: GET/POST/PUT/DELETE /api/tomainventarios
```

---

## 🎯 Test Swagger (60 segundos)

1. Ir a: `http://localhost:5000/swagger`
2. Expandir "Usuarios"
3. Click en "POST /api/usuarios"
4. Click en "Try it out"
5. Pegar JSON:
```json
{
  "identificacion": "123456789",
  "nombres": "Juan Pérez",
  "email": "juan@test.com",
  "telefono": "3012345678"
}
```
6. Click "Execute"
7. Resultado: 201 Created ✅

---

## 🎯 Test Frontend (60 segundos)

1. Ir a: `http://localhost:5173`
2. Login: usuario/contraseña (cualquier cosa)
3. Click "Usuarios"
4. Click "+ Agregar Usuario"
5. Llenar:
   - Identificación: 987654321
   - Nombres: María López
   - Email: maria@test.com
   - Teléfono: 3109876543
6. Click "Agregar Usuario"
7. Resultado: Aparece en tabla ✅
8. Refrescar (F5): ¿Sigue ahí? ✅

---

## 📊 Verificar en DBeaver

1. Abrir DBeaver
2. SQL Server Connection
3. BD: `BibliotecaDB`
4. Tables → Usuarios
5. Right click → "Select rows"
6. Ver datos en tabla

---

## 🔧 Cambiar Puertos (Si Necesario)

### Backend
Archivo: `Properties/launchSettings.json`
```json
"http": {
  "commandName": "Project",
  "dotnetRunMessages": true,
  "launchBrowser": true,
  "launchUrl": "swagger",
  "applicationUrl": "http://localhost:5555" ← Cambiar acá
}
```

### Frontend
Archivo: `vite.config.js`
```javascript
export default defineConfig({
  server: {
    port: 5555 // ← Cambiar acá
  }
})
```

### API Service
Archivo: `src/services/apiService.js`
```javascript
const API_BASE_URL = 'http://localhost:5555/api'; // ← Cambiar puerto
```

---

## 📝 Resumen Carpetas

```
REACT/
├── biblioteca/
│   ├── GUIA_IMPLEMENTACION.md ← Leer esto primero
│   ├── frontend/
│   │   ├── src/services/apiService.js ← Llamadas API
│   │   ├── src/Usuario.jsx ← Componente actualizado
│   │   └── npm run dev ← Iniciar React
│   └── backend/
│       ├── Biblioteca.API/
│       │   ├── Models/ ← Entidades
│       │   ├── Controllers/ ← Endpoints
│       │   ├── Data/BibliotecaDbContext.cs ← ORM
│       │   └── dotnet run ← Iniciar .NET
│       └── README.md ← Detalles backend
```

---

## 🎓 Documentación Completa

| Archivo | Ubicación | Contenido |
|---------|-----------|----------|
| `GUIA_IMPLEMENTACION.md` | `biblioteca/` | Paso a paso completo |
| `README.md` | `backend/` | Info del backend |
| `apiService.js` | `frontend/src/services/` | Funciones API |

---

## 💡 Tips

1. **Backend en terminal 1, Frontend en terminal 2**
   - Así puedes verlos simultáneamente

2. **Swagger es tu amigo**
   - Prueba endpoints sin frontend
   - Verifica que backend funciona

3. **DevTools en navegador (F12)**
   - Consola → errores
   - Network → requests
   - Storage → localStorage

4. **SQL Server Management Studio**
   - Verifica tablas creadas
   - Ve datos en tiempo real

5. **Ctrl+Shift+Del en navegador**
   - Limpia caché si da problemas

---

## ⏱️ Tiempos Esperados

| Tarea | Tiempo |
|-------|--------|
| Crear BD | 5 seg |
| Migrar BD | 10 seg |
| Compilar backend | 5 seg |
| Iniciar backend | 3 seg |
| Iniciar frontend | 5 seg |
| Primer test | 30 seg |
| **TOTAL** | **~60 seg** ✅ |

---

## 🔐 Credenciales (Por Ahora)

Login en Frontend:
- Usuario: (cualquiera)
- Contraseña: (cualquiera)

⚠️ Nota: El login actual es solo frontend. Para producción, agregar autenticación real.

---

## 🚨 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Cannot GET /api/usuarios" | Backend no corre | `dotnet run` |
| "CORS blocked" | CORS no configurado | Reinicia ambos |
| "Database error" | BD no existe | `CREATE DATABASE BibliotecaDB` |
| "Port in use" | Puerto ocupado | Cambia en settings |
| "Tabla vacía" | useEffect no ejecutó | Abre DevTools → Network |

---

## ✨ Success Indicators

Cuando veas esto, ¡ÉXITO! 🎉

```
✅ Backend compila sin errores
✅ "Now listening on http://localhost:5000"
✅ Swagger accesible
✅ Frontend inicia sin errores
✅ React carga en navegador
✅ Puedo crear usuario en Swagger
✅ Usuario aparece en tabla frontend
✅ Usuario persiste al refrescar
✅ Usuario visible en DBeaver
```

---

¡Listo! Ahora sí es tiempo de implementar 🚀

Creado con ❤️ - 2026-10-07
