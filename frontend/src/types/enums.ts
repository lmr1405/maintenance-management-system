/**
 * Archivo de definición de tipos enumerados (enums).
 * Establece los valores permitidos para los diferentes estados,
 * categorías y clasificaciones utilizados en la aplicación.
 *
 * Tipos:
 * - Criticidad: establece el nivel de importancia de una máquina.
 * - EstadoMaquina: define los posibles estados de una máquina.
 * - RolPersona: identifica la función de cada persona en el mantenimiento.
 * - Especialidad: define las especialidades de los técnicos.
 * - TipoFallo: clasifica las averías según su naturaleza.
 * - Prioridad: establece la urgencia de atención de una avería.
 * - EstadoAveria: define las etapas del ciclo de vida de una avería.
 * - TipoSolucion: clasifica la solución aplicada durante una reparación.
 *
 * Funcionamiento:
 * - Limita los valores permitidos para cada tipo de dato.
 * - Evita utilizar estados o categorías no definidos.
 * - Mantiene criterios uniformes entre los componentes de la aplicación.
 * - Facilita la validación de tipos durante el desarrollo con TypeScript.
 */
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