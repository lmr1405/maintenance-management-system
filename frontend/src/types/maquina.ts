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