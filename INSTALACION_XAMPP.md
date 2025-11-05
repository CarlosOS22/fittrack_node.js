# 🖥️ Instalación en XAMPP - FitTrack App

## Requisitos Previos

- ✅ XAMPP instalado (Apache + MySQL + PHP)
- ✅ Node.js instalado (versión 16 o superior)
- ✅ Git instalado (opcional, pero recomendado)

---

## 📥 PASO 1: Descargar el Proyecto

### Opción A - Con Git (Recomendado)

```bash
# Abrir Git Bash o CMD y navegar a htdocs
cd C:\xampp\htdocs

# Clonar el repositorio
git clone https://github.com/CarlosOS22/FitTrack.git fittrackapp

# Entrar a la carpeta
cd fittrackapp

# Cambiar al branch con todos los cambios
git checkout claude/auto-plan-generation-exercise-editing-011CUhZFnRhVZcixUvjXgQn9
```

### Opción B - Descarga Manual

1. Descarga el ZIP desde: https://github.com/CarlosOS22/FitTrack
2. Extrae el contenido en: `C:\xampp\htdocs\`
3. Renombra la carpeta a: `fittrackapp`

---

## 🗄️ PASO 2: Configurar la Base de Datos

1. **Abrir XAMPP Control Panel**
   - Iniciar **Apache** ✅
   - Iniciar **MySQL** ✅

2. **Crear la Base de Datos**
   - Abrir navegador: http://localhost/phpmyadmin
   - Click en "Nueva" (crear base de datos)
   - Nombre: `fittrack`
   - Cotejamiento: `utf8mb4_general_ci`
   - Click "Crear"

3. **Importar Estructura** (si existe archivo SQL)
   - Seleccionar base de datos "fittrack"
   - Click "Importar"
   - Buscar: `C:\xampp\htdocs\fittrackapp\backend\database\fittrack.sql`
   - Click "Continuar"

---

## ⚛️ PASO 3: Configurar el Frontend

1. **Abrir Terminal/CMD**

```bash
cd C:\xampp\htdocs\fittrackapp\frontend
```

2. **Instalar Dependencias**

```bash
npm install
```

3. **Verificar Configuración**

El archivo `.env` ya está configurado correctamente:

```env
VITE_API_URL=http://localhost/fittrackapp/backend/api
```

4. **Iniciar Servidor de Desarrollo**

```bash
npm run dev
```

Deberías ver:
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🚀 PASO 4: Acceder a la Aplicación

### URLs Importantes

🌐 **Frontend (React):**  
http://localhost:5173

🔧 **Backend (PHP API):**  
http://localhost/fittrackapp/backend/api

📊 **Base de Datos:**  
http://localhost/phpmyadmin

---

## ✅ Verificación

### Checklist de Funcionamiento

- [ ] **XAMPP Apache**: Estado verde (corriendo)
- [ ] **XAMPP MySQL**: Estado verde (corriendo)  
- [ ] **Terminal npm**: Muestra "ready in XXms"
- [ ] **Navegador**: http://localhost:5173 carga la aplicación
- [ ] **Recetas**: Aparecen **380 recetas** en la sección de Recetas
- [ ] **Ejercicios**: Aparecen **199 ejercicios** con GIFs animados
- [ ] **Sin errores**: Consola del navegador (F12) sin errores rojos

---

## 📁 Estructura de Carpetas

```
C:\xampp\htdocs\fittrackapp\
│
├── backend\                  # Backend PHP
│   ├── api\                 # Endpoints de la API
│   ├── config\              # Configuración de BD
│   │   ├── database.php     # ✅ Configurado para XAMPP
│   │   └── cors.php         # Configuración CORS
│   └── database\            # Scripts SQL (opcional)
│
└── frontend\                # Frontend React + Vite
    ├── src\
    │   ├── data\
    │   │   ├── recipes.js   # ✅ 380 recetas
    │   │   └── exercises.js # ✅ 199 ejercicios
    │   ├── pages\
    │   ├── components\
    │   └── context\
    ├── .env                 # ✅ Configurado para fittrackapp
    ├── package.json
    └── vite.config.js
```

---

## 🔧 Solución de Problemas

### ❌ "npm no se reconoce como comando"

**Solución:** Instala Node.js desde https://nodejs.org/

### ❌ "Error: Cannot find module"

**Solución:** 
```bash
cd C:\xampp\htdocs\fittrackapp\frontend
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Las recetas no cargan / Solo aparecen 78 recetas"

**Solución:** Limpiar caché del navegador
- **Chrome/Edge**: Ctrl + Shift + Delete → Borrar caché
- **Hard Refresh**: Ctrl + Shift + R
- **O limpiar caché de Vite**:
```bash
cd C:\xampp\htdocs\fittrackapp\frontend
rm -rf node_modules/.vite dist
npm run dev
```

### ❌ "Error de conexión con la API"

**Solución:** Verificar que:
1. XAMPP Apache esté corriendo (verde)
2. El archivo `.env` tenga: `VITE_API_URL=http://localhost/fittrackapp/backend/api`
3. La carpeta se llame exactamente `fittrackapp` en htdocs

### ❌ "Error 404 en backend"

**Solución:** Verificar que la ruta sea correcta:
- URL correcta: `http://localhost/fittrackapp/backend/api/...`
- La carpeta debe estar en: `C:\xampp\htdocs\fittrackapp`

### ❌ "Database connection failed"

**Solución:**
1. Verificar que MySQL esté corriendo en XAMPP
2. Verificar que la base de datos `fittrack` exista en phpMyAdmin
3. Verificar `backend/config/database.php`:
   - host: `localhost`
   - port: `3307` ⚠️ Puerto personalizado
   - database: `fittrack`
   - username: `root`
   - password: `` (vacío)

**IMPORTANTE:** Si tu MySQL usa el puerto por defecto (3306), cambia el puerto en `backend/config/database.php`

---

## 🔄 Actualizar el Proyecto

Para obtener los últimos cambios del repositorio:

```bash
cd C:\xampp\htdocs\fittrackapp
git pull origin claude/auto-plan-generation-exercise-editing-011CUhZFnRhVZcixUvjXgQn9
cd frontend
npm install
npm run dev
```

---

## 📊 Contenido de la Aplicación

### Base de Datos Completa

- ✅ **380 Recetas** distribuidas en:
  - 55 Desayunos
  - 50 Almuerzos
  - 78 Comidas
  - 51 Meriendas
  - 77 Cenas
  - 69 Batidos

- ✅ **199 Ejercicios** con GIFs animados:
  - Todos los grupos musculares
  - Diferentes niveles de dificultad
  - Instrucciones detalladas

### Funcionalidades

- ✅ Sistema de perfil de usuario
- ✅ Cálculo automático de calorías
- ✅ Plan semanal de comidas y ejercicios
- ✅ Tracking de progreso
- ✅ Dashboard con estadísticas
- ✅ Filtros por categoría y dificultad

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que todos los requisitos estén instalados
2. Revisa la sección de "Solución de Problemas"
3. Asegúrate de que XAMPP Apache y MySQL estén corriendo
4. Verifica que la carpeta se llame exactamente `fittrackapp`

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, deberías tener:
- Frontend corriendo en: http://localhost:5173
- Backend API funcionando en: http://localhost/fittrackapp/backend/api
- Base de datos accesible en: http://localhost/phpmyadmin
- **380 recetas** y **199 ejercicios** disponibles

¡Disfruta de FitTrack App! 💪🥗
