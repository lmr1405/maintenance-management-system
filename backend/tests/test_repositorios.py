from datetime import date, datetime, timezone
from decimal import Decimal

import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.persistencia.modelo.base import Base
import app.persistencia.modelo

from app.nucleo.modelo.maquina import Maquina
from app.nucleo.modelo.persona import Persona
from app.nucleo.modelo.averia import Averia
from app.nucleo.modelo.imputacionhoras import ImputacionHoras

from app.nucleo.modelo.enums import (EstadoMaquina, RolPersona, TipoFallo, Prioridad, EstadoAveria)

from app.persistencia.repositorios.maquina_repositorio import MaquinaRepositorio
from app.persistencia.repositorios.persona_repositorio import PersonaRepositorio
from app.persistencia.repositorios.averia_repositorio import AveriaRepositorio
from app.persistencia.repositorios.imputacionhoras_repositorio import ImputacionHorasRepositorio


# --------------------------------------------------
# Configuración de la base de datos de pruebas
# --------------------------------------------------

@pytest.fixture
def session():
    # Crear una base de datos SQLite en memoria
    engine = create_engine("sqlite:///:memory:")

    # Activar la comprobación de claves foráneas en SQLite
    @event.listens_for(engine, "connect")
    def activar_claves_foraneas(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    # Crear las cuatro tablas ORM
    Base.metadata.create_all(engine)

    # Proporcionar una sesión independiente al test
    with Session(engine, autoflush=False, expire_on_commit=False) as db:
        yield db
        db.rollback()

    # Destruir la base de datos al finalizar
    engine.dispose()


# --------------------------------------------------
# Funciones auxiliares
# --------------------------------------------------

def crear_maquina(session, codigo="M-001"):
    maquina = Maquina(
        codigo=codigo,
        nombre="Prensa hidráulica",
        tipo="Prensa",
        estado=EstadoMaquina.OPERATIVA
    )

    return MaquinaRepositorio(session).guardar(maquina)


def crear_persona(session, nombre="Juan", rol=RolPersona.TECNICO):
    persona = Persona(
        nombre=nombre,
        apellidos="García",
        rol=rol,
        especialidad=None
    )

    return PersonaRepositorio(session).guardar(persona)


def crear_averia(session, numero="AV-001", maquina=None, persona=None):
    if maquina is None:
        maquina = crear_maquina(session)

    if persona is None:
        persona = crear_persona(session)

    averia = Averia(
        numero=numero,
        id_maquina=maquina.id_maquina,
        id_reportada_por=persona.id_persona,
        fecha_deteccion=datetime(2026, 10, 30, 10, 0, tzinfo=timezone.utc),
        titulo="Fallo en motor",
        sintoma="El motor no arranca",
        tipo_fallo=TipoFallo.MECANICO,
        prioridad=Prioridad.ALTA,
        maquina_parada=True,
        estado=EstadoAveria.ABIERTA
    )

    return AveriaRepositorio(session).guardar(averia)


def crear_imputacion(session, averia, tecnico):
    imputacion = ImputacionHoras(
        id_averia=averia.id_averia,
        id_tecnico=tecnico.id_persona,
        fecha=date(2026, 10, 30),
        horas=Decimal("1.50"),
        descripcion_trabajo="Revisión del motor"
    )

    return ImputacionHorasRepositorio(session).guardar(imputacion)


# --------------------------------------------------
# Pruebas MaquinaRepositorio
# --------------------------------------------------

def test_guardar_maquina(session):
    maquina = crear_maquina(session)

    assert maquina.id_maquina is not None


def test_obtener_maquina_por_id(session):
    maquina = crear_maquina(session)

    resultado = MaquinaRepositorio(session).obtener_por_id(maquina.id_maquina)

    assert resultado is not None
    assert resultado.codigo == "M-001"
    assert resultado.nombre == "Prensa hidráulica"


def test_obtener_maquina_inexistente(session):
    resultado = MaquinaRepositorio(session).obtener_por_id(999)

    assert resultado is None


def test_listar_maquinas(session):
    crear_maquina(session, "M-001")
    crear_maquina(session, "M-002")

    resultado = MaquinaRepositorio(session).listar()

    assert len(resultado) == 2


def test_actualizar_maquina(session):
    maquina = crear_maquina(session)
    maquina.ubicacion = "Nave 2"

    repositorio = MaquinaRepositorio(session)
    repositorio.actualizar(maquina)

    resultado = repositorio.obtener_por_id(maquina.id_maquina)

    assert resultado.ubicacion == "Nave 2"


# --------------------------------------------------
# Pruebas PersonaRepositorio
# --------------------------------------------------

def test_guardar_persona(session):
    persona = crear_persona(session)

    assert persona.id_persona is not None


def test_obtener_persona_por_id(session):
    persona = crear_persona(session)

    resultado = PersonaRepositorio(session).obtener_por_id(persona.id_persona)

    assert resultado is not None
    assert resultado.nombre == "Juan"


def test_listar_personas(session):
    crear_persona(session, "Juan")
    crear_persona(session, "María")

    resultado = PersonaRepositorio(session).listar()

    assert len(resultado) == 2


def test_actualizar_persona(session):
    persona = crear_persona(session)
    persona.activo = False

    repositorio = PersonaRepositorio(session)
    repositorio.actualizar(persona)

    resultado = repositorio.obtener_por_id(persona.id_persona)

    assert resultado.activo is False


# --------------------------------------------------
# Pruebas AveriaRepositorio
# --------------------------------------------------

def test_guardar_averia(session):
    averia = crear_averia(session)

    assert averia.id_averia is not None


def test_obtener_averia_por_id(session):
    averia = crear_averia(session)

    resultado = AveriaRepositorio(session).obtener_por_id(averia.id_averia)

    assert resultado is not None
    assert resultado.numero == f"AV-{datetime.now(timezone.utc).year}-{averia.id_averia:04d}"


def test_listar_averias_por_maquina(session):
    maquina1 = crear_maquina(session, "M-001")
    maquina2 = crear_maquina(session, "M-002")
    persona = crear_persona(session)

    crear_averia(session, "AV-001", maquina1, persona)
    crear_averia(session, "AV-002", maquina1, persona)
    crear_averia(session, "AV-003", maquina2, persona)

    resultado = AveriaRepositorio(session).listar_por_maquina(
        maquina1.id_maquina
    )

    assert len(resultado) == 2
    assert all(a.id_maquina == maquina1.id_maquina for a in resultado)


def test_actualizar_averia(session):
    averia = crear_averia(session)
    averia.estado = EstadoAveria.EN_CURSO

    repositorio = AveriaRepositorio(session)
    repositorio.actualizar(averia)

    resultado = repositorio.obtener_por_id(averia.id_averia)

    assert resultado.estado == EstadoAveria.EN_CURSO


# --------------------------------------------------
# Pruebas ImputacionHorasRepositorio
# --------------------------------------------------

def test_guardar_imputacion(session):
    averia = crear_averia(session)
    tecnico = crear_persona(session, "Pedro")

    imputacion = crear_imputacion(session, averia, tecnico)

    assert imputacion.id_imputacion is not None


def test_obtener_imputacion_por_id(session):
    averia = crear_averia(session)
    tecnico = crear_persona(session, "Pedro")
    imputacion = crear_imputacion(session, averia, tecnico)

    resultado = ImputacionHorasRepositorio(session).obtener_por_id(
        imputacion.id_imputacion
    )

    assert resultado is not None
    assert resultado.horas == Decimal("1.50")


def test_listar_imputaciones_por_averia(session):
    averia = crear_averia(session)
    tecnico1 = crear_persona(session, "Pedro")
    tecnico2 = crear_persona(session, "Ana")

    crear_imputacion(session, averia, tecnico1)
    crear_imputacion(session, averia, tecnico2)

    resultado = ImputacionHorasRepositorio(session).listar_por_averia(
        averia.id_averia
    )

    assert len(resultado) == 2


def test_listar_imputaciones_por_tecnico(session):
    averia = crear_averia(session)
    tecnico1 = crear_persona(session, "Pedro")
    tecnico2 = crear_persona(session, "Ana")

    crear_imputacion(session, averia, tecnico1)
    crear_imputacion(session, averia, tecnico1)
    crear_imputacion(session, averia, tecnico2)

    resultado = ImputacionHorasRepositorio(session).listar_por_tecnico(
        tecnico1.id_persona
    )

    assert len(resultado) == 2


# --------------------------------------------------
# Pruebas de integridad referencial
# --------------------------------------------------

def test_no_permite_averia_con_maquina_inexistente(session):
    persona = crear_persona(session)

    averia = Averia(
        numero="AV-INVALIDA",
        id_maquina=999,
        id_reportada_por=persona.id_persona,
        fecha_deteccion=datetime(2026, 10, 30, tzinfo=timezone.utc),
        titulo="Avería inválida",
        sintoma="Fallo",
        tipo_fallo=TipoFallo.MECANICO,
        prioridad=Prioridad.MEDIA,
        maquina_parada=False,
        estado=EstadoAveria.ABIERTA
    )

    with pytest.raises(IntegrityError):
        AveriaRepositorio(session).guardar(averia)


def test_no_permite_imputacion_con_tecnico_inexistente(session):
    averia = crear_averia(session)

    imputacion = ImputacionHoras(
        id_averia=averia.id_averia,
        id_tecnico=999,
        fecha=date(2026, 10, 30),
        horas=Decimal("1.00"),
        descripcion_trabajo="Trabajo de prueba"
    )

    with pytest.raises(IntegrityError):
        ImputacionHorasRepositorio(session).guardar(imputacion)
