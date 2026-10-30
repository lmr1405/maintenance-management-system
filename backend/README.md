# Backend — Sistema de Gestión de Incidencias de Mantenimiento

Backend de una aplicación web para gestionar máquinas industriales, averías, personal de mantenimiento e imputaciones de horas de trabajo. El proyecto se desarrolla en **Python** y utiliza una arquitectura por capas para separar las reglas de negocio del acceso a los datos y de la futura API HTTP.

## 1. Tecnologías

| Tecnología | Función |
|---|---|
| Python | Lenguaje del backend y de la lógica de negocio |
| FastAPI | Framework previsto para exponer la API REST y su documentación OpenAPI/Swagger |
| SQLAlchemy | Mapeo objeto-relacional (ORM), conexiones y sesiones con PostgreSQL |
| PostgreSQL | Base de datos relacional |
| Supabase | Servicio que aloja la base de datos PostgreSQL del proyecto |
| Alembic | Gestión versionada de cambios del esquema de la base de datos |
| Pytest | Ejecución de pruebas automatizadas |
| GitHub Actions | Integración continua: ejecución automatizada de comprobaciones y pruebas |
| `venv` | Aislamiento de dependencias de Python por proyecto |
| `python-dotenv` y `.env` | Carga local de variables de configuración y credenciales |

Las versiones exactas de las dependencias instaladas se registran en `requirements.txt`.

## 2. Arquitectura y responsabilidades

```text
Frontend (React + TypeScript)              
               |
API REST (FastAPI)                       
               |
Servicios / lógica de negocio
               |
Interfaces de repositorio (contratos)
               |
Repositorios (implementación SQLAlchemy)  
               |
Modelos ORM (SQLAlchemy)
               |
PostgreSQL (Supabase)
```

**Núcleo:** Contiene las entidades `Maquina`, `Persona`, `Averia` e `ImputacionHoras`, junto con las reglas de negocio. No debe conocer detalles de PostgreSQL, SQLAlchemy ni FastAPI.

**Interfaces de repositorio.** Definen las operaciones de acceso a datos que necesitan los servicios. Permiten que el núcleo dependa de abstracciones, no de implementaciones concretas.

**Repositorios.** Implementan las interfaces con SQLAlchemy, realizan consultas y transforman los objetos del dominio en modelos ORM y viceversa. Así, los modelos ORM no se filtran hacia la lógica de negocio.

**Persistencia.** Contiene los cuatro modelos ORM, la configuración de la conexión y la gestión de sesiones con PostgreSQL.

**API.** FastAPI será la capa de entrada para las peticiones HTTP: validará las solicitudes, invocará los servicios y devolverá respuestas. Las reglas de negocio no deben implementarse directamente en los endpoints.

### Decisiones de diseño

- **Separación de responsabilidades:** cada capa cumple una función concreta.
- **Inversión de dependencias:** el núcleo utiliza interfaces en lugar de depender de clases de SQLAlchemy.
- **Conversión dominio ↔ ORM:** se realiza en la capa de persistencia para conservar la independencia del dominio.
- **Sesiones inyectadas:** se recomienda que los repositorios reciban la sesión de SQLAlchemy en su constructor. Esto simplifica las pruebas y permite controlar los límites de las transacciones fuera de cada método.
- **Gestión explícita de sesiones:** una sesión no equivale a una conexión física; el `engine` gestiona el pool y las sesiones obtienen conexiones cuando las necesitan. Las sesiones deben cerrarse correctamente.

## 3. Modelo de datos

Las tablas creadas en PostgreSQL son:

| Tabla | Descripción |
|---|---|
| `maquinas` | Identificación, características, ubicación, criticidad y estado de las máquinas |
| `personas` | Datos del personal, rol, especialidad y coste horario |
| `averias` | Incidencias registradas: máquina afectada, informante, técnico asignado, prioridad, estado y resolución |
| `imputaciones_horas` | Horas de trabajo imputadas por los técnicos a una avería |

Relaciones principales:

- Una **avería** corresponde a una **máquina**.
- Una **avería** referencia a la persona que la reporta y, opcionalmente, a quien se asigna y a quien la valida.
- Una **imputación de horas** pertenece a una avería y a una persona identificada como técnico.

Las claves primarias, foráneas, restricciones y enumeraciones están definidas en los modelos ORM y se versionan mediante Alembic.

## 4. Requisitos previos

- Python y `pip` instalados.
- Acceso a una base de datos PostgreSQL (en este proyecto, Supabase).
- Git, para clonar el repositorio y gestionar versiones.

Ejecutar los siguientes comandos desde la **raíz del backend**, donde se encuentran `requirements.txt` y `alembic.ini`.

## 5. Instalación local

### 5.1. Crear el entorno virtual

Windows (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Linux / macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

El entorno virtual **aísla las dependencias** del proyecto frente a las instalaciones globales de Python. **No es, por sí mismo, una medida de protección de credenciales.**

### 5.2. Instalar dependencias

```bash
python -m pip install -r requirements.txt
```

Al añadir o actualizar dependencias, actualizar el fichero de requisitos desde el entorno virtual activo:

```bash
python -m pip freeze > requirements.txt
```

## 6. Configuración

La conexión a PostgreSQL se configura mediante la variable de entorno `DATABASE_URL`. En desarrollo, se carga desde un archivo `.env` utilizando `python-dotenv`.

Crear un archivo `.env` en la raíz del backend:

```dotenv
DATABASE_URL=postgresql+psycopg2://USUARIO:CONTRASENA@SERVIDOR:PUERTO/BASE_DE_DATOS
```

La cadena anterior es **un ejemplo con marcadores**, no una credencial válida. Debe adaptarse al formato y al controlador PostgreSQL realmente utilizados por el proyecto; si la contraseña contiene caracteres especiales, deben codificarse correctamente en la URL.


## 7. Conexión con PostgreSQL y sesiones

La configuración de persistencia lee `DATABASE_URL` desde el entorno y utiliza `create_engine()` de SQLAlchemy para crear el `engine` de acceso a PostgreSQL.

El `engine` administra el **pool de conexiones**, mientras que `sessionmaker` puede crear sesiones independientes para las distintas operaciones. Cada sesión debe gestionarse y cerrarse correctamente; las transacciones deben confirmarse (`commit`) o deshacerse (`rollback`) según corresponda.

Para facilitar las pruebas, los repositorios deben recibir una sesión desde el exterior en lugar de crear indiscriminadamente sus propias conexiones. Esto también favorece que varios cambios relacionados se gestionen dentro de una única transacción.

## 8. Migraciones de base de datos (Alembic)

Alembic mantiene un historial reproducible y versionado de los cambios en el esquema. La migración inicial del proyecto crea las cuatro tablas y sus relaciones en Supabase.

Desde la raíz del backend:

**Consultar la revisión aplicada:**

```bash
python -m alembic current
```

**Aplicar migraciones pendientes:**

```bash
python -m alembic upgrade head
```

**Generar una migración tras modificar modelos ORM:**

```bash
python -m alembic revision --autogenerate -m "descripcion del cambio"
```

**Revisar la migración generada antes de aplicarla.** La detección automática no sustituye la revisión humana: comprobar tipos, claves, restricciones y posibles pérdidas de datos.

Para crear una nueva base de datos a partir del esquema versionado, configurar primero su `DATABASE_URL` y después ejecutar `upgrade head`. No es necesario crear manualmente las tablas.

**Precaución:** no ejecutar migraciones destructivas ni `downgrade` contra una base de datos con información importante sin revisar los cambios y contar con una copia de seguridad.

## 9. Pruebas automatizadas (Pytest)

El proyecto incluye pruebas de reglas de negocio, entre ellas validaciones de imputaciones de horas. Desde el entorno virtual:

```bash
python -m pytest
```

Las pruebas de negocio deben poder ejecutarse sin depender de la base de datos real. Las futuras pruebas de repositorios pueden utilizar sesiones de una base de datos de prueba y datos controlados.

**No utilizar la base de datos de producción para pruebas que inserten, modifiquen o eliminen información.**

## 10. Integración continua (GitHub Actions)

El repositorio utiliza GitHub Actions para automatizar la ejecución de pruebas y detectar errores al integrar cambios.

El objetivo del flujo de integración continua es:

1. Preparar un entorno de ejecución de Python.
2. Instalar las dependencias especificadas en `requirements.txt`.
3. Ejecutar las pruebas con Pytest.
4. Informar del resultado de las comprobaciones en GitHub.

Los archivos de configuración de GitHub Actions se encuentran en `.github/workflows/`. El detalle de eventos activadores, versiones de Python y comandos concretos se define en el workflow real del repositorio.


## 11. API REST con FastAPI (pendiente)

La API permitirá gestionar recursos como máquinas, personas, averías e imputaciones de horas. Se prevé proporcionar operaciones de consulta, creación, actualización y, cuando tenga sentido, eliminación, además de las acciones propias del ciclo de vida de una avería.

Cuando se implemente y arranque la aplicación FastAPI, su documentación interactiva estará disponible habitualmente en:

- `/docs` — interfaz Swagger UI.
- `/openapi.json` — descripción OpenAPI.

> La ruta para iniciar el servidor y los endpoints definitivos se documentarán cuando exista la aplicación FastAPI. No se incluye aquí un comando de arranque ficticio.

## 12. Flujo funcional previsto

El primer recorrido completo que se quiere implementar es:

```text
Registrar máquina
      ↓
Registrar avería
      ↓
Asignar técnico
      ↓
Imputar horas
      ↓
Resolver y cerrar avería
      ↓
Consultar historial
```

Las reglas sobre transiciones de estado, roles, imputaciones válidas y cierre de averías deben implementarse en los servicios del núcleo, no en los repositorios ni exclusivamente en la interfaz web.

## 13. Estado y próximos pasos

**Realizado:**

- [x] Entidades del núcleo: Máquina, Persona, Avería e Imputación de Horas.
- [x] Cuatro modelos ORM con SQLAlchemy.
- [x] Conexión a PostgreSQL en Supabase.
- [x] Migración inicial con Alembic y creación de las tablas.
- [x] Interfaces para los cuatro repositorios.
- [x] Primeras reglas de validación de imputaciones y pruebas con Pytest.
- [x] Integración continua con GitHub Actions.

**Pendiente o en desarrollo:**

- [ ] Implementar los repositorios y sus conversiones dominio ↔ ORM.
- [ ] Completar servicios y reglas de negocio.
- [ ] Desarrollar los endpoints REST con FastAPI.
- [ ] Integrar el frontend React.
- [ ] Ampliar pruebas unitarias y de integración.
- [ ] Incorporar datos de ejemplo y validar el recorrido funcional completo.
- [ ] Completar despliegue e instrucciones operativas.
