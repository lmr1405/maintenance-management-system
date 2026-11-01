import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList
} from "recharts";

// Datos calculados en useDashboard
interface HorasItem {
    id: number;
    nombre: string;
    horas: number;
}

interface GraficosHorasProps {
    horasPorMaquina: HorasItem[];
    horasPorTecnico: HorasItem[];
}

function GraficosHoras({
    horasPorMaquina,
    horasPorTecnico
}: GraficosHorasProps) {

    // Reutilizar el mismo gráfico para ambas categorías
    function renderizarGrafico(datos: HorasItem[]) {

        if (datos.length === 0) {
            return <p>No hay registros disponibles.</p>;
        }

        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={datos}
                    margin={{
                        top: 25,
                        right: 15,
                        left: -15,
                        bottom: 15
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="nombre"
                        tick={{ fontSize: 11 }}
                        interval={0}
                    />

                    <YAxis
                        tick={{ fontSize: 11 }}
                        allowDecimals={false}
                        label={{
                            value: "Horas",
                            angle: -90,
                            position: "insideLeft"
                        }}
                    />

                    <Tooltip
                        formatter={(valor) => [
                            `${Number(valor).toFixed(2)} h`,
                            "Horas imputadas"
                        ]}
                    />

                    <Bar
                        dataKey="horas"
                        fill="#2563eb"
                        maxBarSize={55}
                        radius={[5, 5, 0, 0]}
                    >
                        <LabelList
                            dataKey="horas"
                            position="top"
                        />
                    </Bar>

                </BarChart>
            </ResponsiveContainer>
        );
    }

    return (
        <section className="dashboard-horas">

            {/* Horas acumuladas por máquina */}
            <article className="dashboard-panel">
                <h3>Horas de mantenimiento por máquina</h3>
                {renderizarGrafico(horasPorMaquina)}
            </article>

            {/* Horas acumuladas por técnico */}
            <article className="dashboard-panel">
                <h3>Horas de mantenimiento por técnico</h3>
                {renderizarGrafico(horasPorTecnico)}
            </article>

        </section>
    );
}

export default GraficosHoras;