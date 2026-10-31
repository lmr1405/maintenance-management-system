
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ImputacionHorasCrear(BaseModel):
    """Datos necesarios para registrar horas de trabajo."""

    id_averia: int = Field(gt=0)
    id_tecnico: int = Field(gt=0)

    fecha: date
    horas: Decimal = Field(gt=0, decimal_places=2)
    descripcion_trabajo: str = Field(min_length=1)


class ImputacionHorasRespuesta(ImputacionHorasCrear):
    """Datos devueltos por la API."""

    id_imputacion: int

    model_config = ConfigDict(from_attributes=True)
