from sqlalchemy import select
from sqlalchemy.orm import Session

from app.nucleo.interfaces.ipersona_repositorio import IPersonaRepositorio
from app.nucleo.modelo.persona import Persona
from app.persistencia.modelo.persona_orm import PersonaORM


class PersonaRepositorio(IPersonaRepositorio):
    """Implementa la persistencia de personas mediante SQLAlchemy."""

    def __init__(self, session: Session):
        self.session = session


    def guardar(self, persona: Persona) -> Persona:

        persona_orm = PersonaORM(
            nombre=persona.nombre,
            apellidos=persona.apellidos,
            rol=persona.rol,
            especialidad=persona.especialidad,
            email=persona.email,
            telefono=persona.telefono,
            coste_hora=persona.coste_hora,
            activo=persona.activo
        )

        self.session.add(persona_orm)
        self.session.flush()

        persona.id_persona = persona_orm.id_persona

        return persona



    def obtener_por_id(self, id_persona: int) -> Persona | None:

        persona_orm = self.session.get(PersonaORM, id_persona)

        if persona_orm is None:
            return None

        return self._a_entidad(persona_orm)



    def listar(self) -> list[Persona]:

        consulta = select(PersonaORM)
        personas_orm = self.session.scalars(consulta).all()

        return [self._a_entidad(persona) for persona in personas_orm]



    def actualizar(self, persona: Persona) -> Persona:

        if persona.id_persona is None:
            raise ValueError("La persona no tiene identificador")

        persona_orm = self.session.get(PersonaORM, persona.id_persona)

        if persona_orm is None:
            raise ValueError("La persona no existe")

        persona_orm.nombre = persona.nombre
        persona_orm.apellidos = persona.apellidos
        persona_orm.rol = persona.rol
        persona_orm.especialidad = persona.especialidad
        persona_orm.email = persona.email
        persona_orm.telefono = persona.telefono
        persona_orm.coste_hora = persona.coste_hora
        persona_orm.activo = persona.activo

        self.session.flush()

        return persona



    def _a_entidad(self, persona_orm: PersonaORM) -> Persona:
        """Convierte un modelo ORM en una entidad del núcleo."""

        return Persona(
            id_persona=persona_orm.id_persona,
            nombre=persona_orm.nombre,
            apellidos=persona_orm.apellidos,
            rol=persona_orm.rol,
            especialidad=persona_orm.especialidad,
            email=persona_orm.email,
            telefono=persona_orm.telefono,
            coste_hora=persona_orm.coste_hora,
            activo=persona_orm.activo
        )
