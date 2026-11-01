/**
 * Página TotalHorasAverias.
 * Muestra las horas de trabajo acumuladas en cada avería
 * y los técnicos que han participado en su reparación.
 *
 * Funcionamiento:
 * - Obtiene las averías, imputaciones y personas desde FastAPI.
 * - Consulta el total de horas registradas en cada avería.
 * - obtenerIntervenciones: obtiene las imputaciones de una avería.
 * - obtenerTecnicos: identifica los técnicos participantes sin repetirlos.
 * - Muestra una tabla con la avería, técnicos, intervenciones y horas.
 * - Permite regresar al historial de imputaciones.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { obtenerAverias } from "../../api/averias";
import { obtenerImputaciones, obtenerTotalHorasPorAveria } from "../../api/imputaciones";
import { obtenerPersonas } from "../../api/personas";

import type { AveriaRespuesta } from "../../types/averia";
import type { ImputacionHorasRespuesta } from "../../types/imputacion";
import type { PersonaRespuesta } from "../../types/persona";

import "../../styles/Imputaciones.css";

function TotalHorasAverias() {

    // Datos obtenidos de FastAPI
    const [averias, setAverias] = useState<AveriaRespuesta[]>([]);
    const [imputaciones, setImputaciones] = useState<ImputacionHorasRespuesta[]>([]);
    const [personas, setPersonas] = useState<PersonaRespuesta[]>([]);

    // Horas acumuladas por avería
    const [totales, setTotales] = useState<Record<number, number>>({});

    // Control de carga y errores
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        let activo = true;

        async function cargarTotales() {

            try {

                // Obtener averías, imputaciones y personas
                const [datosAverias, datosImputaciones, datosPersonas] =
                    await Promise.all([
                        obtenerAverias(),
                        obtenerImputaciones(),
                        obtenerPersonas()
                    ]);

                // Consultar el total de horas de cada avería
                const resultados = await Promise.all(
                    datosAverias.map(async (averia) => {

                        const resultado = await obtenerTotalHorasPorAveria(
                            averia.id_averia
                        );

                        return [
                            averia.id_averia,
                            resultado.total_horas
                        ] as const;
                    })
                );

                if (activo) {
                    setAverias(datosAverias);
                    setImputaciones(datosImputaciones);
                    setPersonas(datosPersonas);
                    setTotales(Object.fromEntries(resultados));
                }

            } catch (error) {

                if (activo) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Error al obtener las horas por avería"
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

    // Obtener las intervenciones registradas en una avería
    function obtenerIntervenciones(idAveria: number) {
        return imputaciones.filter(
            (imputacion) => imputacion.id_averia === idAveria
        );
    }

    // Obtener los nombres de los técnicos participantes
    function obtenerTecnicos(idAveria: number): string {

        const intervenciones = obtenerIntervenciones(idAveria);

        // Evitar repetir técnicos con varias imputaciones
        const idsTecnicos = [
            ...new Set(intervenciones.map((i) => i.id_tecnico))
        ];

        if (idsTecnicos.length === 0) {
            return "Sin intervenciones registradas";
        }

        return idsTecnicos.map((id) => {

            const tecnico = personas.find(
                (persona) => persona.id_persona === id
            );

            return tecnico
                ? `${tecnico.nombre} ${tecnico.apellidos}`
                : `Técnico #${id}`;

        }).join(", ");
    }

    return (
        <div className="pagina-imputaciones">

            <h2>Total de horas por avería</h2>

            {cargando ? (
                <p>Cargando información...</p>
            ) : error ? (
                <p className="imputaciones-error">{error}</p>
            ) : averias.length === 0 ? (
                <p>No existen averías registradas.</p>
            ) : (
                <table className="tabla-imputaciones">

                    <thead>
                        <tr>
                            <th>Avería</th>
                            <th>Técnicos participantes</th>
                            <th>Intervenciones</th>
                            <th>Total de horas</th>
                        </tr>
                    </thead>

                    <tbody>
                        {averias.map((averia) => {

                            const intervenciones = obtenerIntervenciones(
                                averia.id_averia
                            );

                            const totalHoras =
                                totales[averia.id_averia] ?? 0;

                            return (
                                <tr key={averia.id_averia}>

                                    <td>{averia.numero}</td>

                                    <td>
                                        {obtenerTecnicos(averia.id_averia)}
                                    </td>

                                    <td>{intervenciones.length}</td>

                                    <td>
                                        {totalHoras > 0
                                            ? `${totalHoras} h`
                                            : "No existen horas imputadas"}
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            )}

            {/* Volver al historial de imputaciones */}
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

export default TotalHorasAverias;