/**
 * Archivo de definición de tipos e interfaces de máquinas.
 * Establece la estructura de los datos utilizados para registrar,
 * consultar y actualizar las máquinas de mantenimiento.
 *
 * Interfaces:
 * - MaquinaCrear: define los datos necesarios para crear o actualizar
 *   una máquina, incluyendo información técnica y campos opcionales.
 * - MaquinaRespuesta: define los datos completos devueltos por FastAPI,
 *   incluyendo el identificador único y el estado de la máquina.
 *
 * Funcionamiento:
 * - Utiliza los tipos Criticidad y EstadoMaquina definidos en enums.ts.
 * - Registra información de identificación, ubicación y características técnicas.
 * - Permite campos opcionales o sin información mediante null.
 * - Diferencia los datos enviados al backend de los datos recibidos.
 * - Garantiza que los datos respeten los tipos definidos en TypeScript.
 */
import type { Criticidad, EstadoMaquina } from "./enums";

// Datos enviados a FastAPI para crear o actualizar una máquina
export interface MaquinaCrear {
    codigo: string;
    nombre: string;
    tipo: string;

    fabricante?: string | null;
    modelo?: string | null;
    numero_serie?: string | null;
    ubicacion?: string | null;
    fecha_puesta_marcha?: string | null;
    criticidad?: Criticidad | null;

    estado?: EstadoMaquina;
}

// Datos recibidos desde FastAPI al consultar una máquina
export interface MaquinaRespuesta {
    id_maquina: number;

    codigo: string;
    nombre: string;
    tipo: string;

    fabricante: string | null;
    modelo: string | null;
    numero_serie: string | null;
    ubicacion: string | null;
    fecha_puesta_marcha: string | null;
    criticidad: Criticidad | null;

    estado: EstadoMaquina;
}