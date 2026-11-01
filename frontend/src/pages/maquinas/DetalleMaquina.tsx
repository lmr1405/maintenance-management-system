import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { obtenerMaquina } from "../../api/maquinas";
import type { MaquinaRespuesta } from "../../types/maquina";

import "../../styles/DetalleMaquina.css";

function DetalleMaquina() {

    const { id_maquina } = useParams();
    const navigate = useNavigate();

    // Datos de la máquina seleccionada
    const [maquina, setMaquina] = useState<MaquinaRespuesta | null>(null);

    // Control de errores y carga
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    // Obtener los datos de la máquina desde FastAPI
    useEffect(() => {

        let activo = true;

        async function cargarMaquina() {

            setCargando(true);
            setError("");

            try {
                const id = Number(id_maquina);

                if (!Number.isInteger(id) || id <= 0) {
                    throw new Error("Identificador de máquina no válido");
                }

                const datos = await obtenerMaquina(id);

                if (activo) {
                    setMaquina(datos);
                }

            } catch (error) {

                if (activo) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Error al obtener la máquina"
                    );
                }

            } finally {

                if (activo) {
                    setCargando(false);
                }
            }
        }

        cargarMaquina();

        return () => {
            activo = false;
        };

    }, [id_maquina]);

    if (cargando) {
        return <p>Cargando máquina...</p>;
    }

    if (error || !maquina) {
        return <p role="alert">{error || "La máquina no existe"}</p>;
    }

    return (
        <div className="pagina-maquinas">

            <h2>Gestionar máquina</h2>

            {/* Información de la máquina */}
            <div className="detalle-maquina">

                <h3>{maquina.codigo} - {maquina.nombre}</h3>

                <p><strong>Tipo:</strong> {maquina.tipo}</p>
                <p><strong>Fabricante:</strong> {maquina.fabricante ?? "-"}</p>
                <p><strong>Modelo:</strong> {maquina.modelo ?? "-"}</p>
                <p><strong>Número de serie:</strong> {maquina.numero_serie ?? "-"}</p>
                <p><strong>Ubicación:</strong> {maquina.ubicacion ?? "-"}</p>
                <p><strong>Criticidad:</strong> {maquina.criticidad ?? "-"}</p>
                <p><strong>Estado:</strong> {maquina.estado}</p>
                <p><strong>Fecha de puesta en marcha:</strong> {maquina.fecha_puesta_marcha ?? "-"}</p>

            </div>

            {/* Acciones disponibles */}
            <div className="maquinas-acciones">

                <button
                    type="button"
                    onClick={() => navigate("/maquinas")}
                >
                    Volver
                </button>

                <Link to={`/maquinas/${maquina.id_maquina}/editar`}>
                    Editar máquina
                </Link>

                {maquina.estado !== "De baja" && (
                    <Link to={`/maquinas/${maquina.id_maquina}/baja`}>
                        Dar de baja
                    </Link>
                )}

            </div>

            {/* El historial de averías se añadirá aquí */}
            <section className="historial-maquina">
                <h3>Historial de averías</h3>
                <p>Pendiente de implementar.</p>
            </section>

        </div>
    );
}

export default DetalleMaquina;