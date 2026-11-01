/**
 * Componente GraficoAveriasBarras.
 * Muestra en el dashboard un gráfico de barras con la cantidad
 * de averías registradas agrupadas por su estado.
 *
 * Propiedades:
 * - averias: listado de averías registradas.
 *
 * Funcionamiento:
 * - ESTADOS: define los estados de las averías y sus colores.
 * - BarraEstado: dibuja cada barra con el color correspondiente.
 * - datos: calcula la cantidad de averías que hay en cada estado.
 * - BarChart: representa las averías mediante un gráfico de barras.
 * - LabelList: muestra la cantidad de averías encima de cada barra.
 * - Tooltip: muestra información al pasar el ratón sobre las barras.
 * - ResponsiveContainer: adapta el gráfico al tamaño disponible.
 */
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Rectangle,
    LabelList
} from "recharts";

import type { BarShapeProps } from "recharts";
import type { AveriaRespuesta } from "../../types/averia";
import type { EstadoAveria } from "../../types/enums";

// Propiedades del componente
interface GraficoAveriasBarrasProps {
    averias: AveriaRespuesta[];
}

// Estados y colores
const ESTADOS: { estado: EstadoAveria; color: string }[] = [
    { estado: "Abierta", color: "#dc2626" },
    { estado: "Asignada", color: "#f59e0b" },
    { estado: "En curso", color: "#3b82f6" },
    { estado: "Resuelta", color: "#16a34a" },
    { estado: "Cerrada", color: "#94a3b8" }
];

// Dibujar cada barra con su color correspondiente
function BarraEstado(props: BarShapeProps) {

    const color = ESTADOS[props.index]?.color ?? "#94a3b8";

    return (
        <Rectangle
            {...props}
            fill={color}
            radius={[4, 4, 0, 0]}
        />
    );
}

function GraficoAveriasBarras({
    averias
}: GraficoAveriasBarrasProps) {

    // Contar averías por estado
    const datos = ESTADOS.map(({ estado }) => ({
        estado,
        cantidad: averias.filter(
            averia => averia.estado === estado
        ).length
    }));

    return (
        <article className="dashboard-grafica">

            <h3>Cantidad de averías por estado</h3>

            {averias.length === 0 ? (
                <p>No hay averías registradas.</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={datos}
                        margin={{
                            top: 25,
                            right: 10,
                            left: -25,
                            bottom: 10
                        }}
                    >

                        {/* Líneas horizontales */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        {/* Estados */}
                        <XAxis
                            dataKey="estado"
                            tick={{ fontSize: 10 }}
                            interval={0}
                        />

                        {/* Cantidad de averías */}
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 11 }}
                        />

                        {/* Información al pasar el ratón */}
                        <Tooltip />

                        {/* Barras con colores según estado */}
                        <Bar
                            dataKey="cantidad"
                            name="Averías"
                            shape={BarraEstado}
                            maxBarSize={45}
                        >
                            <LabelList
                                dataKey="cantidad"
                                position="top"
                                style={{
                                    fontSize: 12,
                                    fill: "#334155"
                                }}
                            />
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>
            )}

        </article>
    );
}

export default GraficoAveriasBarras;