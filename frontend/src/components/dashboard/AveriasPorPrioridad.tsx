import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from "recharts";

// Propiedades recibidas desde useDashboard
interface AveriasPorPrioridadProps {
    averiasPorPrioridad: {
        Urgente: number;
        Alta: number;
        Media: number;
        Baja: number;
    };
}

// Colores asociados a cada prioridad
const COLORES = {
    Urgente: "#dc2626",
    Alta: "#f97316",
    Media: "#eab308",
    Baja: "#16a34a"
};

function AveriasPorPrioridad({
    averiasPorPrioridad
}: AveriasPorPrioridadProps) {

    // Transformar los indicadores para Recharts
    const datos = Object.entries(averiasPorPrioridad).map(
        ([prioridad, cantidad]) => ({
            prioridad,
            cantidad,
            color: COLORES[prioridad as keyof typeof COLORES]
        })
    );

    const total = datos.reduce(
        (suma, dato) => suma + dato.cantidad, 0
    );

    return (
        <section className="dashboard-panel">

            <h3>Averías activas por prioridad</h3>

            {total === 0 ? (
                <p>No hay averías activas.</p>
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                        data={datos}
                        margin={{
                            top: 25,
                            right: 20,
                            left: -20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="prioridad"
                            tick={{ fontSize: 12 }}
                        />

                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 12 }}
                        />

                        <Tooltip />

                        <Bar
                            dataKey="cantidad"
                            name="Averías"
                            maxBarSize={65}
                            radius={[5, 5, 0, 0]}
                        >
                            {datos.map(dato => (
                                <Cell
                                    key={dato.prioridad}
                                    fill={dato.color}
                                />
                            ))}

                            <LabelList
                                dataKey="cantidad"
                                position="top"
                            />
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>
            )}

        </section>
    );
}

export default AveriasPorPrioridad;