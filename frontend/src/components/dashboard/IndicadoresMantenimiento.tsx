import KpiCard from "./KpiCard";

// Indicadores calculados en useDashboard
interface IndicadoresMantenimientoProps {
    mttr: number | null;
    intervaloMedioAverias: number | null;
}

/* Recibe los indicadores de useDashboard.ts */
function IndicadoresMantenimiento({
    mttr,
    intervaloMedioAverias
}: IndicadoresMantenimientoProps) {

    return (
        <section className="dashboard-indicadores-mantenimiento">

            <h3>Indicadores de mantenimiento</h3>

            <div className="dashboard-indicadores-grid">

                {/* Tiempo medio de trabajo por reparación */}
                <KpiCard
                    titulo="Tiempo medio de trabajo por reparación"
                    valor={mttr !== null ? Number(mttr.toFixed(2)) : 0}
                    descripcion={
                        mttr !== null
                            ? "Horas imputadas por avería reparada"
                            : "Sin reparaciones registradas"
                    }
                    color="#2563eb"
                />

                {/* Intervalo medio entre averías */}
                <KpiCard
                    titulo="Intervalo medio entre averías"
                    valor={
                        intervaloMedioAverias !== null
                            ? Number(intervaloMedioAverias.toFixed(2))
                            : 0
                    }
                    descripcion={
                        intervaloMedioAverias !== null
                            ? "Horas naturales entre detecciones de fallos"
                            : "Se necesitan al menos dos averías de una misma máquina"
                    }
                    color="#0d9488"
                />

            </div>

        </section>
    );
}

export default IndicadoresMantenimiento;