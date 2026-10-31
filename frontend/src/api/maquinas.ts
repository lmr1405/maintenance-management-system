import { API_URL } from "./cliente";
import type { MaquinaCrear, MaquinaRespuesta } from "../types/maquina";

// Obtener todas las máquinas (GET)
export async function obtenerMaquinas(): Promise<MaquinaRespuesta[]> {
    const respuesta = await fetch(`${API_URL}/maquinas`);

    if (!respuesta.ok) {
        throw new Error("Error al obtener las máquinas");
    }

    return respuesta.json();
}

// Obtener una máquina por su ID (GET)
export async function obtenerMaquina(id: number): Promise<MaquinaRespuesta> {
    const respuesta = await fetch(`${API_URL}/maquinas/${id}`);

    if (!respuesta.ok) {
        throw new Error("Error al obtener la máquina");
    }

    return respuesta.json();
}

// Registrar una máquina (POST)
export async function crearMaquina(datos: MaquinaCrear): Promise<MaquinaRespuesta> {
    const respuesta = await fetch(`${API_URL}/maquinas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error("Error al registrar la máquina");
    }

    return respuesta.json();
}

// Actualizar una máquina (PUT)
export async function actualizarMaquina(
    id: number,
    datos: MaquinaCrear
): Promise<MaquinaRespuesta> {

    const respuesta = await fetch(`${API_URL}/maquinas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error("Error al actualizar la máquina");
    }

    return respuesta.json();
}

// Dar de baja una máquina (PATCH)
export async function darBajaMaquina(id: number): Promise<MaquinaRespuesta> {
    const respuesta = await fetch(`${API_URL}/maquinas/${id}/baja`, {
        method: "PATCH"
    });

    if (!respuesta.ok) {
        throw new Error("Error al dar de baja la máquina");
    }

    return respuesta.json();
}