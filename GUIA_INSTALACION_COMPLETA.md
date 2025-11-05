# 🚀 Guía de Instalación Completa - FitTrack

## ✅ Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- [ ] **XAMPP** (Apache + MySQL + PHP)
- [ ] **Node.js** (versión 16 o superior)
- [ ] **Git** (para clonar el repositorio)
- [ ] Navegador web (Chrome, Firefox, Edge, etc.)

---

## 📥 PASO 1: Clonar el Repositorio

### 1.1 Abrir terminal/CMD y navegar a htdocs

```bash
cd C:\xampp2\htdocs
```

### 1.2 Clonar el repositorio

```bash
git clone https://github.com/CarlosOS22/FitTrack.git fittrackapp
cd fittrackapp
git checkout claude/auto-plan-generation-exercise-editing-011CUhZFnRhVZcixUvjXgQn9
```

**Resultado esperado:** La carpeta debe estar en `C:\xampp2\htdocs\fittrackapp`

---

## 🗄️ PASO 2: Configurar MySQL

### 2.1 Abrir XAMPP Control Panel

1. Abre **XAMPP Control Panel**
2. Haz clic en **"Start"** en **MySQL**
3. Verifica que MySQL esté en puerto **3307** (o el que uses)

### 2.2 Crear la base de datos

**Opción A: Usando phpMyAdmin (Recomendado)**

1. Abre en navegador: `http://localhost/phpmyadmin`
2. Haz clic en la pestaña **"Importar"**
3. Haz clic en **"Seleccionar archivo"**
4. Busca: `C:\xampp2\htdocs\fittrackapp\backend\database\setup_xampp.sql`
5. Haz clic en **"Continuar"**

**Opción B: Por línea de comandos**

```bash
mysql -u root -P 3307 < C:\xampp2\htdocs\fittrackapp\backend\database\setup_xampp.sql
```

### 2.3 Verificar que se creó

1. En phpMyAdmin, verifica que aparezca la base de datos **"fittrack"**
2. Debe tener estas tablas:
   - ✅ users
   - ✅ user_data
   - ✅ weekly_plan_recipes
   - ✅ weekly_plan_exercises
   - ✅ progress
   - ✅ recipe_suggestions
   - ✅ shopping_list

---

## 🔧 PASO 3: Configurar el Backend

### 3.1 Verificar configuración de base de datos

El archivo `backend/config/database.php` debe tener:

```php
private $host = "localhost";
private $port = "3307";  // ← Tu puerto de MySQL
private $database_name = "fittrack";
private $username = "root";
private $password = "";  // ← Vacío en XAMPP por defecto
```

**⚠️ IMPORTANTE:** Si tu MySQL usa puerto **3306** (no 3307), cambia la línea 5:

```php
private $port = "3306";
```

### 3.2 Iniciar Apache

1. En XAMPP Control Panel, haz clic en **"Start"** en **Apache**
2. Verifica que diga **"Running"** con fondo verde

### 3.3 Verificar que el backend funciona

Abre en tu navegador:

```
http://localhost/fittrackapp/backend/api/test.php
```

**Deberías ver:**

```json
{
  "success": true,
  "message": "✅ Conexión a la base de datos exitosa",
  "database": "fittrack_db",
  "php_version": "8.x.x",
  "server_time": "2024-xx-xx xx:xx:xx"
}
```

---

## ⚛️ PASO 4: Configurar el Frontend

### 4.1 Instalar dependencias

Abre terminal/CMD:

```bash
cd C:\xampp2\htdocs\fittrackapp\frontend
npm install
```

Esto puede tardar 1-2 minutos.

### 4.2 Verificar archivo .env

El archivo `frontend/.env` debe contener:

```env
VITE_API_URL=http://localhost/fittrackapp/backend/api
```

**⚠️ Si tu Apache usa otro puerto (ej: 8080):**

```env
VITE_API_URL=http://localhost:8080/fittrackapp/backend/api
```

### 4.3 Iniciar el servidor de desarrollo

```bash
npm run dev
```

**Deberías ver:**

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**NO cierres esta terminal.** Déjala corriendo.

---

## 🧪 PASO 5: Verificación Completa

### 5.1 Verificar backend

Abre en navegador:

```
http://localhost/fittrackapp/backend/verificacion-completa.html
```

Haz clic en **"▶ Iniciar Verificación Completa"**

**Todas las pruebas deben estar en VERDE ✓**

Si alguna sale en ROJO ✗:
- Verifica que Apache y MySQL estén corriendo
- Revisa que la base de datos esté creada
- Comprueba la configuración del puerto

### 5.2 Abrir la aplicación

Abre en navegador:

```
http://localhost:5173
```

**Deberías ver:** La página de inicio de FitTrack

---

## 🎯 PASO 6: Probar Funcionalidades

### 6.1 Registro de usuario

1. Ve a: `http://localhost:5173`
2. Haz clic en **"Registrarse"**
3. Completa el formulario:
   - Nombre: `Test User`
   - Email: `test@test.com`
   - Contraseña: `test123456`
4. Haz clic en **"Registrarse"**

**✅ Debería:** Crear el usuario y redirigir al inicio

### 6.2 Iniciar sesión

1. Haz clic en **"Iniciar Sesión"**
2. Email: `test@test.com`
3. Contraseña: `test123456`
4. Haz clic en **"Iniciar Sesión"**

**✅ Debería:** Iniciar sesión y mostrar tu nombre en la barra superior

### 6.3 Ver recetas

1. Haz clic en **"Recetas"** en el menú
2. **✅ Debería:** Mostrar 380 recetas
3. Puedes filtrar por categoría

### 6.4 Ver ejercicios

1. Haz clic en **"Ejercicios"** en el menú
2. **✅ Debería:** Mostrar 199 ejercicios con GIFs animados
3. Puedes filtrar por grupo muscular y dificultad

### 6.5 Añadir al plan semanal

1. En **"Recetas"** o **"Ejercicios"**
2. Haz clic en el botón **"+ Añadir al Plan"**
3. Selecciona un día de la semana
4. Haz clic en **"Añadir"**

**✅ Debería:** Añadirse sin errores

### 6.6 Ver perfil

1. Haz clic en tu **nombre** (arriba a la derecha)
2. **✅ Debería:** Mostrar tu información de perfil
3. Puedes editar: nombre, edad, género
4. Puedes cambiar la contraseña

### 6.7 Lista de compras

1. Haz clic en **"Lista de Compras"**
2. Añade un ingrediente manualmente
3. Marca como comprado
4. **✅ Debería:** Funcionar sin errores

### 6.8 Progreso

1. Haz clic en **"Progreso"**
2. Añade una entrada de peso
3. **✅ Debería:** Guardar y mostrar en la gráfica

---

## ❌ Solución de Problemas Comunes

### Problema 1: "Failed to fetch" o "ERR_CONNECTION_REFUSED"

**Causa:** Apache no está corriendo o la URL es incorrecta

**Solución:**
1. Abre XAMPP Control Panel
2. Verifica que Apache tenga fondo VERDE y diga "Running"
3. Si no, haz clic en "Start"
4. Verifica la URL del backend: `http://localhost/fittrackapp/backend/api/test.php`

### Problema 2: Error CORS

**Causa:** Headers CORS no están configurados

**Solución:**
1. Verifica que `backend/api/cors-handler.php` exista
2. Reinicia Apache (Stop → Start)
3. Limpia caché del navegador (Ctrl + Shift + Delete)

### Problema 3: Base de datos no conecta

**Causa:** Puerto incorrecto o base de datos no existe

**Solución:**
1. Verifica en XAMPP que MySQL esté corriendo
2. Abre phpMyAdmin: `http://localhost/phpmyadmin`
3. Verifica que exista la base de datos "fittrack"
4. Si no existe, importa: `backend/database/setup_xampp.sql`
5. Verifica el puerto en `backend/config/database.php`

### Problema 4: Vite no inicia (npm run dev)

**Causa:** Dependencias no instaladas

**Solución:**
```bash
cd C:\xampp2\htdocs\fittrackapp\frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problema 5: Página en blanco en localhost:5173

**Causa:** Vite no está corriendo o basename incorrecto

**Solución:**
1. Verifica que `npm run dev` esté corriendo (no cierres la terminal)
2. Verifica que `frontend/src/App.jsx` tenga: `basename="/"`
3. Recarga con Ctrl + Shift + R

### Problema 6: No se pueden añadir recetas/ejercicios al plan

**Causa:** Usuario no está autenticado o endpoint no funciona

**Solución:**
1. Verifica que hayas iniciado sesión
2. Abre consola del navegador (F12)
3. Mira si hay errores
4. Prueba el endpoint: `http://localhost/fittrackapp/backend/api/weekly-plan.php?user_id=1`

---

## 📊 Checklist de Verificación Final

Marca cada elemento cuando lo verifiques:

**Backend:**
- [ ] Apache corriendo en XAMPP (fondo verde)
- [ ] MySQL corriendo en XAMPP (fondo verde)
- [ ] Base de datos "fittrack" existe en phpMyAdmin
- [ ] Todas las tablas creadas (7 tablas)
- [ ] `http://localhost/fittrackapp/backend/api/test.php` devuelve JSON success
- [ ] `http://localhost/fittrackapp/backend/verificacion-completa.html` → todas las pruebas en verde

**Frontend:**
- [ ] `npm install` completado sin errores
- [ ] `npm run dev` corriendo (terminal abierta)
- [ ] `http://localhost:5173` abre la aplicación
- [ ] No hay errores en consola del navegador (F12)

**Funcionalidades:**
- [ ] Puedo registrar un usuario nuevo
- [ ] Puedo iniciar sesión
- [ ] Veo mi nombre en la barra superior
- [ ] Puedo ver las 380 recetas
- [ ] Puedo ver los 199 ejercicios
- [ ] Puedo añadir recetas al plan semanal
- [ ] Puedo añadir ejercicios al plan semanal
- [ ] Puedo ver mi perfil (clic en mi nombre)
- [ ] Puedo editar mi perfil
- [ ] Puedo cambiar mi contraseña
- [ ] Puedo usar la lista de compras
- [ ] Puedo registrar mi progreso

---

## 🆘 Ayuda Adicional

Si después de seguir esta guía algo no funciona:

1. **Abre la herramienta de diagnóstico:**
   ```
   http://localhost/fittrackapp/backend/verificacion-completa.html
   ```

2. **Captura de pantalla de:**
   - XAMPP Control Panel (para ver estado de Apache y MySQL)
   - Resultados de verificación completa
   - Consola del navegador (F12 → Console)

3. **Revisa los logs:**
   - Apache error log: `C:\xampp2\apache\logs\error.log`
   - PHP errors: En la consola del navegador (F12)

---

## 🎉 ¡Listo!

Si todos los checkmarks están marcados, **FitTrack está completamente configurado y funcionando**.

**URLs importantes:**

- **Frontend:** http://localhost:5173
- **Test Backend:** http://localhost/fittrackapp/backend/api/test.php
- **Verificación:** http://localhost/fittrackapp/backend/verificacion-completa.html
- **phpMyAdmin:** http://localhost/phpmyadmin

**Comandos importantes:**

```bash
# Iniciar frontend
cd C:\xampp2\htdocs\fittrackapp\frontend
npm run dev

# Actualizar código
cd C:\xampp2\htdocs\fittrackapp
git pull origin claude/auto-plan-generation-exercise-editing-011CUhZFnRhVZcixUvjXgQn9

# Reinstalar dependencias
cd frontend
npm install
```

¡Disfruta de FitTrack! 💪🥗
