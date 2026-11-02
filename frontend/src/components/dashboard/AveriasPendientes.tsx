/**
 * Componente AveriasPendientes.
 * Muestra en el dashboard las averías abiertas que todavía
 * no tienen un técnico asignado.
 *
 * Propiedades:
 * - averias: listado de averías registradas.
 * - maquinas: listado de máquinas para identificar cada avería.
 *
 * Funcionamiento:
 * - pendientes: filtra las averías sin técnico y las ordena por fecha.
 * - obtenerMaquina: obtiene el nombre de la máquina por su ID.
 * - Muestra una tabla con los datos de las averías pendientes.
 * - Permite acceder al detalle de cada avería para asignar un técnico.
 */
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

                                    <td>
                                        <span className={`dashboard-prioridad ${averia.prioridad.toLowerCase()}`}>
                                            {averia.prioridad}
                                        </span>

                                        {averia.maquina_parada && (
                                            <span className="dashboard-parada">
                                                PARADA
                                            </span>
                                        )}
                                    </td>

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