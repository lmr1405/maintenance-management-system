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
