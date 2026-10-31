from collections.abc import Generator

from sqlalchemy.orm import Session

from app.persistencia.database import SessionLocal


def obtener_sesion() -> Generator[Session, None, None]:
    # Crear una sesión para la petición HTTP
    with SessionLocal() as session:
        try:
            yield session
        except Exception:
            # Deshacer los cambios si ocurre algún error
            session.rollback()
            raise