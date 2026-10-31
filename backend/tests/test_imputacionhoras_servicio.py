from decimal import Decimal
from datetime import date, datetime

import pytest
from unittest.mock import Mock

from app.nucleo.servicio.imputacionhoras_servicio import ImputacionHorasServicio
from app.nucleo.modelo.persona import Persona
from app.nucleo.modelo.imputacionhoras import ImputacionHoras
from app.nucleo.modelo.averia import Averia
from app.nucleo.modelo.enums import RolPersona, TipoFallo, Prioridad, EstadoAveria

@pytest.fixture
def servicio():
    repositorio = Mock()
    return ImputacionHorasServicio(repositorio)

# comprobamos que recibe horas validas
def test_horas_validas(servicio):
    servicio.validar_horas(Decimal("1.25"))

# comprobamos que recibe horas invalidas
@pytest.mark.parametrize("horas", [
    Decimal("0"),
    Decimal("-1"),
    Decimal("1.30"),
    Decimal("0.20")
])
def test_horas_invalidas(servicio, horas):
    with pytest.raises(ValueError):
        servicio.validar_horas(horas)


# comprobamos que la fecha no es valida
def test_fecha_no_valida(servicio):
    with pytest.raises(ValueError):
        # arrange
        fecha_deteccion = datetime(2026, 10, 15, 9, 30)
        fecha_trabajo = date(2026, 10, 5)
        # act y assert
        servicio.validar_fecha(fecha_trabajo, fecha_deteccion)

# cuando las fechas son correctas
@pytest.mark.parametrize("fecha_trabajo, fecha_deteccion", [
    (date(2026, 11, 10), datetime(2026, 5, 14, 0, 0)),
    (date(2026, 10, 15), datetime(2026, 10, 15, 9, 30))
])
def test_fecha_valida(servicio, fecha_trabajo, fecha_deteccion):
    servicio.validar_fecha(fecha_trabajo, fecha_deteccion)

# comprobamos que si no es tecnico lanza excepcion
def test_tecnico_no_valido(servicio):    
    # arrange
    persona1 = Persona("Luis", "Menendez", RolPersona.OPERARIO)
    # act y assert
    with pytest.raises(ValueError):
        servicio.validar_tecnico(persona1)

# comprobamos cuando si es tecnico
def test_tecnico_valido(servicio):    
    # arrange
    persona2 = Persona("Pepe", "Garcia", RolPersona.TECNICO)
    # act y assert
    servicio.validar_tecnico(persona2)

# relaciones correctas
def test_relaciones_validas(servicio):
    # arrange    
    persona = Persona("Luis", "Menendez", RolPersona.TECNICO, id_persona=5)

    imputacion = ImputacionHoras(id_averia=10, id_tecnico=5, fecha=date(2026, 10, 5), 
                                 horas= Decimal("0.25"), 
                                 descripcion_trabajo="Revision de fuga de aceite")
    
    averia = Averia(numero="AV-01", id_maquina=5, id_reportada_por=2, 
                    fecha_deteccion=datetime(2026, 10, 5, 5, 0), 
                    titulo="La maquina suelta aceite", 
                    sintoma="Se detecta liquido cerca de la maquina",
                    tipo_fallo= TipoFallo.HIDRAULICO, 
                    prioridad=Prioridad.ALTA, maquina_parada= True, estado=EstadoAveria.ABIERTA,
                    id_averia=10)

    # act y assert
    servicio.validar_relaciones(imputacion, persona, averia)


# relacionas incorrectas
def test_relacion_no_validas(servicio):
     # arrange    
    persona = Persona("Luis", "Menendez", RolPersona.TECNICO, id_persona=2)

    imputacion = ImputacionHoras(id_averia=1, id_tecnico=5, fecha=date(2026, 10, 5), 
                                    horas= Decimal("0.25"), 
                                    descripcion_trabajo="Revision de fuga de aceite")

    averia = Averia(numero="AV-01", id_maquina=5, id_reportada_por=2, 
                    fecha_deteccion=datetime(2026, 10, 5, 5, 0), 
                    titulo="La maquina suelta aceite", 
                    sintoma="Se detecta liquido cerca de la maquina",
                    tipo_fallo= TipoFallo.HIDRAULICO, 
                    prioridad=Prioridad.ALTA, maquina_parada= True, estado=EstadoAveria.ABIERTA,
                    id_averia=10)

    # act y assert
    with pytest.raises(ValueError):
        servicio.validar_relaciones(imputacion, persona, averia)


def test_registrar_imputacion_valida(servicio):
    # Arrange
    persona = Persona(
        "Luis", "Menendez", RolPersona.TECNICO, id_persona=2
    )

    averia = Averia(
        numero="AV-01",
        id_maquina=5,
        id_reportada_por=2,
        fecha_deteccion=datetime(2026, 10, 5, 5, 0),
        titulo="Fuga de aceite",
        sintoma="Se detecta líquido cerca de la máquina",
        tipo_fallo=TipoFallo.HIDRAULICO,
        prioridad=Prioridad.ALTA,
        maquina_parada=True, estado=EstadoAveria.ABIERTA,
        id_averia=10
    )

    imputacion = ImputacionHoras(
        id_averia=10,
        id_tecnico=2,
        fecha=date(2026, 10, 5),
        horas=Decimal("1.25"),
        descripcion_trabajo="Revisión de fuga de aceite"
    )

    # Act y Assert
    servicio.registrar_imputacion(imputacion, persona, averia)