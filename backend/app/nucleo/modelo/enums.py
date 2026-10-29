from enum import Enum

# Criticidad de una máquina
class Criticidad(str, Enum):
    ALTA = "Alta"
    MEDIA = "Media"
    BAJA = "Baja"


# Estados posibles de una máquina
class EstadoMaquina(str, Enum):
    OPERATIVA = "Operativa"
    EN_AVERIA = "En avería"
    FUERA_SERVICIO = "Fuera de servicio"
    DE_BAJA = "De baja"


# Roles de las personas
class RolPersona(str, Enum):
    TECNICO = "Técnico de mantenimiento"
    OPERARIO = "Operario"
    RESPONSABLE = "Responsable"


# Especialidad de los técnicos
class Especialidad(str, Enum):
    MECANICA = "Mecánica"
    ELECTRICA = "Eléctrica"
    ELECTRONICA = "Electrónica"
    HIDRAULICA = "Hidráulica"
    NEUMATICA = "Neumática"


# Tipos de fallo
class TipoFallo(str, Enum):
    MECANICO = "Mecánico"
    ELECTRICO = "Eléctrico"
    ELECTRONICO = "Electrónico"
    HIDRAULICO = "Hidráulico"
    NEUMATICO = "Neumático"
    SOFTWARE = "Software"
    OTRO = "Otro"


# Prioridades de una avería
class Prioridad(str, Enum):
    URGENTE = "Urgente"
    ALTA = "Alta"
    MEDIA = "Media"
    BAJA = "Baja"

# Estados de una avería
class EstadoAveria(str, Enum):
    ABIERTA = "Abierta"
    ASIGNADA = "Asignada"
    EN_CURSO = "En curso"
    RESUELTA = "Resuelta"
    CERRADA = "Cerrada"

# Tipos de solución
class TipoSolucion(str, Enum):
    DEFINITIVA = "Reparación definitiva"
    PROVISIONAL = "Reparación provisional"
    SUSTITUCION = "Sustitución"
    AJUSTE = "Ajuste"

