from datetime import datetime
from app.nucleo.modelo.enums import Prioridad, EstadoAveria, TipoSolucion, TipoFallo

class Averia:
    def __init__(
            self,
            id_maquina: int,
            id_reportada_por: int,
            fecha_deteccion: datetime,
            titulo: str,
            sintoma: str,
            tipo_fallo: TipoFallo,
            prioridad: Prioridad,
            maquina_parada: bool,
            estado: EstadoAveria,
            id_averia: int | None = None,            
            numero: str | None = None,
            id_tecnico_asignado: int | None = None,
            id_validada_por: int | None = None,
            causa_raiz: str | None = None,
            solucion_aplicada: str | None = None,
            repuestos_sustituidos: str | None = None,
            tipo_solucion: TipoSolucion | None = None,
            recomendacion_preventiva: str | None = None,
            fecha_resolucion: datetime | None = None,
            fecha_cierre: datetime | None= None
            
    ):
        # Identificación y detección de la avería
        self.id_averia = id_averia
        self.numero = numero
        self.id_maquina = id_maquina
        self.id_reportada_por = id_reportada_por
        self.fecha_deteccion = fecha_deteccion
        self.titulo = titulo
        self.sintoma = sintoma
        self.tipo_fallo = tipo_fallo
        self.prioridad = prioridad
        self.maquina_parada = maquina_parada

        # Estado y personas responsables
        self.estado = estado
        self.id_tecnico_asignado = id_tecnico_asignado
        self.id_validada_por = id_validada_por

        # Resolución de la avería
        self.causa_raiz = causa_raiz
        self.solucion_aplicada = solucion_aplicada
        self.repuestos_sustituidos = repuestos_sustituidos
        self.tipo_solucion = tipo_solucion
        self.recomendacion_preventiva = recomendacion_preventiva
        self.fecha_resolucion = fecha_resolucion
        self.fecha_cierre = fecha_cierre