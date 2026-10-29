from decimal import Decimal

class Persona:
    def __init__(
            self,
            nombre: str,
            apellidos: str,
            rol: str,
            especialidad: str | None = None,
            email: str | None = None,
            telefono: str | None = None,
            coste_hora: Decimal | None = None,
            activo: bool = True,
            id_persona: int | None = None
    ):
        self.id_persona = id_persona
        self.nombre = nombre
        self.apellidos= apellidos
        self.rol = rol
        self.especialidad = especialidad
        self.telefono = telefono
        self.coste_hora = coste_hora
        self.activo = activo