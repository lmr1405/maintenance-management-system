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