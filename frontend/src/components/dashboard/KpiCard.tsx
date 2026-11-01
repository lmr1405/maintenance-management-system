/**
 * Componente KpiCard.
 * Muestra una tarjeta reutilizable con un indicador numérico
 * y su información correspondiente en el dashboard.
 *
 * Propiedades:
 * - titulo: nombre del indicador que se muestra.
 * - valor: cantidad numérica del indicador.
 * - descripcion: información complementaria del indicador.
 * - color: establece el color del valor numérico.
 *
 * Funcionamiento:
 * - Muestra el título, valor y descripción del indicador.
 * - Aplica el color recibido al valor principal.
 * - Permite reutilizar la misma tarjeta para diferentes indicadores.
 */
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