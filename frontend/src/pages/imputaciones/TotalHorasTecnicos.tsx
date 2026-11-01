import { useEffect, useState } from "react";
import { Link } from "react-router";

import { obtenerPersonas } from "../../api/personas";
import { obtenerTotalHorasPorTecnico } from "../../api/imputaciones";

import type { PersonaRespuesta } from "../../types/persona";

import "../../styles/Imputaciones.css";

function TotalHorasTecnicos() {

    // Técnicos y horas recibidas desde FastAPI
    const [tecnicos, setTecnicos] = useState<PersonaRespuesta[]>([]);
    const [totales, setTotales] = useState<Record<number, number>>({});

    // Control de carga y errores
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        let activo = true;

        async function cargarTotales() {

            try {
                const personas = await obtenerPersonas();

                // Incluir técnicos activos e inactivos para conservar el histórico
                const datosTecnicos = personas.filter(
                    (persona) => persona.rol === "Técnico de mantenimiento"
                );

                const resultados = await Promise.all(
                    datosTecnicos.map(async (tecnico) => {
                        const resultado = await obtenerTotalHorasPorTecnico(
                            tecnico.id_persona
                        );

                        return [tecnico.id_persona, resultado.total_horas] as const;
                    })
                );

                if (activo) {
                    setTecnicos(datosTecnicos);
                    setTotales(Object.fromEntries(resultados));
                }

            } catch (error) {
                if (activo) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Error al obtener las horas por técnico"
                    );
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        }

        cargarTotales();

        return () => {
            activo = false;
        };

    }, []);

    return (
        <div className="pagina-imputaciones">

            <h2>Total de horas por técnico</h2>

            {cargando ? (
                <p>Cargando información...</p>
            ) : error ? (
                <p className="imputaciones-error">{error}</p>
            ) : tecnicos.length === 0 ? (
                <p>No existen técnicos registrados.</p>
            ) : (
                <table className="tabla-imputaciones">
                    <thead>
                        <tr>
                            <th>Técnico</th>
                            <th>Total de horas</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tecnicos.map((tecnico) => (
                            <tr key={tecnico.id_persona}>
                                <td>
                                    {tecnico.nombre} {tecnico.apellidos}
                                </td>
                                <td>
                                    {totales[tecnico.id_persona] ?? 0} h
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="imputaciones-pie">
                <Link
                    to="/imputaciones"
                    className="boton-crear-imputacion"
                >
                    Volver a imputaciones
                </Link>
            </div>

        </div>
    );
}

export default TotalHorasTecnicos;