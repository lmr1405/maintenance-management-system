# 4. Arquitectura del software

## 4.1. Arquitectura del sistema

La aplicación seguirá una arquitectura por capas, separando la interfaz de usuario, la API REST, la lógica de negocio y el acceso a los datos.

### Capas de la aplicación

- **Frontend (React + TypeScript):** proporciona la interfaz web y permite a los usuarios interactuar con el sistema.

- **API REST (FastAPI):** recibe las peticiones del frontend, valida los datos de entrada y comunica las solicitudes al núcleo de la aplicación.

- **Núcleo (Python):** contiene las entidades, los servicios y las reglas de negocio, independientemente de la interfaz web y de la base de datos.

- **Persistencia (SQLAlchemy):** gestiona el acceso y almacenamiento de información mediante un ORM.

- **Base de datos (PostgreSQL):** almacena la información de forma persistente. Se utilizará Supabase como servicio de alojamiento.

## 4.2. Organización del proyecto

El proyecto estará dividido en dos aplicaciones principales: frontend y backend.

El backend se organizará en tres módulos:

- **API:** endpoints REST y validación de las peticiones HTTP.
- **Núcleo:** entidades, servicios, reglas de negocio y contratos de repositorio.
- **Persistencia:** implementación de los repositorios y acceso a PostgreSQL mediante SQLAlchemy.

El frontend se desarrollará con React y TypeScript, manteniendo una separación entre componentes, páginas y servicios de comunicación con la API.

Las pruebas automatizadas se organizarán en una carpeta independiente dentro del backend.