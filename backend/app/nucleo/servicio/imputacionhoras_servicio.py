from decimal import Decimal
from datetime import datetime, date
from app.nucleo.modelo.persona import Persona
from app.nucleo.modelo.imputacionhoras import ImputacionHoras
from app.nucleo.interfaces.iimputacionhoras_repositorio import IImputacionHorasRepositorio
from app.nucleo.modelo.averia import Averia
from app.nucleo.modelo.enums import RolPersona, EstadoAveria

class ImputacionHorasServicio:
    """
    Gestiona las validaciones de las imputaciones de horas
    realizadas por los tecnicos de mantenimiento
    """
    def __init__(self, repositorio: IImputacionHorasRepositorio):
        self.repositorio = repositorio


    def validar_fecha(self,fecha: date, fecha_deteccion: datetime) -> None:
        # Comprobar que la fecha de trabajo no sea anterior al dia en que se detecto
        if fecha < fecha_deteccion.date():
            raise ValueError(
                "La fecha de imputación no puede ser anterior a la deteccion de la averia"
                )


    
    def validar_horas(self, horas: Decimal) -> None:
        # Comprobar que las horas sean mayores que 0
        if horas <= 0:
            raise ValueError("Las horas tienen que ser mayor que cero")

        # comprobar que sean multiplos de 0.25
        if horas % Decimal("0.25") != 0:
            raise ValueError("Las horas deben ser múltiplos de 0.25")


    def validar_tecnico(self, persona: Persona) -> None:
        # Comprobar que la persona tenga el rol de técnico
        if persona.rol != RolPersona.TECNICO:
            raise ValueError("La persona debe ser un tecnico de mantenimiento")


    def validar_relaciones(self, imputacion: ImputacionHoras, persona: Persona, averia: Averia) -> None:
        # comprobamos que no sean nulos
        if (averia.id_averia is None or 
            imputacion.id_averia is None or 
            persona.id_persona is None or 
            imputacion.id_tecnico is None):
            raise ValueError("Los identificadores no pueden ser nulos")

        
        # validamos que los id coincidan
        if averia.id_averia != imputacion.id_averia:
            raise ValueError("La imputación no corresponde a la avería indicada")

        if persona.id_persona != imputacion.id_tecnico:
            raise ValueError("La imputación no corresponde al técnico indicado")

    def validar_estado_averia(self, averia: Averia) -> None:
        # Solo se permite registrar horas si la avería está en curso
        if averia.estado != EstadoAveria.EN_CURSO:
            raise ValueError(
                "Solo se pueden imputar horas a averías en curso"
            )

    def registrar_imputacion(self, imputacion: ImputacionHoras, persona: Persona, averia: Averia) -> None:
        self.validar_horas(imputacion.horas)
        self.validar_fecha(imputacion.fecha, averia.fecha_deteccion)
        self.validar_tecnico(persona)
        self.validar_relaciones(imputacion, persona, averia)

        # Comprobar que la avería esté en curso
        self.validar_estado_averia(averia)

        # guardar unicamente si todas las validaciones son correctas
        return self.repositorio.guardar(imputacion)