# Estructura de la aplicación

El directorio `app` contiene el código principal del backend, organizado por capas para separar las responsabilidades.

```text
app/
├── api/                         # Endpoints de FastAPI
│
├── nucleo/                      # Lógica de negocio
│   ├── interfaces/              # Interfaces de los repositorios
│   ├── modelo/                  # Entidades y enumeraciones
│   └── servicio/                # Servicios y reglas de negocio
│
├── persistencia/                # Acceso a la base de datos
│   ├── modelo/                  # Modelos ORM de SQLAlchemy
│   ├── repositorios/            # Implementación de los repositorios
│   └── database.py              # Configuración de la conexión
│
├── __init__.py                  # Identifica app como paquete Python
└── main.py                      # Punto de entrada de FastAPI
```

Esta arquitectura mantiene la lógica de negocio independiente de FastAPI y SQLAlchemy.

Los repositorios implementan las interfaces definidas en el núcleo y se encargan de convertir las entidades del dominio en modelos ORM y viceversa.