import { useEffect, useState } from "react";

import { obtenerMaquinas } from "../api/maquinas";
import { obtenerAverias } from "../api/averias";
import { obtenerPersonas } from "../api/personas";
import { obtenerImputaciones } from "../api/imputaciones";

import type { MaquinaRespuesta } from "../types/maquina";
import type { AveriaRespuesta } from "../types/averia";
import type { PersonaRespuesta } from "../types/persona";

function useDashboard() {

    // Datos recibidos desde FastAPI
    const [maquinas, setMaquinas] = useState<MaquinaRespuesta[]>([]);
    const [averias, setAverias] = useState<AveriaRespuesta[]>([]);
    const [personas, setPersonas] = useState<PersonaRespuesta[]>([]);

    // Horas registradas por los técnicos
    const [imputaciones, setImputaciones] = useState<
        Awaited<ReturnType<typeof obtenerImputaciones>>
    >([]);

    // Control de carga y errores
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        let activo = true;

        async function cargarDatos() {

            setCargando(true);
            setError("");

            try {

                // Consultar los tres recursos en paralelo
                const [
                    datosMaquinas,
                    datosAverias,
                    datosPersonas,
                    datosImputaciones
                ] = await Promise.all([
                    obtenerMaquinas(),
                    obtenerAverias(),
                    obtenerPersonas(),
                    obtenerImputaciones()
                ]);

                if (activo) {
                    setMaquinas(datosMaquinas);
                    setAverias(datosAverias);
                    setPersonas(datosPersonas);
                    setImputaciones(datosImputaciones);
                }

            } catch {

                if (activo) {
                    setError("Error al cargar los datos del Dashboard");
                }

            } finally {

                if (activo) {
                    setCargando(false);
                }
            }
        }

        cargarDatos();

        return () => {
            activo = false;
        };

    }, []);

    // KPI: máquinas
    const totalMaquinas = maquinas.length;

    const maquinasOperativas = maquinas.filter(
        maquina => maquina.estado === "Operativa"
    ).length;

    // KPI: averías
    const totalAverias = averias.length;

    const averiasPendientes = averias.filter(
        averia =>
            averia.estado === "Abierta" ||
            averia.estado === "Asignada" ||
            averia.estado === "En curso"
    ).length;

    // Máquinas paradas con averías activas
    const maquinasParadas = new Set(
        averias
            .filter(averia =>
                averia.maquina_parada &&
                averia.estado !== "Resuelta" &&
                averia.estado !== "Cerrada"
            )
            .map(averia => averia.id_maquina)
    ).size;

    // Averías sin técnico asignado
    const averiasSinAsignar = averias.filter(
        averia =>
            averia.estado === "Abierta" &&
            averia.id_tecnico_asignado === null
    ).length;

    // Averías en reparación
    const averiasEnCurso = averias.filter(
        averia => averia.estado === "En curso"
    ).length;

    // Averías activas agrupadas por prioridad
    const averiasPorPrioridad = {
        Urgente: 0,
        Alta: 0,
        Media: 0,
        Baja: 0
    };

    // Contar averías pendientes de resolver
    averias.forEach(averia => {

        // Excluir las averías resueltas y cerradas
        if (
            averia.estado === "Resuelta" ||
            averia.estado === "Cerrada"
        ) {
            return;
        }

        // Incrementar el contador correspondiente
        averiasPorPrioridad[averia.prioridad]++;
    });

    // Averías pendientes de validación
    const averiasPorValidar = averias.filter(
        averia => averia.estado === "Resuelta"
    ).length;

    // KPI: técnicos activos
    const tecnicos = personas.filter(
        persona =>
            persona.rol === "Técnico de mantenimiento" &&
            persona.activo
    );

    const totalTecnicos = tecnicos.length;

    // Técnicos ocupados con averías asignadas o en curso
    const tecnicosOcupados = new Set(
        averias
            .filter(
                averia =>
                    averia.estado === "Asignada" ||
                    averia.estado === "En curso"
            )
            .map(averia => averia.id_tecnico_asignado)
            .filter((id): id is number => id !== null)
    );

    const tecnicosDisponibles = tecnicos.filter(
        tecnico => !tecnicosOcupados.has(tecnico.id_persona)
    ).length;

    // Relacionar las averías con sus máquinas
    const maquinaPorAveria = new Map(
        averias.map(averia => [
            averia.id_averia,
            averia.id_maquina
        ])
    );

    // Horas acumuladas por máquina
    const horasPorMaquina = maquinas.map(maquina => {

        const horas = imputaciones.reduce((total, imputacion) => {

            const idMaquina = maquinaPorAveria.get(
                imputacion.id_averia
            );

            if (idMaquina !== maquina.id_maquina) {
                return total;
            }

            return total + Number(imputacion.horas);
        }, 0);

        return {
            id: maquina.id_maquina,
            nombre: maquina.nombre,
            horas
        };
    });

    // Horas acumuladas por técnico
    const horasPorTecnico = personas
        .filter(persona => persona.rol === "Técnico de mantenimiento")
        .map(tecnico => {

            const horas = imputaciones
                .filter(imputacion =>
                    imputacion.id_tecnico === tecnico.id_persona
                )
                .reduce((total, imputacion) =>
                    total + Number(imputacion.horas), 0
                );

            return {
                id: tecnico.id_persona,
                nombre: `${tecnico.nombre} ${tecnico.apellidos}`,
                horas
            };
        });

    // Devolver datos e indicadores
    return {
        maquinas,
        averias,
        personas,

        totalMaquinas,
        maquinasOperativas,
        totalAverias,
        averiasPendientes,
        totalTecnicos,
        tecnicosDisponibles,
        maquinasParadas,
        averiasSinAsignar,
        averiasEnCurso,
        averiasPorValidar,
        averiasPorPrioridad,
        horasPorMaquina,
        horasPorTecnico,

        cargando,
        error
    };
}

export default useDashboard;