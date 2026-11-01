import KpiResumen from "../../components/dashboard/KpiResumen";
import useDashboard from "../../hooks/useDashboard";

import GraficoAveriasPastel from "../../components/dashboard/GraficoAveriasPastel";
import GraficoAveriasBarras from "../../components/dashboard/GraficoAveriasBarras";
import GraficoEstadoMaquinas from "../../components/dashboard/GraficoEstadoMaquinas";

import "../../styles/Informe.css";

function Informes() {

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

            {/* Encabezado */}
            <div className="dashboard-header">
                <h2>Informes de mantenimiento</h2>
                <p>Estadísticas generales del mantenimiento</p>
            </div>

            {cargando && <p>Cargando indicadores...</p>}

            {!cargando && error && (
                <p className="dashboard-error">{error}</p>
            )}

            {!cargando && !error && (
                <>
                    {/* Indicadores generales */}
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

                    {/* Gráficos estadísticos */}
                    <section className="dashboard-graficas">
                        <GraficoAveriasPastel averias={averias} />
                        <GraficoAveriasBarras averias={averias} />
                        <GraficoEstadoMaquinas maquinas={maquinas} />
                    </section>
                </>
            )}

        </div>
    );
}

export default Informes;