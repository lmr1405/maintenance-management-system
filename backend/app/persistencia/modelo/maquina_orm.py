from datetime import date

from sqlalchemy import String, Date, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.persistencia.modelo.base import Base
from app.nucleo.modelo.enums import Criticidad, EstadoMaquina


class MaquinaORM(Base):
    """ Representa la tabla de maquinas en PostgreSQL """
    __tablename__ = "maquinas"

    # identificacion
    id_maquina: Mapped[int] = mapped_column(primary_key=True)
    codigo: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)

    # informacion de la maquina
    tipo: Mapped[str] = mapped_column(String(50), nullable=False)
    fabricante: Mapped[str | None] = mapped_column(String(100))
    modelo: Mapped[str | None] = mapped_column(String(100))
    numero_serie: Mapped[str | None] = mapped_column(String(100))
    ubicacion: Mapped[str | None] = mapped_column(String(100))
    fecha_puesta_marcha: Mapped[date | None] = mapped_column(Date)

    # clasificacion y estado
    criticidad: Mapped[Criticidad | None] = mapped_column(
        SQLEnum(Criticidad, name="criticidad_maquina")
    )

    estado: Mapped[EstadoMaquina] = mapped_column(
        SQLEnum(EstadoMaquina, name="estado_maquina"),nullable=False
    )