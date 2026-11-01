/**
 * Componente GraficoEstadoMaquinas.
 * Muestra en el dashboard un gráfico de barras con la cantidad
 * de máquinas registradas agrupadas por su estado.
 *
 * Propiedades:
 * - maquinas: listado de máquinas registradas.
 *
 * Funcionamiento:
 * - ESTADOS: define los estados de las máquinas y sus colores.
 * - BarraEstadoMaquina: dibuja cada barra con el color correspondiente.
 * - datos: calcula la cantidad de máquinas que hay en cada estado.
 * - BarChart: representa las máquinas mediante un gráfico de barras.
 * - LabelList: muestra la cantidad de máquinas encima de cada barra.
 * - Tooltip: muestra información al pasar el ratón sobre las barras.
 * - XAxis: muestra los estados y abrevia "Fuera de servicio".
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
import type { MaquinaRespuesta } from "../../types/maquina";
import type { EstadoMaquina } from "../../types/enums";

// Propiedades del componente
interface GraficoEstadoMaquinasProps {
    maquinas: MaquinaRespuesta[];
}

// Estados y colores de las máquinas
const ESTADOS: { estado: EstadoMaquina; color: string }[] = [
    { estado: "Operativa", color: "#16a34a" },
    { estado: "En avería", color: "#f59e0b" },
    { estado: "Fuera de servicio", color: "#dc2626" },
    { estado: "De baja", color: "#94a3b8" }
];

// Dibujar cada barra con su color correspondiente
function BarraEstadoMaquina(props: BarShapeProps) {

    const color = ESTADOS[props.index]?.color ?? "#94a3b8";

    return (
        <Rectangle
            {...props}
            fill={color}
            radius={[4, 4, 0, 0]}
        />
    );
}

function GraficoEstadoMaquinas({
    maquinas
}: GraficoEstadoMaquinasProps) {

    // Contar máquinas por estado
    const datos = ESTADOS.map(({ estado }) => ({
        estado,
        cantidad: maquinas.filter(
            maquina => maquina.estado === estado
        ).length
    }));

    return (
        <article className="dashboard-grafica">

            <h3>Estado de las máquinas</h3>

            {maquinas.length === 0 ? (
                <p>No hay máquinas registradas.</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={datos}
                        margin={{
                            top: 25,
                            right: 10,
                            left: -25,
                            bottom: 25
                        }}
                    >

                        {/* Líneas horizontales */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        {/* Estados de las máquinas */}
                        <XAxis
                            dataKey="estado"
                            tick={{ fontSize: 10 }}
                            interval={0}
                            tickFormatter={(estado: string) => {
                                if (estado === "Fuera de servicio") {
                                    return "F. servicio";
                                }
                                return estado;
                            }}
                        />

                        {/* Cantidad de máquinas */}
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 11 }}
                        />

                        {/* Información al pasar el ratón */}
                        <Tooltip />

                        {/* Barras con colores según estado */}
                        <Bar
                            dataKey="cantidad"
                            name="Máquinas"
                            shape={BarraEstadoMaquina}
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

export default GraficoEstadoMaquinas;