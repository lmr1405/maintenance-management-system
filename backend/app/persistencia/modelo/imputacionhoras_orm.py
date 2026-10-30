from datetime import date
from decimal import Decimal

from app.persistencia.modelo.base import Base

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Date, Numeric, Text, ForeignKey


class ImputacionHorasORM(Base):
    """Representa la tabla de imputacion de horas en PostgreSQL"""
    __tablename__ = "imputaciones_horas"

    # Identificacion
    id_imputacion: Mapped[int] = mapped_column(primary_key=True)

    # Relaciones con Averia y Persona
    id_averia: Mapped[int] = mapped_column(ForeignKey("averias.id_averia"), nullable=False)
    id_tecnico: Mapped[int] = mapped_column(ForeignKey("personas.id_persona"), nullable=False)

    # Datos de la imputacion
    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    horas: Mapped[Decimal] = mapped_column(Numeric(6, 2), nullable=False)
    descripcion_trabajo: Mapped[str]= mapped_column(Text, nullable=False)