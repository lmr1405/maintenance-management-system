from datetime import date
from app.nucleo.modelo.enums import Criticidad, EstadoMaquina

class Maquina:
    def __init__(
            self,
            codigo: str,
            nombre: str,
            tipo: str,
            estado: EstadoMaquina,
            fabricante: str | None = None,
            modelo: str | None = None,
            numero_serie: str | None = None,
            ubicacion: str | None = None,
            fecha_puesta_marcha: date | None = None,
            criticidad: Criticidad | None = None,           
            id_maquina: int | None = None

    ):
        self.id_maquina = id_maquina
        self.codigo = codigo
        self.nombre = nombre
        self.tipo = tipo
        self.fabricante = fabricante
        self.modelo = modelo
        self.numero_serie = numero_serie
        self.ubicacion = ubicacion
        self.fecha_puesta_marcha = fecha_puesta_marcha
        self.criticidad = criticidad
        self.estado = estado