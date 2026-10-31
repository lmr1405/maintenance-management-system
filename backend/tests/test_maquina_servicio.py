import pytest
from unittest.mock import Mock

from app.nucleo.servicio.maquina_servicio import MaquinaServicio
from app.nucleo.modelo.maquina import Maquina
from app.nucleo.modelo.enums import EstadoMaquina


@pytest.fixture
def repositorio():
    repo = Mock()
    repo.listar.return_value = []
    repo.guardar.side_effect = lambda maquina: maquina
    repo.actualizar.side_effect = lambda maquina: maquina
    return repo


@pytest.fixture
def servicio(repositorio):
    return MaquinaServicio(repositorio)


@pytest.fixture
def maquina():
    return Maquina(
        codigo="M-001",
        nombre="Prensa hidráulica",
        tipo="Prensa",
        estado=EstadoMaquina.OPERATIVA,
        id_maquina=1
    )


def test_registrar_maquina_valida(servicio, repositorio, maquina):
    resultado = servicio.registrar_maquina(maquina)

    assert resultado is maquina
    repositorio.guardar.assert_called_once_with(maquina)


def test_registrar_maquina_sin_nombre(servicio, repositorio, maquina):
    maquina.nombre = ""

    with pytest.raises(ValueError):
        servicio.registrar_maquina(maquina)

    repositorio.guardar.assert_not_called()


def test_registrar_maquina_codigo_duplicado(
    servicio, repositorio, maquina
):
    repositorio.listar.return_value = [maquina]

    nueva = Maquina(
        codigo="M-001",
        nombre="Otra máquina",
        tipo="Torno",
        estado=EstadoMaquina.OPERATIVA
    )

    with pytest.raises(ValueError):
        servicio.registrar_maquina(nueva)

    repositorio.guardar.assert_not_called()


def test_actualizar_maquina(servicio, repositorio, maquina):
    repositorio.obtener_por_id.return_value = maquina
    maquina.ubicacion = "Nave 2"

    resultado = servicio.actualizar_maquina(maquina)

    assert resultado.ubicacion == "Nave 2"
    repositorio.actualizar.assert_called_once_with(maquina)


def test_actualizar_maquina_inexistente(
    servicio, repositorio, maquina
):
    repositorio.obtener_por_id.return_value = None

    with pytest.raises(ValueError):
        servicio.actualizar_maquina(maquina)

    repositorio.actualizar.assert_not_called()


def test_dar_baja_maquina(servicio, repositorio, maquina):
    repositorio.obtener_por_id.return_value = maquina

    resultado = servicio.dar_baja(1)

    assert resultado.estado == EstadoMaquina.DE_BAJA
    repositorio.actualizar.assert_called_once_with(maquina)


def test_dar_baja_maquina_inexistente(servicio, repositorio):
    repositorio.obtener_por_id.return_value = None

    with pytest.raises(ValueError):
        servicio.dar_baja(999)

    repositorio.actualizar.assert_not_called()
