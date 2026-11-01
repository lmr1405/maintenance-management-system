import useDashboard from "../../hooks/useDashboard";

import KpiOperativos from "../../components/dashboard/KpiOperativos";
import AveriasPrioritarias from "../../components/dashboard/AveriasPrioritarias";
import AveriasPendientes from "../../components/dashboard/AveriasPendientes";
import AveriasPorPrioridad from "../../components/dashboard/AveriasPorPrioridad";

import "../../styles/DashboardOperativo.css";

function Dashboard() {

    // Obtener datos e indicadores desde el hook
    const {
        maquinas,
        averias,
        personas,
        maquinasParadas,
        averiasSinAsignar,
        averiasEnCurso,
        averiasPorValidar,
        averiasPorPrioridad,
        cargando,
        error
    } = useDashboard();

    return (
        <div className="dashboard-operativo">

            {/* Encabezado principal */}
            <div className="dashboard-header">
                <h2>Panel de mantenimiento</h2>
                <p>Intervenciones y tareas que requieren atención</p>
            </div>

            {/* Estado de carga */}
            {cargando && (
                <p>Cargando información de mantenimiento...</p>
            )}

            {/* Mensaje de error */}
            {!cargando && error && (
                <p className="dashboard-error">{error}</p>
            )}

            {!cargando && !error && (
                <>
                    {/* Indicadores operativos */}
                    <section className="dashboard-kpis">
                        <KpiOperativos
                            maquinasParadas={maquinasParadas}
                            averiasSinAsignar={averiasSinAsignar}
                            averiasEnCurso={averiasEnCurso}
                            averiasPorValidar={averiasPorValidar}
                        />
                    </section>

                    {/* Intervenciones activas ordenadas por prioridad */}
                    <AveriasPrioritarias
                        averias={averias}
                        maquinas={maquinas}
                        personas={personas}
                    />

                    {/* Averías pendientes de asignación */}
                    <AveriasPendientes
                        averias={averias}
                        maquinas={maquinas}
                    />

                    {/* Distribución de averías activas por prioridad */}
                    <AveriasPorPrioridad
                        averiasPorPrioridad={averiasPorPrioridad}
                    />
                </>
            )}

        </div>
    );
}

export default Dashboard;