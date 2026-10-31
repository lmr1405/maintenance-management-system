from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.nucleo.modelo.enums import Criticidad, EstadoMaquina


class MaquinaCrear(BaseModel):
    """Datos necesarios para registrar una máquina."""

    codigo: str = Field(min_length=1, max_length=20)
    nombre: str = Field(min_length=1, max_length=100)
    tipo: str = Field(min_length=1, max_length=50)

    fabricante: str | None = None
    modelo: str | None = None
    numero_serie: str | None = None
    ubicacion: str | None = None
    fecha_puesta_marcha: date | None = None
    criticidad: Criticidad | None = None

    estado: EstadoMaquina = EstadoMaquina.OPERATIVA


class MaquinaRespuesta(MaquinaCrear):
    """Datos que devuelve la API al consultar una máquina."""

    id_maquina: int

    model_config = ConfigDict(from_attributes=True)