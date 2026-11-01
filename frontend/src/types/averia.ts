/**
 * Archivo de definición de tipos e interfaces de averías.
 * Establece la estructura de los datos utilizados para registrar,
 * consultar y gestionar las averías en la aplicación.
 *
 * Interfaces:
 * - AveriaCrear: define los datos necesarios para registrar una avería.
 * - AveriaRespuesta: define los datos completos devueltos por FastAPI.
 * - AsignarTecnico: establece el identificador del técnico asignado.
 * - ResolverAveria: define los datos necesarios para resolver una avería.
 * - CerrarAveria: establece el identificador del responsable del cierre.
 *
 * Funcionamiento:
 * - Utiliza los tipos y enumeraciones definidos en enums.ts.
 * - El número de avería se genera automáticamente en el backend.
 * - Permite representar datos opcionales o pendientes mediante null.
 * - Incluye el tiempo de parada calculado por el backend.
 * - Garantiza que los datos utilizados en TypeScript respeten
 *   las estructuras definidas para las operaciones con averías.
 */
import type { TipoFallo, Prioridad, EstadoAveria, TipoSolucion } from "./enums";

// Datos necesarios para registrar una avería
// El número se genera automáticamente en el backend
export interface AveriaCrear {
    id_maquina: number;
    id_reportada_por: number;

    fecha_deteccion: string;
    titulo: string;
    sintoma: string;

    tipo_fallo: TipoFallo;
    prioridad: Prioridad;
    maquina_parada: boolean;
}


// Datos que devuelve FastAPI
export interface AveriaRespuesta extends AveriaCrear {
    id_averia: number;
    numero: string;
    estado: EstadoAveria;

    id_tecnico_asignado: number | null;
    id_validada_por: number | null;

    causa_raiz: string | null;
    solucion_aplicada: string | null;
    repuestos_sustituidos: string | null;
    tipo_solucion: TipoSolucion | null;
    recomendacion_preventiva: string | null;

    fecha_resolucion: string | null;
    fecha_cierre: string | null;

    // Tiempo de parada calculado por el backend (horas)
    tiempo_parada_horas: number | null;
}


// Datos para asignar un técnico
export interface AsignarTecnico {
    id_tecnico: number;
}


// Datos para resolver una avería
export interface ResolverAveria {
    id_tecnico: number;
    causa_raiz: string;
    solucion_aplicada: string;

    // Información adicional de la reparación
    repuestos_sustituidos?: string | null;
    tipo_solucion?: TipoSolucion | null;
    recomendacion_preventiva?: string | null;
}


// Datos para cerrar una avería
export interface CerrarAveria {
    id_responsable: number;
}
