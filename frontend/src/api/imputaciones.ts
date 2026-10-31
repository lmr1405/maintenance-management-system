import { API_URL } from "./cliente";
import type {
    ImputacionHorasCrear,
    ImputacionHorasRespuesta
} from "../types/imputacion";

// Obtener todas las imputaciones (GET)
export async function obtenerImputaciones(): Promise<ImputacionHorasRespuesta[]> {
    const respuesta = await fetch(`${API_URL}/imputaciones`);

    if (!respuesta.ok) {
        throw new Error("Error al obtener las imputaciones");
    }

    return respuesta.json();
}

// Obtener una imputación por ID (GET)
export async function obtenerImputacion(
    id: number
): Promise<ImputacionHorasRespuesta> {

    const respuesta = await fetch(`${API_URL}/imputaciones/${id}`);

    if (!respuesta.ok) {
        throw new Error("Error al obtener la imputación");
    }

    return respuesta.json();
}

// Registrar horas de trabajo (POST)
export async function crearImputacion(
    datos: ImputacionHorasCrear
): Promise<ImputacionHorasRespuesta> {

    const respuesta = await fetch(`${API_URL}/imputaciones`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error("Error al registrar las horas de trabajo");
    }

    return respuesta.json();
}