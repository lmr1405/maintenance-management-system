// Criticidad de una máquina
export type Criticidad =
    | "Alta"
    | "Media"
    | "Baja";

// Estados posibles de una máquina
export type EstadoMaquina =
    | "Operativa"
    | "En avería"
    | "Fuera de servicio"
    | "De baja";

// Roles de las personas
export type RolPersona =
    | "Técnico de mantenimiento"
    | "Operario"
    | "Responsable";

// Especialidad de los técnicos
export type Especialidad =
    | "Mecánica"
    | "Eléctrica"
    | "Electrónica"
    | "Hidráulica"
    | "Neumática";

// Tipos de fallo
export type TipoFallo =
    | "Mecánico"
    | "Eléctrico"
    | "Electrónico"
    | "Hidráulico"
    | "Neumático"
    | "Software"
    | "Otro";

// Prioridades de una avería
export type Prioridad =
    | "Urgente"
    | "Alta"
    | "Media"
    | "Baja";

// Estados de una avería
export type EstadoAveria =
    | "Abierta"
    | "Asignada"
    | "En curso"
    | "Resuelta"
    | "Cerrada";

// Tipos de solución
export type TipoSolucion =
    | "Reparación definitiva"
    | "Reparación provisional"
    | "Sustitución"
    | "Ajuste";