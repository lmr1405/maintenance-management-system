from fastapi import FastAPI

from app.api.rutas import maquinas, personas, averias, imputaciones

# Crear la aplicación FastAPI
app = FastAPI(title="API de Gestion de Mantenimiento", version="1.0.0")


# Registrar los routers
app.include_router(maquinas.router)
app.include_router(personas.router)
app.include_router(averias.router)
app.include_router(imputaciones.router)

@app.get("/", tags=["Inicio"])
def inicio():
    return{"mensaje": "API de gestion de mantenimiento"}