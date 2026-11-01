/**
 * Componente KpiResumen.
 * Muestra en el dashboard un resumen general del estado del mantenimiento
 * mediante tarjetas informativas reutilizables.
 *
 * Propiedades:
 * - totalMaquinas: cantidad total de máquinas registradas.
 * - maquinasOperativas: cantidad de máquinas en estado operativo.
 * - totalAverias: cantidad total de averías registradas.
 * - averiasPendientes: cantidad de averías pendientes.
 * - totalTecnicos: cantidad total de técnicos registrados.
 * - tecnicosDisponibles: cantidad de técnicos sin averías activas asignadas.
 *
 * Funcionamiento:
 * - KpiCard: muestra cada indicador en una tarjeta informativa.
 * - Recibe los indicadores calculados previamente en useDashboard.ts.
 * - Muestra cuatro tarjetas: Máquinas, Averías, Técnicos y Disponibles.
 * - Asigna un valor, descripción y color a cada indicador.
 */
import KpiCard from "./KpiCard";

// Datos que recibirá el componente
interface KpiResumenProps {
    totalMaquinas: number;
    maquinasOperativas: number;
    totalAverias: number;
    averiasPendientes: number;
    totalTecnicos: number;
    tecnicosDisponibles: number;
}

function KpiResumen({
    totalMaquinas,
    maquinasOperativas,
    totalAverias,
    averiasPendientes,
    totalTecnicos,
    tecnicosDisponibles
}: KpiResumenProps) {

    return (
        <>
            {/* Indicador de máquinas */}
            <KpiCard
                titulo="Máquinas"
                valor={totalMaquinas}
                descripcion={`${maquinasOperativas} operativas`}
                color="#16a34a"
            />

            {/* Indicador de averías */}
            <KpiCard
                titulo="Averías"
                valor={totalAverias}
                descripcion={`${averiasPendientes} pendientes`}
                color="#d97706"
            />

            {/* Indicador de técnicos */}
            <KpiCard
                titulo="Técnicos"
                valor={totalTecnicos}
                descripcion="Técnicos registrados"
                color="#2563eb"
            />

            {/* Indicador de disponibilidad */}
            <KpiCard
                titulo="Disponibles"
                valor={tecnicosDisponibles}
                descripcion="Técnicos sin averías activas asignadas"
                color="#0d9488"
            />
        </>
    );
}

export default KpiResumen;