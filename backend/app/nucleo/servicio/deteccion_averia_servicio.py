from app.nucleo.interfaces.iaveria_repositorio import IAveriaRepositorio
from app.nucleo.interfaces.imaquina_repositorio import IMaquinaRepositorio
from app.nucleo.interfaces.ipersona_repositorio import IPersonaRepositorio

from app.nucleo.modelo.averia import Averia
from app.nucleo.modelo.enums import EstadoAveria, EstadoMaquina, RolPersona


class DeteccionAveriaServicio:
    """Gestiona el registro y la asignación inicial de averías."""

    def __init__(
        self,
        averias: IAveriaRepositorio,
        maquinas: IMaquinaRepositorio,
        personas: IPersonaRepositorio
    ):
        self.averias = averias
        self.maquinas = maquinas
        self.personas = personas



    def registrar_averia(self, averia: Averia) -> Averia:
        # Comprobar que la máquina existe y no está dada de baja
        maquina = self.maquinas.obtener_por_id(averia.id_maquina)

        if maquina is None:
            raise ValueError("La máquina no existe")

        if maquina.estado == EstadoMaquina.DE_BAJA:
            raise ValueError("La máquina está dada de baja")

        # Comprobar que la persona que reporta está activa
        persona = self.personas.obtener_por_id(averia.id_reportada_por)

        if persona is None or not persona.activo:
            raise ValueError("La persona que reporta no existe o está inactiva")

        if not averia.titulo.strip() or not averia.sintoma.strip():
            raise ValueError("El título y el síntoma son obligatorios")

        if averia.estado != EstadoAveria.ABIERTA:
            raise ValueError("Una avería nueva debe comenzar abierta")

        # Registrar la avería
        resultado = self.averias.guardar(averia)

        # Actualizar la máquina si queda parada
        if averia.maquina_parada:
            maquina.estado = EstadoMaquina.EN_AVERIA
            self.maquinas.actualizar(maquina)

        return resultado



    def asignar_tecnico(self, id_averia: int, id_tecnico: int) -> Averia:
        averia = self.averias.obtener_por_id(id_averia)
        persona = self.personas.obtener_por_id(id_tecnico)

        if averia is None:
            raise ValueError("La avería no existe")

        if averia.estado != EstadoAveria.ABIERTA:
            raise ValueError("La avería debe estar abierta")

        if persona is None or not persona.activo or persona.rol != RolPersona.TECNICO:
            raise ValueError("Debe asignarse un técnico activo")

        averia.id_tecnico_asignado = id_tecnico
        averia.estado = EstadoAveria.ASIGNADA

        return self.averias.actualizar(averia)



    def obtener_por_id(self, id_averia: int) -> Averia | None:
        return self.averias.obtener_por_id(id_averia)



    def listar(self) -> list[Averia]:
        return self.averias.listar()



    def listar_por_maquina(self, id_maquina: int) -> list[Averia]:
        return self.averias.listar_por_maquina(id_maquina)
