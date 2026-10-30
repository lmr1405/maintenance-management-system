from abc import ABC, abstractmethod

from app.nucleo.modelo.persona import Persona


class IPersonaRepositorio(ABC):
    """Define las operaciones de persistencia de personas."""

    @abstractmethod
    def guardar(self, persona: Persona) -> Persona:
        pass

    @abstractmethod
    def obtener_por_id(self, id_persona: int) -> Persona | None:
        pass

    @abstractmethod
    def listar(self) -> list[Persona]:
        pass

    @abstractmethod
    def actualizar(self, persona: Persona) -> Persona:
        pass
