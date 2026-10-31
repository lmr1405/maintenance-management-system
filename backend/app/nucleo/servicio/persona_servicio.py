from app.nucleo.interfaces.ipersona_repositorio import IPersonaRepositorio
from app.nucleo.modelo.persona import Persona


class PersonaServicio:
    """Gestiona las operaciones y reglas de negocio de las personas."""

    def __init__(self, repositorio: IPersonaRepositorio):
        self.repositorio = repositorio



    def validar_persona(self, persona: Persona) -> None:
        # Comprobar datos obligatorios
        if not persona.nombre.strip():
            raise ValueError("El nombre es obligatorio")

        if not persona.apellidos.strip():
            raise ValueError("Los apellidos son obligatorios")

        # Comprobar que el coste por hora no sea negativo
        if persona.coste_hora is not None and persona.coste_hora < 0:
            raise ValueError("El coste por hora no puede ser negativo")



    def registrar_persona(self, persona: Persona) -> Persona:
        self.validar_persona(persona)

        return self.repositorio.guardar(persona)



    def obtener_por_id(self, id_persona: int) -> Persona | None:
        return self.repositorio.obtener_por_id(id_persona)



    def listar(self) -> list[Persona]:
        return self.repositorio.listar()



    def actualizar_persona(self, persona: Persona) -> Persona:
        # Comprobar que existe la persona
        existente = self.repositorio.obtener_por_id(persona.id_persona)

        if existente is None:
            raise ValueError("La persona no existe")

        self.validar_persona(persona)

        return self.repositorio.actualizar(persona)



    def desactivar_persona(self, id_persona: int) -> Persona:
        # Recuperar la persona
        persona = self.repositorio.obtener_por_id(id_persona)

        if persona is None:
            raise ValueError("La persona no existe")

        # Baja lógica para conservar el historial
        persona.activo = False

        return self.repositorio.actualizar(persona)
