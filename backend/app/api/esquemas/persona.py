from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.nucleo.modelo.enums import RolPersona, Especialidad


class PersonaCrear(BaseModel):
    """Datos necesarios para registrar una persona."""

    nombre: str = Field(min_length=1, max_length=100)
    apellidos: str = Field(min_length=1, max_length=150)
    rol: RolPersona

    especialidad: Especialidad | None = None
    email: str | None = Field(default=None, max_length=255)
    telefono: str | None = Field(default=None, max_length=20)
    coste_hora: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=10,
        decimal_places=2
    )
    activo: bool = True


class PersonaRespuesta(PersonaCrear):
    """Datos devueltos por la API."""

    id_persona: int

    model_config = ConfigDict(from_attributes=True)
