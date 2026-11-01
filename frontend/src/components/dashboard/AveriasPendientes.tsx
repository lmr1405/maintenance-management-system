import { Link } from "react-router";

import type { AveriaRespuesta } from "../../types/averia";
import type { MaquinaRespuesta } from "../../types/maquina";

interface AveriasPendientesProps {
    averias: AveriaRespuesta[];
    maquinas: MaquinaRespuesta[];
}

function AveriasPendientes({
    averias,
    maquinas
}: AveriasPendientesProps) {

    // Averías abiertas pendientes de asignación
    const pendientes = averias
        .filter(averia =>
            averia.estado === "Abierta" &&
            averia.id_tecnico_asignado === null
        )
        .sort((a, b) =>
            new Date(a.fecha_deteccion).getTime() -
            new Date(b.fecha_deteccion).getTime()
        );

    // Obtener el nombre de la máquina
    function obtenerMaquina(id: number) {

        const maquina = maquinas.find(
            maquina => maquina.id_maquina === id
        );

        return maquina?.nombre ?? `Máquina ${id}`;
    }

    return (
        <section className="dashboard-panel">

            <h3>Averías pendientes de asignación</h3>

            {pendientes.length === 0 ? (
                <p>No hay averías pendientes de asignación.</p>
            ) : (
                <div className="dashboard-tabla-contenedor">
                    <table className="dashboard-tabla">

                        <thead>
                            <tr>
                                <th>Avería</th>
                                <th>Máquina</th>
                                <th>Prioridad</th>
                                <th>Fecha detección</th>
                                <th>Acción</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pendientes.map(averia => (
                                <tr key={averia.id_averia}>

                                    <td>
                                        <strong>{averia.numero}</strong>
                                        <div>{averia.titulo}</div>
                                    </td>

                                    <td>
                                        {obtenerMaquina(averia.id_maquina)}
                                    </td>

                                    <td>{averia.prioridad}</td>

                                    <td>
                                        {averia.fecha_deteccion.slice(0, 10)}
                                    </td>

                                    <td>
                                        <Link
                                            to={`/averias/${averia.id_averia}`}
                                            className="dashboard-accion"
                                        >
                                            Asignar técnico
                                        </Link>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}

        </section>
    );
}

export default AveriasPendientes;