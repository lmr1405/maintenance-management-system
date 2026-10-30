from sqlalchemy.orm import Session
from sqlalchemy import select

from app.nucleo.interfaces.imaquina_repositorio import IMaquinaRepositorio
from app.nucleo.modelo.maquina import Maquina
from app.persistencia.modelo.maquina_orm import MaquinaORM


class MaquinaRepositorio(IMaquinaRepositorio):
    """Implementa el repositorio de maquinas mediante SQLAlchemy"""

    def __init__(self, session: Session):
        self.sesion = self.sesion

    
    def guardar(self, maquina: Maquina) -> Maquina:
        # convertir la entidad del nucleo en un modelo ORM
        maquina_orm = MaquinaORM(
            codigo= maquina.codigo,
            nombre= maquina.nombre,
            tipo= maquina.tipo,
            fabricante= maquina.fabricante,
            modelo= maquina.modelo,
            numero_serie= maquina.numero_serie,
            ubicacion= maquina.ubicacion,
            fecha_puesta_marcha= maquina.fecha_puesta_marcha,
            criticidad= maquina.criticidad,
            estado= maquina.estado
        )

        # registrar la maquina en la sesion
        self.sesion.add(maquina_orm)

        self.sesion.flush()

        # recuperar el identificador generado por PostgreSQL
        maquina.id_maquina = maquina_orm.id_maquina

        return maquina

   
    def _a_entidad(self, maquina_orm: MaquinaORM) -> Maquina:
            """Convierte un modelo ORM en una entidad del núcleo."""
    
            return Maquina(
                id_maquina=maquina_orm.id_maquina,
                codigo=maquina_orm.codigo,
                nombre=maquina_orm.nombre,
                tipo=maquina_orm.tipo,
                fabricante=maquina_orm.fabricante,
                modelo=maquina_orm.modelo,
                numero_serie=maquina_orm.numero_serie,
                ubicacion=maquina_orm.ubicacion,
                fecha_puesta_marcha=maquina_orm.fecha_puesta_marcha,
                criticidad=maquina_orm.criticidad,
                estado=maquina_orm.estado
            )

    
    def obtener_por_id(self, id_maquina: int) -> Maquina | None:

        # Buscar la máquina en PostgreSQL
        maquina_orm = self.session.get(MaquinaORM, id_maquina)

        if maquina_orm is None:
            return None

        # Convertir el modelo ORM en una entidad del núcleo
        return self._a_entidad(maquina_orm)


    def listar(self) -> list[Maquina]:

        # Preparar la consulta de todas las máquinas
        consulta = select(MaquinaORM)

        # Ejecutar la consulta y obtener los registros
        maquinas_orm = self.session.scalars(consulta).all()

        return [self._a_entidad(maquinas_orm) for maquina_orm in maquinas_orm]

   
   
    def actualizar(self, maquina: Maquina) -> Maquina:

        # Comprobar que la máquina tiene un identificador
        if maquina.id_maquina is None:
            raise ValueError("La máquina no tiene un identificador")

        # Buscar la máquina existente en PostgreSQL
        maquina_orm = self.session.get(MaquinaORM, maquina.id_maquina)

        if maquina_orm is None:
            raise ValueError("La máquina no existe")

        # Actualizar los atributos del modelo ORM
        maquina_orm.codigo = maquina.codigo
        maquina_orm.nombre = maquina.nombre
        maquina_orm.tipo = maquina.tipo
        maquina_orm.fabricante = maquina.fabricante
        maquina_orm.modelo = maquina.modelo
        maquina_orm.numero_serie = maquina.numero_serie
        maquina_orm.ubicacion = maquina.ubicacion
        maquina_orm.fecha_puesta_marcha = maquina.fecha_puesta_marcha
        maquina_orm.criticidad = maquina.criticidad
        maquina_orm.estado = maquina.estado

        # Enviar los cambios a PostgreSQL sin confirmar la transacción
        self.session.flush()

        return maquina