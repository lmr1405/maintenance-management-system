from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.nucleo.modelo.enums import (
    TipoFallo,
    Prioridad,
    EstadoAveria,
    TipoSolucion
)


class AveriaCrear(BaseModel):
    """Datos necesarios para registrar una avería."""

    id_maquina: int = Field(gt=0)
    id_reportada_por: int = Field(gt=0)

    fecha_deteccion: datetime
    titulo: str = Field(min_length=1, max_length=150)
    sintoma: str = Field(min_length=1)

    tipo_fallo: TipoFallo
    prioridad: Prioridad
    maquina_parada: bool


class AveriaRespuesta(AveriaCrear):
    """Datos completos de una avería."""

    id_averia: int
    numero: str
    estado: EstadoAveria

    id_tecnico_asignado: int | None = None
    id_validada_por: int | None = None

    causa_raiz: str | None = None
    solucion_aplicada: str | None = None
    repuestos_sustituidos: str | None = None
    tipo_solucion: TipoSolucion | None = None
    recomendacion_preventiva: str | None = None

    fecha_resolucion: datetime | None = None
    fecha_cierre: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
