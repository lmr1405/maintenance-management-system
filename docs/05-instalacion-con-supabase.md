# Instalación y configuración manual con Supabase
_En este apartado se explica cómo descargar, configurar y ejecutar el sistema completo en un entorno local._


### 5.1. Requisitos previos

Antes de instalar el proyecto es necesario disponer de las siguientes herramientas:

| Herramienta | Finalidad |
|---|---|
| Git | Descargar y gestionar el repositorio. |
| Python | Ejecutar el backend FastAPI. |
| Node.js | Ejecutar las herramientas del frontend. |
| npm | Instalar las dependencias de React. |
| Visual Studio Code | Editor recomendado para trabajar con el proyecto. |
| Supabase | Proporcionar la base de datos PostgreSQL y la autenticación. |

Se recomienda utilizar una versión estable y compatible de Python 3 y una versión LTS de Node.js.

#### Instalación de las herramientas

Los instaladores y las instrucciones oficiales se encuentran en:

- Git: https://git-scm.com/downloads
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/
- Visual Studio Code: https://code.visualstudio.com/
- Supabase: https://supabase.com/

En Windows, durante la instalación de Python, es importante habilitar su incorporación al `PATH` cuando el instalador ofrezca esa opción.

#### Comprobar la instalación

Abrir una terminal y ejecutar:

```bash
git --version
```

```bash
python --version
```

```bash
node --version
```

```bash
npm --version
```

En algunos sistemas Linux o macOS, Python se ejecuta mediante `python3`:

```bash
python3 --version
```

Si los comandos muestran sus respectivas versiones, las herramientas están disponibles.

### 5.2. Descargar el repositorio

Abrir una terminal en la carpeta donde se quiera almacenar el proyecto.

Ejecutar:

```bash
git clone https://github.com/lmr1405/maintenance-management-system.git
```

Este comando descarga el proyecto completo, incluyendo el backend, frontend y documentación.

Acceder a la carpeta descargada:

```bash
cd maintenance-management-system
```

Opcionalmente, abrir el proyecto en Visual Studio Code:

```bash
code .
```

Si el comando `code` no está disponible, el proyecto puede abrirse desde el menú **Archivo → Abrir carpeta** de Visual Studio Code.

### 4.3. Configurar el backend

El backend utiliza Python, FastAPI y SQLAlchemy para gestionar las operaciones de mantenimiento y comunicarse con PostgreSQL.

#### Paso 1. Acceder a la carpeta del backend

Desde la raíz del proyecto:

```bash
cd backend
```

#### Paso 2. Crear el entorno virtual de Python

El entorno virtual permite instalar las dependencias del backend sin modificar las bibliotecas de otros proyectos.

**Windows (PowerShell):**

```powershell
python -m venv .venv
```

**Linux y macOS:**

```bash
python3 -m venv .venv
```

Esto crea una carpeta `.venv/` dentro de `backend/`.

El entorno virtual es local y por lo tanto no se encuentra en el repositorio Git descargado.

#### Paso 3. Activar el entorno virtual

**Windows (PowerShell):**

```powershell
.\.venv\Scripts\Activate.ps1
```

Si PowerShell impide ejecutar el script por su política de ejecución, puede habilitarse únicamente para la sesión actual:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

A continuación, repetir la activación.

**Linux y macOS:**

```bash
source .venv/bin/activate
```

Cuando el entorno está activado, normalmente aparece `(.venv)` al comienzo de la línea de la terminal.

#### Paso 4. Instalar las dependencias del backend

Con el entorno virtual activado, ejecutar:

```bash
python -m pip install -r requirements.txt
```

Este comando instala las dependencias registradas en el archivo `requirements.txt`, incluyendo FastAPI, Uvicorn, SQLAlchemy, Alembic, Psycopg, Pydantic y Pytest.

Si se utiliza un entorno nuevo, es recomendable actualizar previamente pip:

```bash
python -m pip install --upgrade pip
```

Las dependencias solamente necesitan instalarse al crear el entorno virtual o cuando cambie el archivo `requirements.txt`.

### 5.4. Configurar Supabase

El proyecto utiliza Supabase para disponer de una base de datos PostgreSQL y gestionar la autenticación de usuarios.

#### Paso 1. Crear un proyecto

Acceder a:

https://supabase.com/dashboard

Crear una cuenta si no estamos registrado  
Iniciar sesión y crear un proyecto nuevo si todavía no se dispone de uno.

Durante la creación se debe configurar una contraseña segura para la base de datos y seleccionar una región adecuada.

Conservar las credenciales en un lugar seguro.

#### Paso 2. Obtener la conexión PostgreSQL

Dentro del proyecto Supabase, localizar la información de conexión a PostgreSQL.

La aplicación utiliza SQLAlchemy y el controlador Psycopg 3.

La cadena de conexión debe utilizar el dialecto y controlador adecuados:

```env
DATABASE_URL=postgresql+psycopg://USUARIO:CONTRASENA@SERVIDOR:PUERTO/BASE_DE_DATOS
```

Los valores mostrados son ejemplos. Deben sustituirse por los proporcionados por Supabase.

La conexión puede requerir parámetros adicionales, como SSL, según el tipo de conexión elegido.

#### Paso 3. Crear el archivo de configuración del backend

Dentro de `backend/`, crear un archivo:

```text
.env
```

Introducir la variable de conexión:

```env
DATABASE_URL=postgresql+psycopg://USUARIO:CONTRASENA@SERVIDOR:PUERTO/BASE_DE_DATOS
```

_El archivo `.env` contiene credenciales y **por lo tanto no esta en GitHub**._


### 5.5. Crear las tablas de la base de datos

El proyecto utiliza Alembic para generar y actualizar la estructura de PostgreSQL mediante migraciones.

No es necesario crear manualmente las tablas desde Supabase.

Con el entorno virtual del backend activado, situado dentro de `backend/` y con la variable `DATABASE_URL` correctamente configurada, ejecutar:

```bash
python -m alembic upgrade head
```

Este comando aplica las migraciones pendientes hasta la última versión del esquema.

Se crearán las tablas de máquinas, personas, averías e imputaciones, junto con sus relaciones y restricciones.

Para comprobar la versión aplicada:

```bash
python -m alembic current
```

La base de datos debe encontrarse disponible antes de iniciar la aplicación.

Para obtener información sobre cómo realizar futuras modificaciones del esquema, consultar el apartado de migraciones del [README del backend](backend/README.md).

### 5.6. Configurar el frontend

El frontend utiliza React y TypeScript para presentar la interfaz y comunicarse con FastAPI y Supabase Auth.

#### Paso 1. Acceder a la carpeta del frontend

Desde `backend/`, volver a la raíz del proyecto:

```bash
cd ..
```

Después acceder a:

```bash
cd frontend
```

#### Paso 2. Instalar las dependencias

Ejecutar:

```bash
npm install
```

Este comando instala las dependencias definidas en `package.json`.

Entre ellas se encuentran React, React Router, Recharts, TypeScript, Vite y el cliente de Supabase.

Las dependencias se almacenan en `node_modules/`, carpeta que no debe incorporarse al repositorio.

#### Paso 3. Obtener los datos de conexión de Supabase

Desde el panel del proyecto Supabase, localizar:

- URL del proyecto.
- Clave pública o *publishable key*.

Estas credenciales son utilizadas por el frontend para inicializar Supabase Auth.

#### Paso 4. Crear el archivo de variables de entorno

Dentro de `frontend/`, crear:

```text
.env.local
```

Añadir:

```env
VITE_API_URL=http://127.0.0.1:8000

VITE_SUPABASE_URL=URL_DEL_PROYECTO_SUPABASE

VITE_SUPABASE_PUBLISHABLE_KEY=CLAVE_PUBLICA_SUPABASE
```

Sustituir los valores de Supabase por los correspondientes al proyecto.

Las variables cumplen las siguientes funciones:

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | Dirección del servidor FastAPI. |
| `VITE_SUPABASE_URL` | Dirección del proyecto Supabase. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública de Supabase utilizada para la autenticación. |

_El archivo `.env.local` tampoco se encuentra en el repositorio descargado._

Las variables que comienzan con `VITE_` son accesibles desde el código del navegador, por lo que no deben contener secretos privados.

### 5.7. Configurar la autenticación

La aplicación utiliza Supabase Auth para permitir el inicio de sesión mediante correo electrónico y contraseña.

En el panel de Supabase, acceder a la configuración de autenticación y comprobar que está habilitado el proveedor de correo electrónico.

Para realizar las primeras pruebas, es necesario disponer de un usuario autorizado.

El usuario puede crearse desde las herramientas de administración de autenticación de Supabase, utilizando una contraseña segura.

**Importante:** los usuarios de Supabase Auth son independientes de las personas registradas en la base de datos de mantenimiento.

Las personas del sistema representan operarios, técnicos y responsables, mientras que Supabase Auth gestiona las credenciales utilizadas para acceder a la aplicación.

### 5.8. Ejecutar la aplicación

Una vez configurados el backend, frontend y Supabase, se pueden iniciar los servidores de desarrollo.

Se utilizarán **dos terminales**, una para FastAPI y otra para React.

#### Terminal 1. Iniciar el backend

**Windows (PowerShell):**

Desde la raíz del repositorio:

```powershell
cd backend
```

Activar el entorno virtual:

```powershell
.\.venv\Scripts\Activate.ps1
```

Iniciar FastAPI:

```powershell
python -m uvicorn app.main:app --reload
```

**Linux y macOS:**

```bash
cd backend
```

```bash
source .venv/bin/activate
```

```bash
python -m uvicorn app.main:app --reload
```

El servidor utilizará normalmente:

```text
http://127.0.0.1:8000
```

Para comprobar que funciona, abrir en el navegador:

```text
http://127.0.0.1:8000/docs
```

Se mostrará Swagger UI con los endpoints de la API REST.

#### Terminal 2. Iniciar el frontend

Abrir una nueva terminal en la raíz del repositorio.

**Windows, Linux y macOS:**

```bash
cd frontend
```

Ejecutar:

```bash
npm run dev
```

Vite iniciará el servidor de desarrollo.

Por defecto, la aplicación suele estar disponible en:

```text
http://localhost:5173
```

Si Vite selecciona otro puerto, utilizar la dirección indicada en la terminal.

### 5.9. Acceder a la aplicación web

Con ambos servidores en ejecución, abrir el navegador y acceder a:

```text
http://localhost:5173
```

La aplicación mostrará la pantalla de autenticación.

Introducir las credenciales del usuario configurado en Supabase Auth.

Una vez iniciada la sesión, se podrá acceder al dashboard y a las distintas secciones de gestión del mantenimiento.