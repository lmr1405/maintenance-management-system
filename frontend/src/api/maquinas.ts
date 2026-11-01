/**
 * Archivo de comunicación con la API de máquinas.
 * Permite registrar, consultar, actualizar y dar de baja las máquinas
 * utilizadas en el sistema de gestión de mantenimiento.
 *
 * Funciones:
 * - obtenerMaquinas: obtiene las máquinas aplicando filtros opcionales.
 * - obtenerMaquina: obtiene los datos de una máquina por su ID.
 * - crearMaquina: registra una nueva máquina.
 * - actualizarMaquina: modifica los datos de una máquina existente.
 * - darBajaMaquina: cambia el estado de una máquina a "De baja".
 *
 * Interfaces:
 * - FiltrosMaquinas: define los filtros por estado, ubicación y tipo.
 */
import { API_URL } from "./cliente";
import type { MaquinaCrear, MaquinaRespuesta } from "../types/maquina";

// Filtros disponibles para consultar máquinas
export interface FiltrosMaquinas {
    estado?: string;
    ubicacion?: string;
    tipo?: string;
}

// Obtener máquinas aplicando filtros opcionales (GET)
export async function obtenerMaquinas(
    filtros: FiltrosMaquinas = {}
): Promise<MaquinaRespuesta[]> {

    // Construir los parámetros de consulta
    const parametros = new URLSearchParams();

    if (filtros.estado) {
        parametros.append("estado", filtros.estado);
    }

    if (filtros.ubicacion) {
        parametros.append("ubicacion", filtros.ubicacion);
    }

    if (filtros.tipo) {
        parametros.append("tipo", filtros.tipo);
    }

    // Construir la URL con los filtros
    const consulta = parametros.toString();
    const url = `${API_URL}/maquinas${consulta ? `?${consulta}` : ""}`;

    const respuesta = await fetch(url);

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