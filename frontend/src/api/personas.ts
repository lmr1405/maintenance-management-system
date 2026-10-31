import { API_URL } from "./cliente";
import type { PersonaCrear, PersonaRespuesta } from "../types/persona";

// Obtener todas las personas (GET)
export async function obtenerPersonas(): Promise<PersonaRespuesta[]> {
    const respuesta = await fetch(`${API_URL}/personas`);

    if (!respuesta.ok) {
        throw new Error("Error al obtener las personas");
    }

    return respuesta.json();
}

// Obtener una persona por su ID (GET)
export async function obtenerPersona(id: number): Promise<PersonaRespuesta> {
    const respuesta = await fetch(`${API_URL}/personas/${id}`);

    if (!respuesta.ok) {
        throw new Error("Error al obtener la persona");
    }

    return respuesta.json();
}

// Registrar una persona (POST)
export async function crearPersona(datos: PersonaCrear): Promise<PersonaRespuesta> {
    const respuesta = await fetch(`${API_URL}/personas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error("Error al registrar la persona");
    }

    return respuesta.json();
}

// Actualizar una persona (PUT)
export async function actualizarPersona(
    id: number,
    datos: PersonaCrear
): Promise<PersonaRespuesta> {

    const respuesta = await fetch(`${API_URL}/personas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error("Error al actualizar la persona");
    }

    return respuesta.json();
}

// Desactivar una persona (PATCH)
export async function desactivarPersona(id: number): Promise<PersonaRespuesta> {
    const respuesta = await fetch(`${API_URL}/personas/${id}/desactivar`, {
        method: "PATCH"
    });

    if (!respuesta.ok) {
        throw new Error("Error al desactivar la persona");
    }

    return respuesta.json();
}