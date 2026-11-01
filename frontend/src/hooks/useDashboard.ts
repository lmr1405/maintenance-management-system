import { useEffect, useState } from "react";

import { obtenerMaquinas } from "../api/maquinas";
import { obtenerAverias } from "../api/averias";
import { obtenerPersonas } from "../api/personas";

import type { MaquinaRespuesta } from "../types/maquina";
import type { AveriaRespuesta } from "../types/averia";
import type { PersonaRespuesta } from "../types/persona";

function useDashboard() {

    // Datos recibidos desde FastAPI
    const [maquinas, setMaquinas] = useState<MaquinaRespuesta[]>([]);
    const [averias, setAverias] = useState<AveriaRespuesta[]>([]);
    const [personas, setPersonas] = useState<PersonaRespuesta[]>([]);

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
                    datosPersonas
                ] = await Promise.all([
                    obtenerMaquinas(),
                    obtenerAverias(),
                    obtenerPersonas()
                ]);

                if (activo) {
                    setMaquinas(datosMaquinas);
                    setAverias(datosAverias);
                    setPersonas(datosPersonas);
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

        cargando,
        error
    };
}

export default useDashboard;