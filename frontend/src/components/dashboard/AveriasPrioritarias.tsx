/**
 * Componente AveriasPrioritarias.
 * Muestra en el dashboard las intervenciones de mantenimiento activas,
 * ordenadas según su importancia para facilitar su gestión.
 *
 * Propiedades:
 * - averias: listado de averías registradas.
 * - maquinas: listado de máquinas asociadas a las averías.
 * - personas: listado de personas para identificar a los técnicos.
 *
 * Funcionamiento:
 * - ORDEN_PRIORIDAD: establece el orden Urgente, Alta, Media y Baja.
 * - averiasActivas: filtra las averías abiertas, asignadas y en curso.
 * - averiasOrdenadas: ordena primero las máquinas paradas,
 *   después por prioridad y finalmente por antigüedad.
 * - obtenerMaquina: obtiene el nombre de la máquina por su ID.
 * - obtenerTecnico: obtiene el nombre del técnico asignado.
 * - Muestra una tabla con las intervenciones prioritarias.
 * - Permite acceder al detalle de cada avería para gestionarla.
 */
import { Link } from "react-router";

import type { AveriaRespuesta } from "../../types/averia";
import type { MaquinaRespuesta } from "../../types/maquina";
import type { PersonaRespuesta } from "../../types/persona";

interface AveriasPrioritariasProps {
    averias: AveriaRespuesta[];
    maquinas: MaquinaRespuesta[];
    personas: PersonaRespuesta[];
}

// Orden de prioridad de las intervenciones
const ORDEN_PRIORIDAD: Record<string, number> = {
    "Urgente": 0,
    "Alta": 1,
    "Media": 2,
    "Baja": 3
};

function AveriasPrioritarias({
    averias,
    maquinas,
    personas
}: AveriasPrioritariasProps) {

    // Mostrar únicamente las averías activas
    const averiasActivas = averias.filter(
        averia =>
            averia.estado === "Abierta" ||
            averia.estado === "Asignada" ||
            averia.estado === "En curso"
    );

    // Ordenar por parada, prioridad y antigüedad
    const averiasOrdenadas = [...averiasActivas].sort((a, b) => {

        if (a.maquina_parada !== b.maquina_parada) {
            return a.maquina_parada ? -1 : 1;
        }

        const prioridadA = ORDEN_PRIORIDAD[a.prioridad] ?? 4;
        const prioridadB = ORDEN_PRIORIDAD[b.prioridad] ?? 4;

        if (prioridadA !== prioridadB) {
            return prioridadA - prioridadB;
        }

        return new Date(a.fecha_deteccion).getTime()
            - new Date(b.fecha_deteccion).getTime();
    });

    // Obtener la máquina asociada a una avería
    function obtenerMaquina(id: number) {
        const maquina = maquinas.find(
            maquina => maquina.id_maquina === id
        );

        return maquina?.nombre ?? `Máquina ${id}`;
    }

    // Obtener el técnico asignado
    function obtenerTecnico(id: number | null) {

        if (id === null) {
            return "Sin asignar";
        }

        const tecnico = personas.find(
            persona => persona.id_persona === id
        );

        return tecnico
            ? `${tecnico.nombre} ${tecnico.apellidos}`
            : `Técnico ${id}`;
    }

    return (
        <section className="dashboard-panel">

            <h3>Intervenciones prioritarias</h3>

            {averiasOrdenadas.length === 0 ? (
                <p>No hay averías activas.</p>
            ) : (
                <div className="dashboard-tabla-contenedor">
                    <table className="dashboard-tabla">

                        <thead>
                            <tr>
                                <th>Prioridad</th>
                                <th>Máquina</th>
                                <th>Avería</th>
                                <th>Estado</th>
                                <th>Técnico</th>
                                <th>Acción</th>
                            </tr>
                        </thead>

                        <tbody>
                            {averiasOrdenadas.map(averia => (
                                <tr key={averia.id_averia}>

                                    <td>
                                        {averia.prioridad}
                                        {averia.maquina_parada && (
                                            <strong> · PARADA</strong>
                                        )}
                                    </td>

                                    <td>
                                        {obtenerMaquina(averia.id_maquina)}
                                    </td>

                                    <td>
                                        <strong>{averia.numero}</strong>
                                        <div>{averia.titulo}</div>
                                    </td>

                                    <td>{averia.estado}</td>

                                    <td>
                                        {obtenerTecnico(
                                            averia.id_tecnico_asignado
                                        )}
                                    </td>

                                    <td>
                                        <Link
                                            to={`/averias/${averia.id_averia}`}
                                            className="dashboard-accion"
                                        >
                                            Gestionar
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

export default AveriasPrioritarias;