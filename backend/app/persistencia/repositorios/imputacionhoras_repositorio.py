from sqlalchemy import select
from sqlalchemy.orm import Session

from app.nucleo.interfaces.iimputacionhoras_repositorio import IImputacionHorasRepositorio
from app.nucleo.modelo.imputacionhoras import ImputacionHoras
from app.persistencia.modelo.imputacionhoras_orm import ImputacionHorasORM


class ImputacionHorasRepositorio(IImputacionHorasRepositorio):
    """Implementa la persistencia de imputaciones de horas."""

    def __init__(self, session: Session):
        self.session = session


    def guardar(self, imputacion: ImputacionHoras) -> ImputacionHoras:

        imputacion_orm = ImputacionHorasORM(
            id_averia=imputacion.id_averia,
            id_tecnico=imputacion.id_tecnico,
            fecha=imputacion.fecha,
            horas=imputacion.horas,
            descripcion_trabajo=imputacion.descripcion_trabajo
        )

        self.session.add(imputacion_orm)
        self.session.flush()

        imputacion.id_imputacion = imputacion_orm.id_imputacion

        return imputacion


    def obtener_por_id(self, id_imputacion: int) -> ImputacionHoras | None:

        imputacion_orm = self.session.get(
            ImputacionHorasORM, id_imputacion
        )

        if imputacion_orm is None:
            return None

        return self._a_entidad(imputacion_orm)



    def listar(self) -> list[ImputacionHoras]:

        consulta = select(ImputacionHorasORM)
        imputaciones_orm = self.session.scalars(consulta).all()

        return [self._a_entidad(i) for i in imputaciones_orm]


    def listar_por_averia(self, id_averia: int) -> list[ImputacionHoras]:

        consulta = select(ImputacionHorasORM).where(
            ImputacionHorasORM.id_averia == id_averia
        )

        imputaciones_orm = self.session.scalars(consulta).all()

        return [self._a_entidad(i) for i in imputaciones_orm]


    def listar_por_tecnico(self, id_tecnico: int) -> list[ImputacionHoras]:

        consulta = select(ImputacionHorasORM).where(
            ImputacionHorasORM.id_tecnico == id_tecnico
        )

        imputaciones_orm = self.session.scalars(consulta).all()

        return [self._a_entidad(i) for i in imputaciones_orm]


    def _a_entidad(
        self, imputacion_orm: ImputacionHorasORM
    ) -> ImputacionHoras:
        """Convierte un modelo ORM en una entidad del núcleo."""

        return ImputacionHoras(
            id_imputacion=imputacion_orm.id_imputacion,
            id_averia=imputacion_orm.id_averia,
            id_tecnico=imputacion_orm.id_tecnico,
            fecha=imputacion_orm.fecha,
            horas=imputacion_orm.horas,
            descripcion_trabajo=imputacion_orm.descripcion_trabajo
        )
