from decimal import Decimal

from sqlalchemy import String, Numeric, Boolean, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.persistencia.modelo.base import Base
from app.nucleo.modelo.enums import RolPersona, Especialidad

class PersonaORM(Base):
    """Representa la tabla de personas en PostgreSQL"""
    ___tablename___ = "personas"

     # Identificación
    id_persona: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellidos: Mapped[str] = mapped_column(String(150), nullable=False)

    # Información profesional
    rol: Mapped[RolPersona] = mapped_column(
        SQLEnum(RolPersona, name="rol_persona"),
        nullable=False
    )

    especialidad: Mapped[Especialidad | None] = mapped_column(
        SQLEnum(Especialidad, name="especialidad_persona")
    )

    # Datos de contacto
    email: Mapped[str | None] = mapped_column(String(255))
    telefono: Mapped[str | None] = mapped_column(String(20))

    # Información laboral
    coste_hora: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))

    activo: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True
    )