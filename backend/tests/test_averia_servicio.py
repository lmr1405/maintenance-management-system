
from datetime import datetime, timezone
from unittest.mock import Mock

import pytest

from app.nucleo.servicio.deteccion_averia_servicio import DeteccionAveriaServicio
from app.nucleo.servicio.resolucion_averia_servicio import ResolucionAveriaServicio

from app.nucleo.modelo.maquina import Maquina
from app.nucleo.modelo.persona import Persona
from app.nucleo.modelo.averia import Averia

from app.nucleo.modelo.enums import (
    EstadoMaquina,
    EstadoAveria,
    RolPersona,
    TipoFallo,
    Prioridad
)


# ------------------------------------------
# Datos y repositorios para las pruebas
# ------------------------------------------

@pytest.fixture
def maquina():
    return Maquina(
        codigo="M-001",
        nombre="Prensa hidráulica",
        tipo="Prensa",
        estado=EstadoMaquina.OPERATIVA,
        id_maquina=1
    )


@pytest.fixture
def persona():
    return Persona(
        nombre="Juan",
        apellidos="García",
        rol=RolPersona.TECNICO,
        id_persona=2
    )


@pytest.fixture
def averia():
    return Averia(
        numero="AV-001",
        id_maquina=1,
        id_reportada_por=2,
        fecha_deteccion=datetime(
            2026, 10, 30, 10, 0, tzinfo=timezone.utc
        ),
        titulo="Fallo del motor",
        sintoma="El motor no arranca",
        tipo_fallo=TipoFallo.MECANICO,
        prioridad=Prioridad.ALTA,
        maquina_parada=True,
        estado=EstadoAveria.ABIERTA,
        id_averia=10
    )


@pytest.fixture
def repositorios(maquina, persona, averia):
    averias = Mock()
    maquinas = Mock()
    personas = Mock()

    averias.obtener_por_id.return_value = averia
    maquinas.obtener_por_id.return_value = maquina
    personas.obtener_por_id.return_value = persona

    averias.guardar.side_effect = lambda a: a
    averias.actualizar.side_effect = lambda a: a
    maquinas.actualizar.side_effect = lambda m: m
    averias.listar_por_maquina.return_value = []

    return averias, maquinas, personas


@pytest.fixture
def deteccion(repositorios):
    return DeteccionAveriaServicio(*repositorios)


@pytest.fixture
def resolucion(repositorios):
    return ResolucionAveriaServicio(*repositorios)


# ------------------------------------------
# Pruebas de detección
# ------------------------------------------

def test_registrar_averia_valida(deteccion, repositorios, averia):
    averias, maquinas, personas = repositorios

    resultado = deteccion.registrar_averia(averia)

    assert resultado is averia
    averias.guardar.assert_called_once_with(averia)


def test_registrar_averia_maquina_inexistente(
    deteccion, repositorios, averia
):
    averias, maquinas, personas = repositorios
    maquinas.obtener_por_id.return_value = None

    with pytest.raises(ValueError):
        deteccion.registrar_averia(averia)

    averias.guardar.assert_not_called()


def test_registrar_averia_maquina_de_baja(
    deteccion, repositorios, maquina, averia
):
    averias, maquinas, personas = repositorios
    maquina.estado = EstadoMaquina.DE_BAJA

    with pytest.raises(ValueError):
        deteccion.registrar_averia(averia)

    averias.guardar.assert_not_called()


def test_registrar_averia_persona_inactiva(
    deteccion, repositorios, persona, averia
):
    averias, maquinas, personas = repositorios
    persona.activo = False

    with pytest.raises(ValueError):
        deteccion.registrar_averia(averia)

    averias.guardar.assert_not_called()


def test_averia_con_parada_actualiza_maquina(
    deteccion, repositorios, maquina, averia
):
    averias, maquinas, personas = repositorios

    deteccion.registrar_averia(averia)

    assert maquina.estado == EstadoMaquina.EN_AVERIA
    maquinas.actualizar.assert_called_once_with(maquina)


def test_averia_sin_parada_no_cambia_maquina(
    deteccion, repositorios, maquina, averia
):
    averias, maquinas, personas = repositorios
    averia.maquina_parada = False

    deteccion.registrar_averia(averia)

    assert maquina.estado == EstadoMaquina.OPERATIVA
    maquinas.actualizar.assert_not_called()


def test_asignar_tecnico_valido(
    deteccion, repositorios, averia, persona
):
    averias, maquinas, personas = repositorios

    resultado = deteccion.asignar_tecnico(10, 2)

    assert resultado.id_tecnico_asignado == 2
    assert resultado.estado == EstadoAveria.ASIGNADA
    averias.actualizar.assert_called_once_with(averia)


def test_no_asignar_operario(
    deteccion, repositorios, persona
):
    averias, maquinas, personas = repositorios
    persona.rol = RolPersona.OPERARIO

    with pytest.raises(ValueError):
        deteccion.asignar_tecnico(10, 2)

    averias.actualizar.assert_not_called()


def test_no_asignar_averia_en_curso(
    deteccion, repositorios, averia
):
    averias, maquinas, personas = repositorios
    averia.estado = EstadoAveria.EN_CURSO

    with pytest.raises(ValueError):
        deteccion.asignar_tecnico(10, 2)

    averias.actualizar.assert_not_called()


# ------------------------------------------
# Pruebas de resolución
# ------------------------------------------

def test_iniciar_reparacion(resolucion, repositorios, averia):
    averias, maquinas, personas = repositorios
    averia.estado = EstadoAveria.ASIGNADA
    averia.id_tecnico_asignado = 2

    resultado = resolucion.iniciar_reparacion(10)

    assert resultado.estado == EstadoAveria.EN_CURSO
    averias.actualizar.assert_called_once_with(averia)


def test_no_iniciar_reparacion_sin_asignar(
    resolucion, repositorios
):
    averias, maquinas, personas = repositorios

    with pytest.raises(ValueError):
        resolucion.iniciar_reparacion(10)

    averias.actualizar.assert_not_called()


def test_resolver_averia_valida(
    resolucion, repositorios, maquina, averia
):
    averias, maquinas, personas = repositorios

    averia.estado = EstadoAveria.EN_CURSO
    averia.id_tecnico_asignado = 2
    maquina.estado = EstadoMaquina.EN_AVERIA

    resultado = resolucion.resolver_averia(
        10,
        2,
        "Rodamiento deteriorado",
        "Sustitución del rodamiento"
    )

    assert resultado.estado == EstadoAveria.RESUELTA
    assert resultado.causa_raiz == "Rodamiento deteriorado"
    assert resultado.fecha_resolucion is not None
    assert maquina.estado == EstadoMaquina.OPERATIVA


def test_no_resolver_sin_causa(
    resolucion, repositorios, averia
):
    averias, maquinas, personas = repositorios

    averia.estado = EstadoAveria.EN_CURSO
    averia.id_tecnico_asignado = 2

    with pytest.raises(ValueError):
        resolucion.resolver_averia(
            10, 2, "", "Motor reparado"
        )

    averias.actualizar.assert_not_called()


def test_no_resolver_sin_solucion(
    resolucion, repositorios, averia
):
    averias, maquinas, personas = repositorios

    averia.estado = EstadoAveria.EN_CURSO
    averia.id_tecnico_asignado = 2

    with pytest.raises(ValueError):
        resolucion.resolver_averia(
            10, 2, "Motor averiado", ""
        )

    averias.actualizar.assert_not_called()


def test_otra_averia_mantiene_maquina_parada(
    resolucion, repositorios, maquina, averia
):
    averias, maquinas, personas = repositorios
    averia.id_tecnico_asignado = 2
    averia.estado = EstadoAveria.EN_CURSO
    maquina.estado = EstadoMaquina.EN_AVERIA

    otra_averia = Averia(
        numero="AV-002",
        id_maquina=1,
        id_reportada_por=2,
        fecha_deteccion=datetime(
            2026, 10, 30, 11, 0, tzinfo=timezone.utc
        ),
        titulo="Fuga hidráulica",
        sintoma="Pérdida de aceite",
        tipo_fallo=TipoFallo.HIDRAULICO,
        prioridad=Prioridad.ALTA,
        maquina_parada=True,
        estado=EstadoAveria.ABIERTA,
        id_averia=11
    )

    averias.listar_por_maquina.return_value = [averia, otra_averia]

    resolucion.resolver_averia(
        10, 2,
        "Rodamiento deteriorado",
        "Rodamiento sustituido"
    )

    assert maquina.estado == EstadoMaquina.EN_AVERIA
    maquinas.actualizar.assert_not_called()


def test_cerrar_averia_responsable(
    resolucion, repositorios, averia, persona
):
    averias, maquinas, personas = repositorios
    averia.estado = EstadoAveria.RESUELTA
    persona.rol = RolPersona.RESPONSABLE

    resultado = resolucion.cerrar_averia(10, 2)

    assert resultado.estado == EstadoAveria.CERRADA
    assert resultado.id_validada_por == 2
    assert resultado.fecha_cierre is not None


def test_no_cerrar_averia_con_tecnico(
    resolucion, repositorios, averia
):
    averias, maquinas, personas = repositorios
    averia.estado = EstadoAveria.RESUELTA

    with pytest.raises(ValueError):
        resolucion.cerrar_averia(10, 2)

    averias.actualizar.assert_not_called()


def test_no_cerrar_averia_sin_resolver(
    resolucion, repositorios, persona
):
    averias, maquinas, personas = repositorios
    persona.rol = RolPersona.RESPONSABLE

    with pytest.raises(ValueError):
        resolucion.cerrar_averia(10, 2)

    averias.actualizar.assert_not_called()

def test_no_resolver_tecnico_no_asignado(
    resolucion, repositorios, averia
):
    averias, maquinas, personas = repositorios

    averia.estado = EstadoAveria.EN_CURSO
    averia.id_tecnico_asignado = 3

    with pytest.raises(ValueError, match="Solo el técnico asignado"):
        resolucion.resolver_averia(
            10, 2, "Fallo mecánico", "Motor reparado"
        )

    averias.actualizar.assert_not_called()

def test_no_resolver_con_operario(
    resolucion, repositorios, averia, persona
):
    averias, maquinas, personas = repositorios

    averia.estado = EstadoAveria.EN_CURSO
    averia.id_tecnico_asignado = 2
    persona.rol = RolPersona.OPERARIO

    with pytest.raises(ValueError, match="técnico activo"):
        resolucion.resolver_averia(
            10, 2, "Fallo mecánico", "Motor reparado"
        )

    averias.actualizar.assert_not_called()