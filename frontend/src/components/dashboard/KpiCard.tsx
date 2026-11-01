// Propiedades que recibe cada tarjeta KPI
interface KpiCardProps {
    titulo: string;
    valor: number;
    descripcion: string;
    color: string;
}

function KpiCard({
    titulo,
    valor,
    descripcion,
    color
}: KpiCardProps) {

    return (
        <article className="kpi-card">

            {/* Nombre del indicador */}
            <h3 className="kpi-titulo">{titulo}</h3>

            {/* Valor principal */}
            <p
                className="kpi-valor"
                style={{ color }}
            >
                {valor}
            </p>

            {/* Información complementaria */}
            <p className="kpi-descripcion">
                {descripcion}
            </p>

        </article>
    );
}

export default KpiCard;