from abc import ABC, abstractmethod

from app.nucleo.modelo.averia import Averia


class IAveriaRepositorio(ABC):
    """Define las operaciones de persistencia de averías."""

    @abstractmethod
    def guardar(self, averia: Averia) -> Averia:
        pass

    @abstractmethod
    def obtener_por_id(self, id_averia: int) -> Averia | None:
        pass

    @abstractmethod
    def listar(self) -> list[Averia]:
        pass

    @abstractmethod
    def listar_por_maquina(self, id_maquina: int) -> list[Averia]:
        pass

    @abstractmethod
    def actualizar(self, averia: Averia) -> Averia:
        pass