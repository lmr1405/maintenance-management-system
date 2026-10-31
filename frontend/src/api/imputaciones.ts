import { API_URL } from "./cliente";
import type {
    ImputacionHorasCrear,
    ImputacionHorasRespuesta
} from "../types/imputacion";

// Respuesta de los endpoints de totales de horas
export interface TotalHorasRespuesta {
    total_horas: number;
}

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

// Obtener el total de horas de una avería (GET)
export async function obtenerTotalHorasPorAveria(
    idAveria: number
): Promise<TotalHorasRespuesta> {

    const respuesta = await fetch(
        `${API_URL}/imputaciones/totales/averia/${idAveria}`
    );

    if (!respuesta.ok) {
        throw new Error("Error al obtener el total de horas de la avería");
    }

    return respuesta.json();
}


// Obtener el total de horas de una máquina (GET)
export async function obtenerTotalHorasPorMaquina(
    idMaquina: number
): Promise<TotalHorasRespuesta> {

    const respuesta = await fetch(
        `${API_URL}/imputaciones/totales/maquina/${idMaquina}`
    );

    if (!respuesta.ok) {
        throw new Error("Error al obtener el total de horas de la máquina");
    }

    return respuesta.json();
}


// Obtener el total de horas de un técnico (GET)
export async function obtenerTotalHorasPorTecnico(
    idTecnico: number
): Promise<TotalHorasRespuesta> {

    const respuesta = await fetch(
        `${API_URL}/imputaciones/totales/tecnico/${idTecnico}`
    );

    if (!respuesta.ok) {
        throw new Error("Error al obtener el total de horas del técnico");
    }

    return respuesta.json();
}