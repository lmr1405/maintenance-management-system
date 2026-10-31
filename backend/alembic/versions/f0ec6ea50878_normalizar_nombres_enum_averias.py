"""normalizar nombres enum averias

Revision ID: f0ec6ea50878
Revises: 9bb81bf3fe7b
Create Date: 2026-10-31 22:50:39.052827

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f0ec6ea50878'
down_revision: Union[str, Sequence[str], None] = '9bb81bf3fe7b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Normalizar los nombres de los ENUM de averías
    op.execute(
        'ALTER TYPE public."prioridad-averia" RENAME TO prioridad_averia'
    )

    op.execute(
        'ALTER TYPE public."estado-averia" RENAME TO estado_averia'
    )


def downgrade() -> None:
    # Recuperar los nombres originales de los ENUM
    op.execute(
        'ALTER TYPE public.prioridad_averia RENAME TO "prioridad-averia"'
    )

    op.execute(
        'ALTER TYPE public.estado_averia RENAME TO "estado-averia"'
    )
