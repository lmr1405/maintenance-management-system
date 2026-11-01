/**
 * Archivo de definición de tipos e interfaces de imputaciones de horas.
 * Establece la estructura de los datos utilizados para registrar
 * y consultar las horas de trabajo dedicadas a las reparaciones.
 *
 * Interfaces:
 * - ImputacionHorasCrear: define los datos necesarios para registrar
 *   las horas trabajadas por un técnico en una avería.
 * - ImputacionHorasRespuesta: define los datos devueltos por FastAPI,
 *   incluyendo el identificador único de la imputación.
 *
 * Funcionamiento:
 * - Relaciona cada imputación con una avería y un técnico.
 * - Registra la fecha, las horas y la descripción del trabajo realizado.
 * - Garantiza que los datos respeten los tipos definidos en TypeScript.
 */
// Datos necesarios para registrar una imputación de horas
export interface ImputacionHorasCrear {
    id_averia: number;
    id_tecnico: number;

    fecha: string;
    horas: string;
    descripcion_trabajo: string;
}


// Datos que devuelve FastAPI
export interface ImputacionHorasRespuesta extends ImputacionHorasCrear {
    id_imputacion: number;
}
