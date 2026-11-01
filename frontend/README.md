# Frontend — Sistema de Gestión de Mantenimiento

## 1. Descripción del proyecto

Aplicación web desarrollada con **React y TypeScript** para gestionar el mantenimiento correctivo de máquinas industriales.

Permite registrar y gestionar máquinas, personas, averías e imputaciones de horas, ofreciendo una interfaz para consultar el estado de las intervenciones y realizar un seguimiento de los trabajos de mantenimiento.

El frontend se comunica con un backend desarrollado en **Python y FastAPI** mediante una API REST. Los datos se almacenan en una base de datos PostgreSQL alojada en Supabase.

La autenticación de los usuarios se realiza mediante **Supabase Auth**.

### Funcionalidades principales

- **Dashboard:** panel de control con indicadores operativos, intervenciones prioritarias y gráficos de mantenimiento.
- **Máquinas:** registro, consulta, actualización y baja de máquinas industriales.
- **Personas:** gestión de operarios, técnicos de mantenimiento y responsables.
- **Averías:** registro, asignación de técnicos, inicio de reparaciones, resolución y cierre.
- **Imputaciones:** registro de horas de trabajo y consulta de totales por avería, máquina y técnico.
- **Autenticación:** inicio y cierre de sesión para controlar el acceso a la aplicación.
- **Informes:** sección destinada a la consulta de informes de mantenimiento.

---

## 2. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| React | Desarrollo de la interfaz web mediante componentes reutilizables. |
| TypeScript (TS) | Tipado estático para mejorar la seguridad y el mantenimiento del código. |
| TSX | Combinación de TypeScript y JSX para crear componentes visuales. |
| Vite | Herramienta de desarrollo y compilación del frontend. |
| HTML5 | Estructura de los elementos de la interfaz. |
| CSS3 | Diseño visual, distribución y adaptación a diferentes dispositivos. |
| React Router | Navegación entre las páginas sin recargar la aplicación. |
| Recharts | Representación gráfica de indicadores de mantenimiento. |
| Supabase Auth | Autenticación y gestión de sesiones de usuario. |
| Fetch API | Comunicación HTTP con el backend FastAPI. |
| Node.js | Entorno necesario para utilizar las herramientas de desarrollo. |
| npm | Gestión de dependencias y ejecución de comandos. |

### Dependencias principales

Las bibliotecas utilizadas en el frontend incluyen:

| Paquete | Utilidad |
|---|---|
| `react` | Componentes y gestión del estado de la interfaz. |
| `react-dom` | Renderizado de React en el navegador. |
| `react-router` | Navegación, rutas y redirecciones. |
| `recharts` | Gráficos de barras y circulares. |
| `@supabase/supabase-js` | Conexión con Supabase para gestionar la autenticación. |
| `vite` | Servidor de desarrollo y generación de la aplicación. |
| `typescript` | Compilación y comprobación de tipos. |

También se utilizan herramientas de desarrollo y tipos auxiliares definidos en `package.json`.

Las versiones concretas de las dependencias se encuentran en `package-lock.json`.

---

## 3. Arquitectura del frontend

El frontend sigue una arquitectura basada en componentes, con separación de responsabilidades entre la interfaz, la comunicación con el backend, los tipos de datos y los estilos.

### Estructura general

```text
frontend/
│
├── public/                 # Recursos públicos
├── src/
│   ├── api/                # Comunicación con FastAPI y Supabase
│   ├── components/         # Componentes visuales reutilizables
│   │   └── dashboard/      # Componentes e indicadores del dashboard
│   ├── hooks/              # Lógica reutilizable y cálculos
│   ├── layouts/            # Estructura general de la aplicación
│   ├── pages/              # Páginas y formularios
│   ├── styles/             # Hojas de estilos CSS
│   └── types/              # Tipos e interfaces TypeScript
│
├── .env.local              # Variables de entorno locales
├── package.json            # Dependencias y comandos
├── package-lock.json       # Versiones de dependencias
└── vite.config.ts          # Configuración de Vite
```

### Responsabilidades de cada carpeta

| Carpeta | Responsabilidad |
|---|---|
| `api/` | Realiza peticiones HTTP al backend y configura Supabase. |
| `components/` | Contiene elementos reutilizables como tarjetas, gráficos, menús y ventanas de confirmación. |
| `components/dashboard/` | Contiene indicadores operativos, tablas y gráficos del panel de mantenimiento. |
| `hooks/` | Centraliza la obtención, procesamiento y cálculo de datos reutilizables. |
| `layouts/` | Define la distribución general de la aplicación: menú lateral, cabecera, contenido y pie de página. |
| `pages/` | Contiene las pantallas de consulta, registro y gestión de información. |
| `styles/` | Define los estilos visuales y el diseño adaptable. |
| `types/` | Define las interfaces, tipos y valores permitidos para los datos utilizados. |

### Comunicación entre componentes

El funcionamiento general es el siguiente:

```text
                  USUARIO
                     │
                     ▼
               PÁGINAS REACT
                     │
             ┌───────┴───────┐
             ▼               ▼
        COMPONENTES         HOOKS
             │               │
             └───────┬───────┘
                     ▼
                  API (TS)
                     │
                     ▼
               BACKEND FASTAPI
                     │
                     ▼
              BASE DE DATOS
                POSTGRESQL
```

Las páginas muestran la información y gestionan la interacción con el usuario. Los componentes permiten reutilizar elementos visuales, mientras que los hooks centralizan determinados cálculos y la obtención de información.

Los archivos de `api/` realizan las peticiones al backend, que se encarga de ejecutar las reglas de negocio y acceder a los datos.

La autenticación se gestiona mediante Supabase Auth.

---

## 4. Diseño de la aplicación

La aplicación utiliza una interfaz organizada en diferentes áreas.

### Menú lateral

El componente `Sidebar` permite acceder a las principales secciones:

- Dashboard
- Máquinas
- Personas
- Averías
- Imputaciones
- Informes
- Cerrar sesión

### Estructura general

El componente `MainLayout` organiza la interfaz mediante un menú lateral, una cabecera, el área principal de contenido y un pie de página.

Los estilos CSS permiten adaptar la distribución a diferentes tamaños de pantalla, incluidos ordenadores, tabletas y dispositivos móviles.

### Dashboard operativo

El dashboard es el panel principal de la aplicación.

Su objetivo es **mostrar rápidamente las incidencias que requieren atención y facilitar la toma de decisiones en el mantenimiento correctivo**.

Contiene los siguientes elementos:

**Indicadores operativos (KPI)**

- Máquinas paradas.
- Averías pendientes de asignación.
- Reparaciones en curso.
- Averías pendientes de validación.

**Intervenciones prioritarias**

Muestra las averías activas ordenadas según tres criterios:

1. Máquinas paradas.
2. Nivel de prioridad de la avería.
3. Antigüedad de la incidencia.

Permite acceder directamente a la gestión de cada intervención.

**Averías pendientes de asignación**

Presenta las averías abiertas que todavía no tienen un técnico asignado y permite acceder a su asignación.

**Indicadores de rendimiento**

- Tiempo medio de trabajo por reparación (MTTR): media de horas imputadas a las averías reparadas.
- Intervalo medio entre averías (MTBF): media de horas naturales transcurridas entre detecciones consecutivas de fallos de una misma máquina.

**Gráficos de mantenimiento**

- Cantidad de averías activas por prioridad.
- Horas de mantenimiento acumuladas por máquina.
- Horas de trabajo acumuladas por técnico.

Los indicadores se calculan en el hook `useDashboard.ts`, separando el procesamiento de los datos de su representación visual.

---

## 5. Gestión de averías

La aplicación permite gestionar el ciclo de vida de una avería mediante cinco estados:

```text
ABIERTA
   │
   ▼
ASIGNADA
   │
   ▼
EN CURSO
   │
   ▼
RESUELTA
   │
   ▼
CERRADA
```

Las principales operaciones son:

- **Registrar avería:** un operario comunica una incidencia detectada.
- **Asignar técnico:** se selecciona el técnico encargado de la reparación.
- **Iniciar reparación:** se registra el inicio del trabajo.
- **Resolver avería:** se documenta la causa raíz, la solución aplicada y otra información de reparación.
- **Cerrar avería:** un responsable valida el cierre de la intervención.

La aplicación incluye mensajes de confirmación y controles de formulario para facilitar estas operaciones.

Las validaciones definitivas y las transiciones de estado se gestionan desde el backend.


## 6. Autenticación y seguridad

El frontend utiliza Supabase Auth para controlar el acceso a las páginas.

El componente `RutaProtegida` comprueba si existe una sesión activa.

- Si existe una sesión, permite mostrar las páginas protegidas.
- Si no existe, redirige al formulario de inicio de sesión.
- Detecta los cambios de autenticación durante el uso de la aplicación.

La sesión se almacena utilizando `sessionStorage`, por lo que se mantiene durante la sesión de la pestaña y no se conserva de forma persistente en el almacenamiento local del navegador.

La protección visual de rutas no sustituye las comprobaciones de autenticación y autorización que deben realizarse en el backend.

---

## 7. Separación de responsabilidades

El proyecto diferencia las responsabilidades del frontend y del backend.

| Frontend | Backend |
|---|---|
| Presentación de páginas y componentes. | Aplicación de las reglas de negocio. |
| Formularios y navegación. | Validación de operaciones. |
| Filtros y visualización de información. | Gestión de las entidades de mantenimiento. |
| Indicadores y gráficos del dashboard. | Persistencia y consulta de datos. |
| Gestión de la sesión de usuario en la interfaz. | Control de acceso a los recursos de la API. |
| Peticiones HTTP mediante Fetch. | Endpoints REST mediante FastAPI. |

Esta separación permite mantener la interfaz independiente de la lógica de negocio y facilita las futuras modificaciones de la aplicación.

---

## 8. Instalación y ejecución

Los requisitos previos, la configuración del entorno y
las instrucciones para instalar y ejecutar la aplicación
completa se encuentran en el [README principal](../README.md).