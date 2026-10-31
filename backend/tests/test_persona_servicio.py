from decimal import Decimal
from unittest.mock import Mock

import pytest

from app.nucleo.servicio.persona_servicio import PersonaServicio
from app.nucleo.modelo.persona import Persona
from app.nucleo.modelo.enums import RolPersona


@pytest.fixture
def repositorio():
    repo = Mock()
    repo.guardar.side_effect = lambda persona: persona
    repo.actualizar.side_effect = lambda persona: persona
    return repo


@pytest.fixture
def servicio(repositorio):
    return PersonaServicio(repositorio)


@pytest.fixture
def persona():
    return Persona(
        nombre="Juan",
        apellidos="García",
        rol=RolPersona.TECNICO,
        coste_hora=Decimal("25.50"),
        id_persona=1
    )


def test_registrar_persona_valida(servicio, repositorio, persona):
    resultado = servicio.registrar_persona(persona)

    assert resultado is persona
    repositorio.guardar.assert_called_once_with(persona)


def test_registrar_persona_sin_nombre(
    servicio, repositorio, persona
):
    persona.nombre = ""

    with pytest.raises(ValueError):
        servicio.registrar_persona(persona)

    repositorio.guardar.assert_not_called()


def test_registrar_persona_sin_apellidos(
    servicio, repositorio, persona
):
    persona.apellidos = ""

    with pytest.raises(ValueError):
        servicio.registrar_persona(persona)

    repositorio.guardar.assert_not_called()


def test_coste_hora_negativo(servicio, repositorio, persona):
    persona.coste_hora = Decimal("-5")

    with pytest.raises(ValueError):
        servicio.registrar_persona(persona)

    repositorio.guardar.assert_not_called()


def test_actualizar_persona(servicio, repositorio, persona):
    repositorio.obtener_por_id.return_value = persona
    persona.telefono = "600123456"

    resultado = servicio.actualizar_persona(persona)

    assert resultado.telefono == "600123456"
    repositorio.actualizar.assert_called_once_with(persona)


def test_actualizar_persona_inexistente(
    servicio, repositorio, persona
):
    repositorio.obtener_por_id.return_value = None

    with pytest.raises(ValueError):
        servicio.actualizar_persona(persona)

    repositorio.actualizar.assert_not_called()


def test_desactivar_persona(servicio, repositorio, persona):
    repositorio.obtener_por_id.return_value = persona

    resultado = servicio.desactivar_persona(1)

    assert resultado.activo is False
    repositorio.actualizar.assert_called_once_with(persona)


def test_desactivar_persona_inexistente(servicio, repositorio):
    repositorio.obtener_por_id.return_value = None

    with pytest.raises(ValueError):
        servicio.desactivar_persona(999)

    repositorio.actualizar.assert_not_called()
