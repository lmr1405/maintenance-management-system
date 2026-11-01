import { API_URL } from "./cliente";
import type { AveriaCrear, AveriaRespuesta } from "../types/averia";
import type { TipoSolucion } from "../types/enums";

// Obtener todas las averías (GET)
export async function obtenerAverias(): Promise<AveriaRespuesta[]> {
    const respuesta = await fetch(`${API_URL}/averias`);

    if (!respuesta.ok) {
        throw new Error("Error al obtener las averías");
    }

    return respuesta.json();
}

// Obtener una avería por ID (GET)
export async function obtenerAveria(id: number): Promise<AveriaRespuesta> {
    const respuesta = await fetch(`${API_URL}/averias/${id}`);

    if (!respuesta.ok) {
        throw new Error("Error al obtener la avería");
    }

    return respuesta.json();
}

// Registrar una avería (POST)
export async function crearAveria(datos: AveriaCrear): Promise<AveriaRespuesta> {
    const respuesta = await fetch(`${API_URL}/averias`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error("Error al registrar la avería");
    }

    return respuesta.json();
}

// Asignar técnico a una avería (PATCH)
export async function asignarTecnico(
    idAveria: number,
    idTecnico: number
): Promise<AveriaRespuesta> {

    const respuesta = await fetch(`${API_URL}/averias/${idAveria}/asignar`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_tecnico: idTecnico
        })
    });

    if (!respuesta.ok) {
        throw new Error("Error al asignar el técnico");
    }

    return respuesta.json();
}

// Iniciar reparación (PATCH)
export async function iniciarReparacion(idAveria: number): Promise<AveriaRespuesta> {
    const respuesta = await fetch(`${API_URL}/averias/${idAveria}/iniciar`, {
        method: "PATCH"
    });

    if (!respuesta.ok) {
        throw new Error("Error al iniciar la reparación");
    }

    return respuesta.json();
}

// Resolver una avería (PATCH)
export async function resolverAveria(
    idAveria: number,
    idTecnico: number,
    causaRaiz: string,
    solucionAplicada: string,
    repuestosSustituidos: string | null = null,
    tipoSolucion: TipoSolucion | null = null,
    recomendacionPreventiva: string | null = null
): Promise<AveriaRespuesta> {

    const respuesta = await fetch(`${API_URL}/averias/${idAveria}/resolver`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_tecnico: idTecnico,
            causa_raiz: causaRaiz,
            solucion_aplicada: solucionAplicada,
            repuestos_sustituidos: repuestosSustituidos,
            tipo_solucion: tipoSolucion,
            recomendacion_preventiva: recomendacionPreventiva
        })
    });

    if (!respuesta.ok) {
        throw new Error("Error al resolver la avería");
    }

    return respuesta.json();
}

// Cerrar una avería (PATCH)
export async function cerrarAveria(
    idAveria: number,
    idResponsable: number
): Promise<AveriaRespuesta> {

    const respuesta = await fetch(`${API_URL}/averias/${idAveria}/cerrar`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_responsable: idResponsable
        })
    });

    if (!respuesta.ok) {
        throw new Error("Error al cerrar la avería");
    }

    return respuesta.json();
}