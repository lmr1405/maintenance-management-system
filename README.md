# Maintenance Management System

## 1. Descripción del proyecto

**Maintenance Management System** es una aplicación web para la gestión del mantenimiento correctivo de máquinas en entornos industriales.

Su objetivo es facilitar el registro, seguimiento y resolución de incidencias de mantenimiento, centralizando la información de máquinas, personal técnico, averías e intervenciones.

La aplicación permite:

- **Gestión de máquinas:** registrar, consultar, actualizar y dar de baja máquinas industriales.
- **Gestión de personas:** registrar y administrar operarios, técnicos de mantenimiento y responsables.
- **Gestión de averías:** registrar incidencias, asignar técnicos, iniciar reparaciones, resolver averías y validar su cierre.
- **Imputación de horas:** registrar las horas de trabajo de los técnicos y consultar los totales por avería, máquina y técnico.
- **Historial de mantenimiento:** consultar las averías registradas, las reparaciones realizadas y las horas de trabajo imputadas.
- **Dashboard operativo:** consultar indicadores de mantenimiento, intervenciones prioritarias, máquinas paradas y gráficos de seguimiento.
- **Autenticación:** controlar el acceso a la aplicación mediante inicio y cierre de sesión.

El sistema está orientado exclusivamente al **mantenimiento correctivo**, permitiendo gestionar el ciclo de vida de una avería desde su detección hasta su cierre definitivo.

---

## 2. Tecnologías utilizadas

El proyecto está desarrollado mediante una arquitectura que separa el frontend, el backend y la persistencia de datos.

| Área | Tecnologías | Descripción |
|---|---|---|
| Backend | Python, FastAPI, SQLAlchemy | API REST, lógica de negocio y acceso a datos. |
| Frontend | React, TypeScript, Vite | Aplicación web e interfaz de usuario. |
| Base de datos | PostgreSQL, Supabase | Almacenamiento de la información del mantenimiento. |
| Autenticación | Supabase Auth | Gestión de sesiones y autenticación de usuarios. |
| Control de versiones | Git, GitHub | Versionado del código y repositorio del proyecto. |
| Pruebas | Pytest, GitHub Actions | Pruebas automatizadas y comprobación de cambios. |

Para conocer con mayor detalle las tecnologías, dependencias, organización y funcionamiento de cada parte del sistema, consultar su documentación específica:

- [Documentación del backend](backend/README.md)
- [Documentación del frontend](frontend/README.md)

---

## 3. Arquitectura del proyecto

El sistema sigue una **arquitectura por capas**, separando las responsabilidades de la interfaz de usuario, la lógica de negocio y el acceso a los datos.

Esta organización permite:

- Mantener el código estructurado y organizado.
- Facilitar la incorporación de nuevas funcionalidades.
- Modificar una capa sin afectar innecesariamente a las demás.
- Reutilizar componentes y servicios.
- Facilitar las pruebas automatizadas.
- Mejorar la mantenibilidad y escalabilidad del proyecto.

### Estructura general

```text
maintenance-management-system/
│
├── backend/
│   ├── app/
│   │   ├── api/               # Endpoints FastAPI
│   │   ├── nucleo/            # Entidades y reglas de negocio
│   │   └── persistencia/      # Repositorios y modelos ORM
│   │
│   ├── alembic/               # Migraciones de base de datos
│   ├── tests/                 # Pruebas automatizadas
│   ├── requirements.txt       # Dependencias de Python
│   └── README.md              # Documentación del backend
│
├── frontend/
│   ├── src/
│   │   ├── api/               # Comunicación con FastAPI y Supabase
│   │   ├── components/        # Componentes reutilizables
│   │   ├── hooks/             # Lógica y cálculos reutilizables
│   │   ├── layouts/           # Estructura de la aplicación
│   │   ├── pages/             # Páginas de la aplicación
│   │   ├── styles/            # Estilos CSS
│   │   └── types/             # Interfaces TypeScript
│   │
│   ├── package.json           # Dependencias y scripts
│   └── README.md              # Documentación del frontend
│
├── .github/
│   └── workflows/             # Integración continua
│
└── README.md                  # Documentación principal
```

### Funcionamiento general

```text
             USUARIO
                |
                ▼
      FRONTEND (React + TS)
                |
                | Peticiones HTTP
                ▼
       BACKEND (FastAPI)
                |
                ▼
       SERVICIOS DEL NÚCLEO
                |
                ▼
       REPOSITORIOS (ORM)
                |
                ▼
       POSTGRESQL (Supabase)
```

El frontend presenta la información y permite interactuar con la aplicación.

El backend recibe las peticiones HTTP, ejecuta las reglas de negocio y realiza las operaciones correspondientes sobre la base de datos.

La persistencia se realiza mediante SQLAlchemy, mientras que Alembic permite mantener actualizada la estructura de PostgreSQL.

La autenticación de usuarios se gestiona mediante Supabase Auth.

---
## 4. Instalación y configuración

_En este apartado se explica cómo descargar, configurar y ejecutar el sistema completo en un entorno local._


### 4.1. Requisitos previos

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

### 4.2. Descargar el repositorio

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

### 4.4. Configurar Supabase

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


### 4.5. Crear las tablas de la base de datos

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

### 4.6. Configurar el frontend

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

### 4.7. Configurar la autenticación

La aplicación utiliza Supabase Auth para permitir el inicio de sesión mediante correo electrónico y contraseña.

En el panel de Supabase, acceder a la configuración de autenticación y comprobar que está habilitado el proveedor de correo electrónico.

Para realizar las primeras pruebas, es necesario disponer de un usuario autorizado.

El usuario puede crearse desde las herramientas de administración de autenticación de Supabase, utilizando una contraseña segura.

**Importante:** los usuarios de Supabase Auth son independientes de las personas registradas en la base de datos de mantenimiento.

Las personas del sistema representan operarios, técnicos y responsables, mientras que Supabase Auth gestiona las credenciales utilizadas para acceder a la aplicación.

### 4.8. Ejecutar la aplicación

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

### 4.9. Acceder a la aplicación web

Con ambos servidores en ejecución, abrir el navegador y acceder a:

```text
http://localhost:5173
```

La aplicación mostrará la pantalla de autenticación.

Introducir las credenciales del usuario configurado en Supabase Auth.

Una vez iniciada la sesión, se podrá acceder al dashboard y a las distintas secciones de gestión del mantenimiento.


## 5. Supuestos y decisiones de diseño

Durante el desarrollo de Maintenance Management System se han establecido una serie de supuestos y decisiones de diseño para definir el comportamiento de la aplicación, simplificar el modelo de datos y facilitar su mantenimiento y ampliación.

### 5.1. Correo electrónico y teléfono como atributos

El correo electrónico y el teléfono se han definido como atributos de la entidad `Persona`, en lugar de crear entidades independientes.

Esta decisión se debe a que el sistema únicamente necesita almacenar información básica de contacto de cada persona, sin gestionar múltiples direcciones de correo electrónico o números de teléfono.

De esta manera, se simplifica el modelo de datos y se evitan relaciones innecesarias.

### 5.2. Baja definitiva de máquinas

Se considera que una máquina se da de baja cuando deja de formar parte del conjunto de equipos disponibles para el mantenimiento, ya sea porque ha quedado fuera de uso, se ha vendido, donado o destinado al desguace.

La baja de una máquina se considera **definitiva**, por lo que no puede volver al estado Operativa.

Sin embargo, su información permanece almacenada para conservar el historial de averías, reparaciones e intervenciones realizadas durante su vida útil.

### 5.3. Separación entre usuarios autenticados y personas

Se ha decidido separar los usuarios que acceden a la aplicación de las personas registradas en el sistema de mantenimiento.

**Usuarios autenticados:** son las cuentas gestionadas mediante Supabase Auth, que utilizan correo electrónico y contraseña para acceder a la aplicación web.

**Personas:** representan a los operarios, técnicos de mantenimiento y responsables que participan en las operaciones de mantenimiento.

Ambos conceptos son independientes. Una persona puede estar registrada en el sistema sin disponer de una cuenta para acceder a la aplicación.

Esta separación permite gestionar las credenciales de acceso de forma independiente de la información profesional del personal.

### 5.4. Pantalla de inicio de sesión

La aplicación dispone de una pantalla inicial de autenticación que solicita al usuario su correo electrónico y contraseña.

Se ha utilizado Supabase Auth para gestionar las credenciales y las sesiones, evitando implementar un sistema propio de almacenamiento de contraseñas.

Las páginas principales de la aplicación están protegidas y requieren una sesión activa para acceder a ellas.

### 5.5. Arquitectura por capas

El proyecto sigue una arquitectura por capas que separa la interfaz de usuario, la API REST, la lógica de negocio y la persistencia de datos.

Esta decisión permite:

- Mejorar la legibilidad y organización del código.
- Separar las responsabilidades de cada módulo.
- Facilitar las pruebas automatizadas.
- Reducir el acoplamiento entre componentes.
- Simplificar el mantenimiento y la corrección de errores.
- Facilitar futuras ampliaciones y favorecer la escalabilidad.

En particular, el núcleo del backend contiene las reglas de negocio sin depender directamente de FastAPI ni de SQLAlchemy.

### 5.6. Conservación del historial de trabajadores

Cuando una persona deja de trabajar en la empresa o deja de participar en las tareas de mantenimiento, sus datos no se eliminan del sistema.

En su lugar, se modifica su estado a **De baja**, conservando su información y las relaciones con las averías e imputaciones de horas realizadas anteriormente.

Esta decisión permite mantener la trazabilidad histórica de las intervenciones y conocer qué técnicos participaron en cada reparación, aunque posteriormente hayan causado baja.

### 5.7. Reactivación de personas

A diferencia de las máquinas, la baja de una persona no tiene por qué ser definitiva.

Se contempla la posibilidad de que una persona deje de estar activa temporalmente por motivos como una excedencia, una ausencia prolongada o cualquier otra circunstancia laboral.

Por este motivo, el modelo de datos permite representar tanto el estado Activo como De baja y contempla la posibilidad de reactivar a una persona cuando vuelva a incorporarse.

De esta manera, se conserva su identidad y su historial sin necesidad de crear un nuevo registro.

### 5.8. Consultas e informes de mantenimiento

La aplicación contempla la consulta de información sobre máquinas, averías, técnicos e intervenciones realizadas.

Se ha incorporado un dashboard operativo que permite visualizar indicadores como máquinas paradas, averías pendientes, reparaciones en curso y disponibilidad de técnicos.

También se pueden consultar las horas acumuladas por avería, máquina y técnico.

Esta funcionalidad tiene como objetivo facilitar el seguimiento del mantenimiento, identificar incidencias pendientes y proporcionar información de apoyo a la toma de decisiones.

## 6. Justificación del stack tecnológico

**Python:** se ha elegido como lenguaje de programación del backend porque es un requisito establecido por Téciman Digital, al ser el lenguaje utilizado habitualmente en sus proyectos. Además, es un lenguaje ampliamente utilizado, con una comunidad extensa y numerosas bibliotecas y herramientas. Durante mi formación académica he trabajado y desarrollado distintos proyectos con Python, por lo que estoy familiarizado con él y me siento cómodo utilizándolo.

**React y TypeScript:** se han elegido para desarrollar el frontend por su facilidad de integración con APIs REST y la posibilidad de crear interfaces dinámicas mediante componentes reutilizables. React permite organizar la interfaz de manera modular, mientras que TypeScript incorpora tipado estático, facilitando la detección de errores y el mantenimiento del código.

**PostgreSQL y Supabase:** se ha elegido PostgreSQL como sistema gestor de bases de datos porque fue el primero con el que trabajé durante mi formación académica. Aunque estoy familiarizado con otros gestores, he optado por PostgreSQL por mi experiencia previa y su buen rendimiento. Para alojar la base de datos he utilizado Supabase, ya que facilita su configuración y gestión, permite disponer de una base de datos en la nube y ofrece herramientas adicionales como la autenticación de usuarios.

## 7. Mejoras futuras

Aunque la aplicación cumple con las funcionalidades principales de gestión del mantenimiento correctivo, con más tiempo de desarrollo se podrían incorporar las siguientes mejoras:

### 1. Autenticación por roles y dashboards personalizados

Actualmente, la autenticación permite acceder a la aplicación mediante una cuenta de usuario, pero no existe una relación directa entre el usuario autenticado y las personas registradas en el sistema.

Como mejora, implementaría un sistema de **autenticación y autorización basado en roles**, donde cada operario, técnico de mantenimiento o responsable acceda con sus propias credenciales.

En función del rol, el usuario tendría acceso únicamente a las funcionalidades y operaciones que le correspondan:

- **Operario:** registrar nuevas averías y consultar las incidencias notificadas.
- **Técnico de mantenimiento:** consultar las averías asignadas, gestionar las reparaciones e imputar las horas trabajadas.
- **Responsable:** supervisar las intervenciones, asignar técnicos, validar el cierre de averías y consultar los indicadores generales.

Además, cada rol dispondría de un **dashboard personalizado**, mostrando únicamente la información y las tareas relevantes para su trabajo.

Esta mejora permitiría optimizar la gestión de las averías, reforzar el control de acceso y mejorar la trazabilidad de las operaciones realizadas por cada usuario.

### 2. Notificaciones automáticas

Incorporar un sistema de notificaciones que informe a los usuarios sobre acontecimientos importantes del proceso de mantenimiento.

Por ejemplo, enviar avisos a los técnicos cuando reciban una nueva avería asignada o notificar a los responsables cuando existan reparaciones pendientes de validación.

Esto permitiría reducir los tiempos de respuesta y mejorar la coordinación del personal de mantenimiento.

### 3. Gestión de repuestos e inventario

Desarrollar un módulo de inventario para gestionar los repuestos y materiales utilizados durante las reparaciones.

Este módulo permitiría controlar las existencias, registrar los materiales consumidos y calcular los costes asociados a cada intervención, incluyendo tanto las horas de trabajo como los repuestos utilizados.

De esta manera, se podría obtener una visión más completa del coste de mantenimiento de cada máquina.

### 4. Ampliación de pruebas automatizadas

Ampliar la cobertura de pruebas para mejorar la fiabilidad y calidad del sistema.

Además de las pruebas unitarias existentes, incorporaría:

- **Pruebas de integración:** verificar la comunicación entre los servicios, los repositorios, la API REST y la base de datos.
- **Pruebas de extremo a extremo (E2E):** comprobar el funcionamiento completo de los procesos desde la interfaz web hasta el backend.
- **Pruebas de aceptación:** validar que la aplicación cumple los requisitos funcionales establecidos y responde correctamente a los escenarios de uso previstos.

Estas mejoras permitirían detectar errores antes de incorporar nuevas funcionalidades y facilitarían el mantenimiento y la evolución del proyecto.

## 8. Documentación adicional

El repositorio dispone de documentación específica para cada parte de la aplicación.

| Documento | Contenido |
|---|---|
| [Backend](backend/README.md) | Arquitectura por capas, entidades, servicios, repositorios, API REST, migraciones y pruebas. |
| [Frontend](frontend/README.md) | Tecnologías, componentes, páginas, diseño, dashboard y autenticación. |

---

## 9. Autor

**Luis Menéndez**

Proyecto de desarrollo de una aplicación web para la gestión del mantenimiento correctivo en entornos industriales.