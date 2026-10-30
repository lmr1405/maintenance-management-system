from abc import ABC, abstractmethod

from app.nucleo.modelo.imputacionhoras import ImputacionHoras


class IImputacionHorasRepositorio(ABC):
    """Define las operaciones de persistencia de imputaciones de horas."""

    @abstractmethod
    def guardar(self, imputacion: ImputacionHoras) -> ImputacionHoras:
        pass

    @abstractmethod
    def obtener_por_id(self, id_imputacion: int) -> ImputacionHoras | None:
        pass

    @abstractmethod
    def listar(self) -> list[ImputacionHoras]:
        pass

    @abstractmethod
    def listar_por_averia(self, id_averia: int) -> list[ImputacionHoras]:
        pass

    @abstractmethod
    def listar_por_tecnico(self, id_tecnico: int) -> list[ImputacionHoras]:
        pass