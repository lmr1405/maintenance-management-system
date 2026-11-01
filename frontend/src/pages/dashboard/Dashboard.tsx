import KpiResumen from "../../components/dashboard/KpiResumen";
import useDashboard from "../../hooks/useDashboard";
import GraficoAveriasPastel from "../../components/dashboard/GraficoAveriasPastel";
import GraficoAveriasBarras from "../../components/dashboard/GraficoAveriasBarras";
import GraficoEstadoMaquinas from "../../components/dashboard/GraficoEstadoMaquinas";

import "../../styles/Dashboard.css";

function Dashboard() {

    // Obtener indicadores y estado de carga desde el hook
    const {
        maquinas,
        averias,
        totalMaquinas,
        maquinasOperativas,
        totalAverias,
        averiasPendientes,
        totalTecnicos,
        tecnicosDisponibles,
        cargando,
        error
    } = useDashboard();

    return (
        <div className="dashboard">

            {/* Encabezado principal */}
            <div className="dashboard-header">
                <h2>Dashboard de mantenimiento</h2>
                <p>
                    Resumen general del estado del mantenimiento
                </p>
            </div>

            {/* Estado de carga */}
            {cargando && (
                <p>Cargando indicadores...</p>
            )}

            {/* Mensaje de error */}
            {!cargando && error && (
                <p className="dashboard-error">{error}</p>
            )}

            {/* Mostrar indicadores cuando los datos estén disponibles */}
            {!cargando && !error && (
                <>
                    <section className="dashboard-kpis">

                        <KpiResumen
                            totalMaquinas={totalMaquinas}
                            maquinasOperativas={maquinasOperativas}
                            totalAverias={totalAverias}
                            averiasPendientes={averiasPendientes}
                            totalTecnicos={totalTecnicos}
                            tecnicosDisponibles={tecnicosDisponibles}
                        />

                    </section>

                    <section className="dashboard-graficas">

                    {/* Distribución de averías */}
                    <GraficoAveriasPastel averias={averias} />

                    {/* Cantidad de averías por estado */}
                    <GraficoAveriasBarras averias={averias} />

                        {/* Estado actual de las máquinas */}
                        <GraficoEstadoMaquinas maquinas={maquinas} />

                </section>
                </>
            )}

        </div>
    );
}

export default Dashboard;