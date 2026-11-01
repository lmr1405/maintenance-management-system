# Backend — Sistema de Gestión de Incidencias de Mantenimiento

Backend de una aplicación web para gestionar máquinas industriales, averías, personal de mantenimiento e imputaciones de horas de trabajo. El proyecto se desarrolla en **Python** y utiliza una arquitectura por capas para separar las reglas de negocio del acceso a los datos y de la futura API HTTP.

## 1. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| Python | Lenguaje utilizado para desarrollar el backend y la lógica de negocio. |
| FastAPI | Framework para desarrollar la API REST y generar documentación OpenAPI/Swagger. |
| Uvicorn | Servidor ASGI utilizado para ejecutar la aplicación FastAPI. |
| Pydantic | Validación y definición de los datos que recibe y devuelve la API. |
| SQLAlchemy | ORM para relacionar las entidades con las tablas de PostgreSQL y gestionar sesiones. |
| PostgreSQL | Base de datos relacional utilizada para almacenar la información. |
| Supabase | Plataforma donde se aloja la base de datos PostgreSQL. |
| Alembic | Gestión y versionado de las migraciones de la base de datos. |
| psycopg3 | Controlador para establecer la conexión entre Python y PostgreSQL. |
| Pytest | Desarrollo y ejecución de pruebas automatizadas. |
| GitHub Actions | Integración continua para ejecutar automáticamente las pruebas. |
| venv | Creación de un entorno virtual para aislar las dependencias de Python. |
| python-dotenv | Carga de variables de entorno desde el archivo `.env`. |

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


## 4. Configuración

La conexión a PostgreSQL se configura mediante la variable de entorno `DATABASE_URL`. En desarrollo, se carga desde un archivo `.env` utilizando `python-dotenv`.

Crear un archivo `.env` en la raíz del backend:

```dotenv
DATABASE_URL=postgresql+psycopg2://USUARIO:CONTRASENA@SERVIDOR:PUERTO/BASE_DE_DATOS
```

La cadena anterior es **un ejemplo con marcadores**, no una credencial válida. Debe adaptarse al formato y al controlador PostgreSQL realmente utilizados por el proyecto; si la contraseña contiene caracteres especiales, deben codificarse correctamente en la URL.


## 5. Conexión con PostgreSQL y sesiones

La configuración de persistencia lee `DATABASE_URL` desde el entorno y utiliza `create_engine()` de SQLAlchemy para crear el `engine` de acceso a PostgreSQL.

El `engine` administra el **pool de conexiones**, mientras que `sessionmaker` puede crear sesiones independientes para las distintas operaciones. Cada sesión debe gestionarse y cerrarse correctamente; las transacciones deben confirmarse (`commit`) o deshacerse (`rollback`) según corresponda.

Para facilitar las pruebas, los repositorios deben recibir una sesión desde el exterior en lugar de crear indiscriminadamente sus propias conexiones. Esto también favorece que varios cambios relacionados se gestionen dentro de una única transacción.

## 6. Migraciones de base de datos (Alembic)

El proyecto utiliza **Alembic** para gestionar y versionar los cambios realizados en la estructura de la base de datos PostgreSQL alojada en Supabase.

Las migraciones permiten modificar tablas, columnas, relaciones y restricciones sin tener que realizar los cambios manualmente desde el panel de Supabase.

Cada migración genera un archivo Python que registra las modificaciones necesarias para actualizar el esquema de la base de datos.

### 6.1. ¿Cuándo es necesario crear una migración?

Se debe generar una nueva migración cuando se modifica la estructura de la base de datos, por ejemplo:

- Añadir o eliminar una columna.
- Crear una tabla nueva.
- Modificar el tipo de dato de una columna.
- Añadir o modificar relaciones entre tablas.
- Modificar restricciones o valores de enumeraciones.

Los cambios en la lógica de negocio, servicios o endpoints que no afectan al esquema no necesitan una migración.

### 6.2. Procedimiento para actualizar la base de datos

Cuando se realiza un cambio en los modelos ORM de SQLAlchemy, se deben seguir estos pasos:

**Paso 1. Modificar los modelos ORM**

Realizar los cambios necesarios en los archivos de modelos SQLAlchemy, ubicados en la capa de persistencia.

Por ejemplo, añadir una nueva columna a una tabla existente.

**Paso 2. Generar una nueva migración**

Desde la carpeta `backend/`, con el entorno virtual activado y la configuración de conexión disponible, ejecutar:

```bash
python -m alembic revision --autogenerate -m "descripcion del cambio"
```

Alembic compara los modelos ORM con la estructura actual de PostgreSQL y genera un archivo de migración dentro de:

```text
backend/alembic/versions/
```

**Paso 3. Revisar la migración generada**

Abrir el archivo Python generado y comprobar que contiene las operaciones esperadas.

Las migraciones incluyen normalmente dos funciones:

- `upgrade()`: aplica las modificaciones a la base de datos.
- `downgrade()`: define cómo revertir las modificaciones, cuando sea posible.

La generación automática no garantiza que todos los cambios sean detectados correctamente, especialmente en modificaciones de nombres, tipos enumerados o conversiones de datos.

**Paso 4. Aplicar la migración**

Una vez revisado el archivo, ejecutar:

```bash
python -m alembic upgrade head
```

Este comando aplica las migraciones pendientes y actualiza la estructura de PostgreSQL hasta la última revisión disponible.

**Paso 5. Comprobar la versión aplicada**

Ejecutar:

```bash
python -m alembic current
```

Este comando permite comprobar qué revisión de Alembic está aplicada en la base de datos.

También puede consultarse el historial de migraciones mediante:

```bash
python -m alembic history
```

**Paso 6. Guardar la migración en GitHub**

Los archivos generados deben incluirse en el repositorio junto con las modificaciones de los modelos ORM.

De esta manera, los cambios del esquema quedan documentados y pueden reproducirse en otros entornos.

### 6.3. Consideraciones importantes

- No modificar ni eliminar migraciones que ya hayan sido aplicadas en entornos compartidos.
- Revisar siempre los archivos generados antes de ejecutar `upgrade`.
- Realizar copias de seguridad antes de aplicar cambios que puedan eliminar o transformar información.
- No modificar manualmente las tablas de Supabase sin mantener sincronizado el historial de Alembic.
- Los cambios en los modelos ORM no actualizan automáticamente la base de datos: es necesario generar y aplicar la migración.

### 6.4. Historial de migraciones

El proyecto dispone de las siguientes migraciones iniciales:

| Revisión | Descripción |
|---|---|
| `9bb81bf3fe7b` | Creación inicial de las tablas y sus relaciones. |
| `f0ec6ea50878` | Normalización de los nombres de enumeraciones utilizadas en averías. |

Las siguientes modificaciones del esquema deberán incorporarse mediante nuevas revisiones.

**Resumen del procedimiento:**

```text
Modificar modelos ORM
        ↓
Generar migración con Alembic
        ↓
Revisar el archivo generado
        ↓
Aplicar la migración
        ↓
Comprobar la versión actual
        ↓
Guardar cambios en GitHub
```

Este procedimiento permite mantener sincronizados los modelos de SQLAlchemy, la estructura de PostgreSQL y el historial de cambios del proyecto.

## 7. Pruebas automatizadas (Pytest)

El proyecto incluye pruebas de reglas de negocio, entre ellas validaciones de imputaciones de horas. Desde el entorno virtual:

```bash
python -m pytest
```

Las pruebas de negocio deben poder ejecutarse sin depender de la base de datos real. Las futuras pruebas de repositorios pueden utilizar sesiones de una base de datos de prueba y datos controlados.

**No utilizar la base de datos de producción para pruebas que inserten, modifiquen o eliminen información.**

## 8. Integración continua (GitHub Actions)

El repositorio utiliza GitHub Actions para automatizar la ejecución de pruebas y detectar errores al integrar cambios.

El objetivo del flujo de integración continua es:

1. Preparar un entorno de ejecución de Python.
2. Instalar las dependencias especificadas en `requirements.txt`.
3. Ejecutar las pruebas con Pytest.
4. Informar del resultado de las comprobaciones en GitHub.

Los archivos de configuración de GitHub Actions se encuentran en `.github/workflows/`. El detalle de eventos activadores, versiones de Python y comandos concretos se define en el workflow real del repositorio.


## 9. API REST con FastAPI

El backend utiliza **FastAPI** para exponer una API REST que permite al frontend consultar y gestionar los recursos del sistema de mantenimiento.

La API se organiza mediante routers que separan los endpoints de cada entidad.

| Recurso | Funcionalidades |
|---|---|
| Máquinas | Registrar, consultar, actualizar y dar de baja máquinas. |
| Personas | Registrar, consultar, actualizar y desactivar personas. |
| Averías | Registrar, consultar, asignar técnicos, iniciar reparaciones, resolver y cerrar averías. |
| Imputaciones | Registrar y consultar horas de trabajo, incluyendo los totales por avería, máquina y técnico. |

Los endpoints reciben las solicitudes HTTP, utilizan los servicios del núcleo para aplicar las reglas de negocio y devuelven las respuestas al frontend.

FastAPI genera automáticamente la documentación interactiva de la API mediante OpenAPI.

- `/docs`: interfaz Swagger UI para consultar y probar los endpoints.
- `/openapi.json`: especificación OpenAPI generada automáticamente.

La configuración y las instrucciones para iniciar el servidor se encuentran en el [README principal](../README.md).

## 10. Flujo funcional del mantenimiento

El sistema permite gestionar el ciclo de vida completo de una avería, desde su detección hasta su cierre definitivo, incluyendo el registro de horas de trabajo y la consulta de indicadores de mantenimiento.

Partiendo de máquinas y personas previamente registradas, el proceso es el siguiente:

```text
Máquinas y personas registradas
              |
              ▼
Un operario registra una avería
              |
              ▼
          ABIERTA
              |
              | Se asigna un técnico
              ▼
         ASIGNADA
              |
              | Se inicia la reparación
              ▼
         EN CURSO
              |
              | Se realizan los trabajos
              | y se imputan las horas
              ▼
         RESUELTA
              |
              | Un responsable valida el cierre
              ▼
          CERRADA
              |
              ▼
   HISTORIAL DE MANTENIMIENTO
```

### 10.1. Etapas del proceso

1. **Abierta:** un operario registra una avería, indicando la máquina afectada, los síntomas detectados, el tipo de fallo y la prioridad. La avería se crea automáticamente en estado Abierta.

2. **Asignada:** se asigna un técnico de mantenimiento encargado de realizar la reparación. La avería cambia al estado Asignada.

3. **En curso:** se inicia la reparación y la avería cambia al estado En curso. Durante esta etapa, los técnicos pueden registrar las horas dedicadas a los trabajos de mantenimiento y describir las intervenciones realizadas.

4. **Resuelta:** una vez finalizada la reparación, el técnico registra la causa raíz, la solución aplicada y, opcionalmente, los repuestos sustituidos, el tipo de solución y las recomendaciones preventivas. La avería cambia al estado Resuelta.

5. **Cerrada:** un responsable valida la intervención y realiza el cierre definitivo de la avería, quedando registrada la fecha de cierre y la persona responsable.

Las averías y las imputaciones realizadas permanecen registradas para su posterior consulta y seguimiento.

### 10.2. Reglas de negocio

Las transiciones entre estados están controladas por los servicios del núcleo del backend, que verifican las condiciones necesarias para realizar cada operación.

Entre las principales reglas se encuentran:

- Las averías se registran inicialmente en estado Abierta.
- Se debe asignar un técnico antes de iniciar una reparación.
- Una avería debe encontrarse En curso para poder resolverse.
- Se pueden registrar imputaciones de horas de varios técnicos en una misma avería.
- No se permite registrar horas en averías cerradas.
- Las averías resueltas requieren la validación de un responsable para su cierre.

Estas reglas se implementan en la lógica de negocio, manteniéndose separadas de los endpoints de FastAPI y de los repositorios de persistencia.

### 10.3. Consulta y seguimiento del mantenimiento

El sistema dispone de un **dashboard operativo** que permite consultar el estado general del mantenimiento y realizar un seguimiento de las intervenciones registradas.

El dashboard presenta los siguientes elementos:

**Indicadores operativos:**
- Máquinas paradas por averías activas.
- Averías pendientes de asignación.
- Reparaciones en curso.
- Averías resueltas pendientes de validación.

**Gestión de intervenciones:**
- Listado de averías activas ordenadas por parada de máquina, prioridad y antigüedad.
- Averías abiertas pendientes de asignación de técnico.
- Acceso directo a la gestión de las intervenciones.

**Indicadores de rendimiento:**
- Tiempo medio de trabajo por reparación, calculado a partir de las horas imputadas.
- Intervalo medio entre detecciones consecutivas de averías de una misma máquina.

**Gráficos de mantenimiento:**
- Distribución de averías activas por prioridad.
- Horas de mantenimiento acumuladas por máquina.
- Horas de trabajo acumuladas por técnico.

Estos indicadores permiten identificar las incidencias que requieren atención, consultar la carga de trabajo y analizar la actividad de mantenimiento.

La información se obtiene de los datos registrados en el sistema y se procesa en el frontend mediante el hook `useDashboard.ts`.

**El dashboard puede consultarse en cualquier momento del ciclo de vida de las averías**, por lo que funciona como una herramienta de supervisión y apoyo a la toma de decisiones, sin necesidad de esperar a que finalicen las reparaciones.

## 11. Instalación y ejecución

Los requisitos previos, la configuración de variables de entorno,
la instalación de dependencias y los comandos para ejecutar
el sistema completo se encuentran en el
[README principal](../README.md).