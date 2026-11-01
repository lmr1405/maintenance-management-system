from sqlalchemy import select, text, func
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.nucleo.interfaces.iaveria_repositorio import IAveriaRepositorio
from app.nucleo.modelo.averia import Averia
from app.persistencia.modelo.averia_orm import AveriaORM


class AveriaRepositorio(IAveriaRepositorio):
    """Implementa la persistencia de averías mediante SQLAlchemy."""

    def __init__(self, session: Session):
        self.session = session



    def guardar(self, averia: Averia) -> Averia:

        # Obtener un identificador según el motor de base de datos
        motor = self.session.get_bind().dialect.name

        if motor == "postgresql":
            # PostgreSQL: reservar un ID de su secuencia
            id_averia = self.session.execute(
                text("SELECT nextval(pg_get_serial_sequence('averias', 'id_averia'))")
            ).scalar_one()

        else:
            # SQLite: obtener el siguiente ID disponible para los tests
            id_averia = self.session.execute(
                select(func.coalesce(func.max(AveriaORM.id_averia), 0) + 1)
            ).scalar_one()

        # Generar el número de avería automáticamente
        anio = datetime.now(timezone.utc).year
        numero = f"AV-{anio}-{id_averia:04d}"

        # Actualizar la entidad del núcleo
        averia.id_averia = id_averia
        averia.numero = numero

        averia_orm = AveriaORM(
            id_averia=id_averia,
            numero=numero,
            id_maquina=averia.id_maquina,
            id_reportada_por=averia.id_reportada_por,
            id_tecnico_asignado=averia.id_tecnico_asignado,
            id_validada_por=averia.id_validada_por,
            fecha_deteccion=averia.fecha_deteccion,
            titulo=averia.titulo,
            sintoma=averia.sintoma,
            tipo_fallo=averia.tipo_fallo,
            prioridad=averia.prioridad,
            maquina_parada=averia.maquina_parada,
            estado=averia.estado,
            causa_raiz=averia.causa_raiz,
            solucion_aplicada=averia.solucion_aplicada,
            repuestos_sustituidos=averia.repuestos_sustituidos,
            tipo_solucion=averia.tipo_solucion,
            recomendacion_preventiva=averia.recomendacion_preventiva,
            fecha_resolucion=averia.fecha_resolucion,
            fecha_cierre=averia.fecha_cierre
        )

        # Guardar la avería con su número generado automáticamente
        self.session.add(averia_orm)
        self.session.flush()

        return averia                   



    def obtener_por_id(self, id_averia: int) -> Averia | None:

        averia_orm = self.session.get(AveriaORM, id_averia)

        if averia_orm is None:
            return None

        return self._a_entidad(averia_orm)



    def listar(self) -> list[Averia]:

        consulta = select(AveriaORM)
        averias_orm = self.session.scalars(consulta).all()

        return [self._a_entidad(averia) for averia in averias_orm]



    def listar_por_maquina(self, id_maquina: int) -> list[Averia]:

        consulta = select(AveriaORM).where(
            AveriaORM.id_maquina == id_maquina
        )

        averias_orm = self.session.scalars(consulta).all()

        return [self._a_entidad(averia) for averia in averias_orm]



    def actualizar(self, averia: Averia) -> Averia:

        if averia.id_averia is None:
            raise ValueError("La avería no tiene identificador")

        averia_orm = self.session.get(AveriaORM, averia.id_averia)

        if averia_orm is None:
            raise ValueError("La avería no existe")

        averia_orm.numero = averia.numero
        averia_orm.id_maquina = averia.id_maquina
        averia_orm.id_reportada_por = averia.id_reportada_por
        averia_orm.id_tecnico_asignado = averia.id_tecnico_asignado
        averia_orm.id_validada_por = averia.id_validada_por
        averia_orm.fecha_deteccion = averia.fecha_deteccion
        averia_orm.titulo = averia.titulo
        averia_orm.sintoma = averia.sintoma
        averia_orm.tipo_fallo = averia.tipo_fallo
        averia_orm.prioridad = averia.prioridad
        averia_orm.maquina_parada = averia.maquina_parada
        averia_orm.estado = averia.estado
        averia_orm.causa_raiz = averia.causa_raiz
        averia_orm.solucion_aplicada = averia.solucion_aplicada
        averia_orm.repuestos_sustituidos = averia.repuestos_sustituidos
        averia_orm.tipo_solucion = averia.tipo_solucion
        averia_orm.recomendacion_preventiva = averia.recomendacion_preventiva
        averia_orm.fecha_resolucion = averia.fecha_resolucion
        averia_orm.fecha_cierre = averia.fecha_cierre

        self.session.flush()

        return averia



    def _a_entidad(self, averia_orm: AveriaORM) -> Averia:
        """Convierte un modelo ORM en una entidad del núcleo."""

        return Averia(
            id_averia=averia_orm.id_averia,
            numero=averia_orm.numero,
            id_maquina=averia_orm.id_maquina,
            id_reportada_por=averia_orm.id_reportada_por,
            id_tecnico_asignado=averia_orm.id_tecnico_asignado,
            id_validada_por=averia_orm.id_validada_por,
            fecha_deteccion=averia_orm.fecha_deteccion,
            titulo=averia_orm.titulo,
            sintoma=averia_orm.sintoma,
            tipo_fallo=averia_orm.tipo_fallo,
            prioridad=averia_orm.prioridad,
            maquina_parada=averia_orm.maquina_parada,
            estado=averia_orm.estado,
            causa_raiz=averia_orm.causa_raiz,
            solucion_aplicada=averia_orm.solucion_aplicada,
            repuestos_sustituidos=averia_orm.repuestos_sustituidos,
            tipo_solucion=averia_orm.tipo_solucion,
            recomendacion_preventiva=averia_orm.recomendacion_preventiva,
            fecha_resolucion=averia_orm.fecha_resolucion,
            fecha_cierre=averia_orm.fecha_cierre
        )
