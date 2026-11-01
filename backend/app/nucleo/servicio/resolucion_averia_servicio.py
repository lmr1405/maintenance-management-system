from datetime import datetime, timezone

from app.nucleo.interfaces.iaveria_repositorio import IAveriaRepositorio
from app.nucleo.interfaces.imaquina_repositorio import IMaquinaRepositorio
from app.nucleo.interfaces.ipersona_repositorio import IPersonaRepositorio

from app.nucleo.modelo.averia import Averia
from app.nucleo.modelo.enums import EstadoAveria, EstadoMaquina, RolPersona, TipoSolucion


class ResolucionAveriaServicio:
    """Gestiona la reparación, resolución y cierre de averías."""

    def __init__(
        self,
        averias: IAveriaRepositorio,
        maquinas: IMaquinaRepositorio,
        personas: IPersonaRepositorio
    ):
        self.averias = averias
        self.maquinas = maquinas
        self.personas = personas


    def iniciar_reparacion(self, id_averia: int) -> Averia:
        averia = self._obtener_averia(id_averia)

        if averia.estado != EstadoAveria.ASIGNADA:
            raise ValueError("La avería debe estar asignada")

        if averia.id_tecnico_asignado is None:
            raise ValueError("La avería no tiene técnico asignado")

        averia.estado = EstadoAveria.EN_CURSO

        return self.averias.actualizar(averia)


    def resolver_averia(
        self,
        id_averia: int,
        id_tecnico: int,
        causa_raiz: str,
        solucion_aplicada: str,
        repuestos_sustituidos: str | None = None,
        tipo_solucion: TipoSolucion | None = None,
        recomendacion_preventiva: str | None = None
    ) -> Averia:
        averia = self._obtener_averia(id_averia)

        # Comprobar que la avería esté en curso
        if averia.estado != EstadoAveria.EN_CURSO:
            raise ValueError("La avería debe estar en curso")

          # Comprobar que el técnico sea el asignado a la avería
        if averia.id_tecnico_asignado != id_tecnico:
            raise ValueError(
            "Solo el técnico asignado puede resolver la avería"
        )

        # Comprobar que sea un técnico activo
        tecnico = self.personas.obtener_por_id(id_tecnico)

        if tecnico is None or not tecnico.activo or tecnico.rol != RolPersona.TECNICO:
            raise ValueError(
                "La resolución requiere un técnico activo"
        )

        # Comprobar los datos obligatorios de la resolución
        if not causa_raiz.strip():
            raise ValueError("La causa raíz es obligatoria")

        if not solucion_aplicada.strip():
            raise ValueError("La solución aplicada es obligatoria")

        # Registrar los datos de resolución
        averia.causa_raiz = causa_raiz
        averia.solucion_aplicada = solucion_aplicada

        # Información adicional de la reparación
        averia.repuestos_sustituidos = repuestos_sustituidos
        averia.tipo_solucion = tipo_solucion
        averia.recomendacion_preventiva = recomendacion_preventiva

        # Fecha automática y cambio de estado
        averia.fecha_resolucion = datetime.now(timezone.utc)
        averia.estado = EstadoAveria.RESUELTA

        resultado = self.averias.actualizar(averia)

        # Comprobar si hay otras averías que mantienen parada la máquina
        otras_averias = self.averias.listar_por_maquina(averia.id_maquina)

        hay_paradas_pendientes = any(
            otra.id_averia != averia.id_averia
            and otra.maquina_parada
            and otra.estado not in (EstadoAveria.RESUELTA, EstadoAveria.CERRADA)
            for otra in otras_averias
        )

        # Recuperar el estado operativo si no hay más paradas
        if averia.maquina_parada and not hay_paradas_pendientes:
            maquina = self.maquinas.obtener_por_id(averia.id_maquina)

            if maquina is not None and maquina.estado == EstadoMaquina.EN_AVERIA:
                maquina.estado = EstadoMaquina.OPERATIVA
                self.maquinas.actualizar(maquina)

        return resultado


    def cerrar_averia(self, id_averia: int, id_responsable: int) -> Averia:
        averia = self._obtener_averia(id_averia)
        persona = self.personas.obtener_por_id(id_responsable)

        if averia.estado != EstadoAveria.RESUELTA:
            raise ValueError("La avería debe estar resuelta")

        if persona is None or not persona.activo or persona.rol != RolPersona.RESPONSABLE:
            raise ValueError("El cierre requiere un responsable activo")

        averia.id_validada_por = id_responsable
        averia.fecha_cierre = datetime.now(timezone.utc)
        averia.estado = EstadoAveria.CERRADA

        return self.averias.actualizar(averia)



    def _obtener_averia(self, id_averia: int) -> Averia:
        """Recupera una avería o lanza una excepción."""

        averia = self.averias.obtener_por_id(id_averia)

        if averia is None:
            raise ValueError("La avería no existe")

        return averia
