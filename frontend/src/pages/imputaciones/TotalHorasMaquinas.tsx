import { useEffect, useState } from "react";
import { Link } from "react-router";

import { obtenerMaquinas } from "../../api/maquinas";
import { obtenerTotalHorasPorMaquina } from "../../api/imputaciones";

import type { MaquinaRespuesta } from "../../types/maquina";

import "../../styles/Imputaciones.css";

function TotalHorasMaquinas() {

    // Máquinas y horas recibidas desde FastAPI
    const [maquinas, setMaquinas] = useState<MaquinaRespuesta[]>([]);
    const [totales, setTotales] = useState<Record<number, number>>({});

    // Control de carga y errores
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function cargarTotales() {
            try {
                const datosMaquinas = await obtenerMaquinas();

                const resultados = await Promise.all(
                    datosMaquinas.map(async (maquina) => {
                        const resultado = await obtenerTotalHorasPorMaquina(
                            maquina.id_maquina
                        );

                        return [maquina.id_maquina, resultado.total_horas] as const;
                    })
                );

                setMaquinas(datosMaquinas);
                setTotales(Object.fromEntries(resultados));

            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Error al obtener las horas por máquina"
                );
            } finally {
                setCargando(false);
            }
        }

        cargarTotales();

    }, []);

    return (
        <div className="pagina-imputaciones">

            <h2>Total de horas por máquina</h2>

            {cargando ? (
                <p>Cargando información...</p>
            ) : error ? (
                <p className="imputaciones-error">{error}</p>
            ) : (
                <table className="tabla-imputaciones">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Máquina</th>
                            <th>Total de horas</th>
                        </tr>
                    </thead>

                    <tbody>
                        {maquinas.map((maquina) => (
                            <tr key={maquina.id_maquina}>
                                <td>{maquina.codigo}</td>
                                <td>{maquina.nombre}</td>
                                <td>
                                    {totales[maquina.id_maquina] ?? 0} h
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

export default TotalHorasMaquinas;