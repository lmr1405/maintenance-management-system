/**
 * Componente GraficoAveriasPastel.
 * Muestra en el dashboard un gráfico circular con la distribución
 * de las averías registradas según su estado.
 *
 * Propiedades:
 * - averias: listado de averías registradas.
 *
 * Funcionamiento:
 * - ESTADOS: define los estados de las averías y sus colores.
 * - SectorAveria: dibuja cada sector con el color correspondiente.
 * - datos: calcula la cantidad de averías que hay en cada estado.
 * - PieChart: representa las averías mediante un gráfico circular.
 * - Pie: muestra los sectores formando un gráfico de tipo anillo.
 * - Tooltip: muestra información al pasar el ratón sobre los sectores.
 * - Legend: muestra una leyenda personalizada con los estados y colores.
 * - ResponsiveContainer: adapta el gráfico al tamaño disponible.
 * - Muestra en el centro el número total de averías registradas.
 */
import {
    PieChart,
    Pie,
    Sector,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import type { PieSectorShapeProps } from "recharts";

import type { AveriaRespuesta } from "../../types/averia";
import type { EstadoAveria } from "../../types/enums";

// Propiedades del componente
interface GraficoAveriasPastelProps {
    averias: AveriaRespuesta[];
}

// Estados y colores del gráfico
const ESTADOS: { estado: EstadoAveria; color: string }[] = [
    { estado: "Abierta", color: "#dc2626" },
    { estado: "Asignada", color: "#f59e0b" },
    { estado: "En curso", color: "#3b82f6" },
    { estado: "Resuelta", color: "#16a34a" },
    { estado: "Cerrada", color: "#94a3b8" }
];

// Dibujar cada sector con su color correspondiente
function SectorAveria(props: PieSectorShapeProps) {

    const color = ESTADOS[props.index]?.color ?? "#94a3b8";

    return (
        <Sector
            {...props}
            fill={color}
        />
    );
}

function GraficoAveriasPastel({
    averias
}: GraficoAveriasPastelProps) {

    // Contar averías por estado
    const datos = ESTADOS.map(({ estado, color }) => ({
        name: estado,
        value: averias.filter(
            averia => averia.estado === estado
        ).length,
        color
    }));

    return (
        <article className="dashboard-grafica">

            <h3>Averías por estado</h3>

            {averias.length === 0 ? (
                <p>No hay averías registradas.</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>

                    <Pie
                        data={datos}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={2}
                        shape={SectorAveria}
                    />

                        {/* Número total de averías */}
                        <text
                            x="50%"
                            y="42%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#334155"
                            fontSize={26}
                            fontWeight={700}
                        >
                            {averias.length}
                        </text>

                        {/* Texto debajo del número */}
                        <text
                            x="50%"
                            y="52%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#64748b"
                            fontSize={12}
                        >
                            averías
                        </text>

                        {/* Información al pasar el ratón */}
                        <Tooltip />

                        {/* Leyenda personalizada con los colores correctos */}
                        <Legend
                            position="bottom"
                            content={() => (
                                <div className="dashboard-leyenda">
                                    {ESTADOS.map(({ estado, color }) => (
                                        <div className="dashboard-leyenda-item" key={estado}>
                                            <span
                                                className="dashboard-leyenda-color"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span>{estado}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />

                    </PieChart>
                </ResponsiveContainer>
            )}

        </article>
    );
}

export default GraficoAveriasPastel;