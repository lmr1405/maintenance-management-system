# Estructura de la aplicación

El directorio `app` contiene el código principal del backend, organizado en tres capas para separar las responsabilidades.

```text
backend/
└── app/
    ├── api/             # Endpoints y peticiones HTTP con FastAPI
    ├── nucleo/          # Entidades, interfaces y lógica de negocio
    ├── persistencia/    # Acceso a la base de datos con SQLAlchemy
    ├── __init__.py      # Identifica app como paquete Python
    └── main.py          # Punto de entrada de FastAPI
```

Esta estructura permite mantener la lógica de negocio independiente de la API y de la persistencia de datos, facilitando el mantenimiento y las pruebas.