/**
 * Página Dashboard.
 * Muestra el panel operativo de mantenimiento con los indicadores,
 * intervenciones prioritarias y gráficos de seguimiento.
 *
 * Funcionamiento:
 * - useDashboard: obtiene los datos e indicadores calculados.
 * - KpiOperativos: muestra máquinas paradas y estado de las averías activas.
 * - AveriasPrioritarias: muestra las intervenciones ordenadas por prioridad.
 * - AveriasPendientes: muestra las averías sin técnico asignado.
 * - IndicadoresMantenimiento: muestra el tiempo medio de reparación
 *   y el intervalo medio entre averías.
 * - AveriasPorPrioridad: representa las averías activas por prioridad.
 * - GraficosHoras: muestra las horas de mantenimiento por máquina y técnico.
 * - Controla los estados de carga y los posibles errores.
 */
import useDashboard from "../../hooks/useDashboard";

import KpiOperativos from "../../components/dashboard/KpiOperativos";
import AveriasPrioritarias from "../../components/dashboard/AveriasPrioritarias";
import AveriasPendientes from "../../components/dashboard/AveriasPendientes";
import AveriasPorPrioridad from "../../components/dashboard/AveriasPorPrioridad";
import GraficosHoras from "../../components/dashboard/GraficoHoras";
import IndicadoresMantenimiento from "../../components/dashboard/IndicadoresMantenimiento";

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
        horasPorMaquina,
        horasPorTecnico,
        mttr,
        intervaloMedioAverias,
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

                    {/* Indicadores de rendimiento del mantenimiento */}
                    <IndicadoresMantenimiento 
                    mttr={mttr} 
                    intervaloMedioAverias={intervaloMedioAverias}
                    />

                    {/* Indicadores gráficos de mantenimiento */}
                    <section className="dashboard-graficos-operativos">

                        <AveriasPorPrioridad
                            averiasPorPrioridad={averiasPorPrioridad}
                        />

                        <GraficosHoras
                            horasPorMaquina={horasPorMaquina}
                            horasPorTecnico={horasPorTecnico}
                        />

                    </section>
                </>
            )}

        </div>
    );
}

export default Dashboard;