from abc import ABC, abstractmethod

from app.nucleo.modelo.maquina import Maquina

class IMaquinaRepositorio(ABC):
    """Define las operaciones de persistencia de maquinas"""

    @abstractmethod
    def guardar(self, maquina: Maquina) -> Maquina:
        pass

    @abstractmethod
    def obtener_por_id(self, id_maquina: int) -> Maquina | None:
        pass

    @abstractmethod
    def listar(self) -> list[Maquina]:
        pass

    @abstractmethod
    def actualizar(self, maquina: Maquina) -> Maquina:
        pass