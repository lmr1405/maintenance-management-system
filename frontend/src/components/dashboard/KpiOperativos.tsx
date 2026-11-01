/**
 * Componente KpiOperativos.
 * Muestra en el dashboard los indicadores operativos del mantenimiento
 * utilizando tarjetas reutilizables KpiCard.
 *
 * Propiedades:
 * - maquinasParadas: cantidad de máquinas detenidas por averías activas.
 * - averiasSinAsignar: cantidad de averías pendientes de técnico.
 * - averiasEnCurso: cantidad de reparaciones en curso.
 * - averiasPorValidar: cantidad de averías resueltas pendientes de cierre.
 *
 * Funcionamiento:
 * - KpiCard: muestra cada indicador en una tarjeta informativa.
 * - Recibe los indicadores calculados previamente en useDashboard.ts.
 * - Asigna un título, descripción y color a cada indicador.
 * - Permite visualizar rápidamente el estado operativo del mantenimiento.
 */
import KpiCard from "./KpiCard";

// Indicadores calculados en useDashboard
interface KpiOperativosProps {
    maquinasParadas: number;
    averiasSinAsignar: number;
    averiasEnCurso: number;
    averiasPorValidar: number;
}

function KpiOperativos({
    maquinasParadas,
    averiasSinAsignar,
    averiasEnCurso,
    averiasPorValidar
}: KpiOperativosProps) {

    return (
        <>
            {/* Máquinas que requieren intervención */}
            <KpiCard
                titulo="Máquinas paradas"
                valor={maquinasParadas}
                descripcion="Máquinas con averías activas que provocan parada"
                color="#dc2626"
            />

            {/* Averías pendientes de asignación */}
            <KpiCard
                titulo="Sin asignar"
                valor={averiasSinAsignar}
                descripcion="Averías pendientes de técnico"
                color="#d97706"
            />

            {/* Reparaciones actualmente en curso */}
            <KpiCard
                titulo="En reparación"
                valor={averiasEnCurso}
                descripcion="Intervenciones en curso"
                color="#2563eb"
            />

            {/* Reparaciones resueltas pendientes de cierre */}
            <KpiCard
                titulo="Por validar"
                valor={averiasPorValidar}
                descripcion="Pendientes de cierre por el responsable"
                color="#16a34a"
            />
        </>
    );
}

export default KpiOperativos;