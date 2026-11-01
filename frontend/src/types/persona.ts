/**
 * Archivo de definición de tipos e interfaces de personas.
 * Establece la estructura de los datos utilizados para registrar,
 * consultar y actualizar las personas del sistema de mantenimiento.
 *
 * Interfaces:
 * - PersonaCrear: define los datos necesarios para crear o actualizar
 *   una persona, incluyendo información personal y profesional.
 * - PersonaRespuesta: define los datos completos devueltos por FastAPI,
 *   incluyendo el identificador único y el estado de actividad.
 *
 * Funcionamiento:
 * - Utiliza los tipos RolPersona y Especialidad definidos en enums.ts.
 * - Registra el nombre, apellidos, rol y especialidad de cada persona.
 * - Permite almacenar datos de contacto y coste por hora.
 * - Permite campos opcionales o sin información mediante null.
 * - Diferencia los datos enviados al backend de los datos recibidos.
 * - Garantiza que los datos respeten los tipos definidos en TypeScript.
 */
import type { RolPersona, Especialidad } from "./enums";

// Datos enviados a FastAPI para registrar o actualizar una persona
export interface PersonaCrear {
    nombre: string;
    apellidos: string;
    rol: RolPersona;

    especialidad?: Especialidad | null;
    email?: string | null;
    telefono?: string | null;
    coste_hora?: string | null;
    activo?: boolean;
}

// Datos recibidos desde FastAPI
export interface PersonaRespuesta {
    id_persona: number;

    nombre: string;
    apellidos: string;
    rol: RolPersona;

    especialidad: Especialidad | null;
    email: string | null;
    telefono: string | null;
    coste_hora: string | null;
    activo: boolean;
}
