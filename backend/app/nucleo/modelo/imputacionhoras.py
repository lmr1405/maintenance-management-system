from datetime import date
from decimal import Decimal


class ImputacionHoras:

    def __init__(
        self,
        id_averia: int,
        id_tecnico: int,
        fecha: date,
        horas: Decimal,
        descripcion_trabajo: str,
        id_imputacion: int | None = None
    ):
        self.id_imputacion = id_imputacion
        self.id_averia = id_averia
        self.id_tecnico = id_tecnico
        self.fecha = fecha
        self.horas = horas
        self.descripcion_trabajo = descripcion_trabajo