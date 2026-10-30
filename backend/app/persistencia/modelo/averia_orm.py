from datetime import datetime

from sqlalchemy import String, ForeignKey, DateTime, Boolean, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.persistencia.modelo.base import Base
from app.nucleo.modelo.enums import TipoFallo, Prioridad, EstadoAveria, TipoSolucion

class AveriaORM(Base):
    """Representa la tabla de averias en PostgreSQL"""
    __tablename__ = "averias"

    # identificacion
    id_averia: Mapped[int] = mapped_column(primary_key=True)

    numero: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)

    # Relaciones con Máquina y Persona
    id_maquina: Mapped[int] = mapped_column(ForeignKey("maquinas.id_maquina"), nullable=False)

    id_reportada_por: Mapped[int] = mapped_column(ForeignKey("personas.id_persona"), nullable=False)

    id_tecnico_asignado: Mapped[int | None] = mapped_column(ForeignKey("personas.id_persona"))

    id_validada_por: Mapped[int | None] = mapped_column(ForeignKey("personas.id_persona"))

    # Datos de deteccion
    fecha_deteccion: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    titulo: Mapped[str] = mapped_column(String(150), nullable=False)
    sintoma: Mapped[str] = mapped_column(Text, nullable=False)
    tipo_fallo: Mapped[TipoFallo] = mapped_column(SQLEnum(TipoFallo, name="tipo_fallo"), nullable=False)
    prioridad: Mapped[Prioridad] = mapped_column(SQLEnum(Prioridad, name="prioridad-averia"), nullable=False)
    maquina_parada: Mapped[bool] = mapped_column(Boolean, nullable=False)
    estado: Mapped[EstadoAveria] = mapped_column(SQLEnum(EstadoAveria, name="estado-averia"), nullable=False)

    # Datos de resolucion
    causa_raiz: Mapped[str | None] = mapped_column(Text)
    solucion_aplicada: Mapped[str | None] = mapped_column(Text)
    repuestos_sustituidos: Mapped[str | None] = mapped_column(Text)
    tipo_solucion: Mapped[TipoSolucion | None] = mapped_column(SQLEnum(TipoSolucion, name="tipo_solucion"))
    recomendacion_preventiva: Mapped[str | None] = mapped_column(Text)
    fecha_resolucion: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    fecha_cierre: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))