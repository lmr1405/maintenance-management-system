from app.nucleo.interfaces.imaquina_repositorio import IMaquinaRepositorio
from app.nucleo.modelo.maquina import Maquina
from app.nucleo.modelo.enums import EstadoMaquina


class MaquinaServicio:
    """Gestiona las operaciones y reglas de negocio de las máquinas."""

    def __init__(self, repositorio: IMaquinaRepositorio):
        self.repositorio = repositorio



    def registrar_maquina(self, maquina: Maquina) -> Maquina:
        # Comprobar los campos obligatorios
        if not maquina.codigo.strip():
            raise ValueError("El código de la máquina es obligatorio")

        if not maquina.nombre.strip():
            raise ValueError("El nombre de la máquina es obligatorio")

        if not maquina.tipo.strip():
            raise ValueError("El tipo de máquina es obligatorio")

        # Comprobar que no exista otra máquina con el mismo código
        for existente in self.repositorio.listar():
            if existente.codigo == maquina.codigo:
                raise ValueError("Ya existe una máquina con ese código")

        return self.repositorio.guardar(maquina)



    def obtener_por_id(self, id_maquina: int) -> Maquina | None:
        return self.repositorio.obtener_por_id(id_maquina)



    def listar(self) -> list[Maquina]:
        return self.repositorio.listar()



    def actualizar_maquina(self, maquina: Maquina) -> Maquina:
        # Comprobar que existe la máquina
        existente = self.repositorio.obtener_por_id(maquina.id_maquina)

        if existente is None:
            raise ValueError("La máquina no existe")

        # Comprobar que el código no pertenezca a otra máquina
        for otra in self.repositorio.listar():
            if otra.codigo == maquina.codigo and otra.id_maquina != maquina.id_maquina:
                raise ValueError("Ya existe otra máquina con ese código")

        if not maquina.codigo.strip() or not maquina.nombre.strip() or not maquina.tipo.strip():
            raise ValueError("Código, nombre y tipo son obligatorios")

        return self.repositorio.actualizar(maquina)



    def dar_baja(self, id_maquina: int) -> Maquina:
        # Recuperar la máquina
        maquina = self.repositorio.obtener_por_id(id_maquina)

        if maquina is None:
            raise ValueError("La máquina no existe")

        # Baja lógica: no se elimina de PostgreSQL
        maquina.estado = EstadoMaquina.DE_BAJA

        return self.repositorio.actualizar(maquina)
