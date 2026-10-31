from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.rutas import maquinas, personas, averias, imputaciones

# Crear la aplicación FastAPI
app = FastAPI(title="API de Gestion de Mantenimiento", version="1.0.0")


# Permitir las peticiones del frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Registrar los routers
app.include_router(maquinas.router)
app.include_router(personas.router)
app.include_router(averias.router)
app.include_router(imputaciones.router)

# Endpoint de inicio
@app.get("/", tags=["Inicio"])
def inicio():
    return{"mensaje": "API de gestion de mantenimiento"}