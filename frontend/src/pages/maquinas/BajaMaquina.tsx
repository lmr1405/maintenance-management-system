import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { obtenerMaquina, darBajaMaquina } from "../../api/maquinas";
import type { MaquinaRespuesta } from "../../types/maquina";

import "../../styles/BajaMaquina.css";

function BajaMaquina() {

    const { id_maquina } = useParams();
    const navigate = useNavigate();

    // Datos de la máquina seleccionada
    const [maquina, setMaquina] = useState<MaquinaRespuesta | null>(null);

    // Control de errores, carga y operación de baja
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);

    // Consultar la máquina mediante la capa API
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

    // Confirmar la baja lógica de la máquina
    async function confirmarBaja() {

        if (!maquina || procesando || maquina.estado === "De baja") {
            return;
        }

        setError("");
        setProcesando(true);

        try {

            // Cambiar el estado de la máquina mediante FastAPI
            await darBajaMaquina(maquina.id_maquina);

            // Regresar a la ficha de la máquina
            navigate(`/maquinas/${maquina.id_maquina}`, {
                replace: true
            });

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "Error al dar de baja la máquina"
            );

        } finally {
            setProcesando(false);
        }
    }

    // Cancelar sin modificar la máquina
    function cancelar() {
        navigate(`/maquinas/${id_maquina}`);
    }

    if (cargando) {
        return <p>Cargando máquina...</p>;
    }

    if (!maquina) {
        return <p role="alert">{error || "La máquina no existe"}</p>;
    }

    return (
        <div className="pagina-baja-maquina">

            <h2>Dar de baja una máquina</h2>

            <div className="baja-maquina-contenido">

                {/* Información de la máquina */}
                <h3>{maquina.codigo} - {maquina.nombre}</h3>

                <p>
                    <strong>Tipo:</strong> {maquina.tipo}
                </p>

                <p>
                    <strong>Ubicación:</strong> {maquina.ubicacion ?? "-"}
                </p>

                <p>
                    <strong>Estado actual:</strong> {maquina.estado}
                </p>

                {/* Confirmación de baja */}
                {maquina.estado === "De baja" ? (

                    <p className="baja-maquina-aviso">
                        Esta máquina ya está dada de baja.
                    </p>

                ) : (

                    <div className="baja-maquina-advertencia">
                        <p>
                            ¿Estás seguro de que deseas dar de baja esta máquina?
                        </p>

                        <p>
                            <strong>Advertencia:</strong> Este cambio es irreversible.
                            La máquina pasará al estado "De baja" y no podrá volver
                            a estar operativa.
                        </p>
                    </div>

                )}

                {/* Mensajes de error */}
                {error && (
                    <p className="baja-maquina-error" role="alert">
                        {error}
                    </p>
                )}

                {/* Acciones */}
                <div className="baja-maquina-acciones">

                    <button
                        type="button"
                        onClick={cancelar}
                        disabled={procesando}
                        className="boton-cancelar-baja"
                    >
                        Volver
                    </button>

                    {maquina.estado !== "De baja" && (

                        <button
                            type="button"
                            onClick={confirmarBaja}
                            disabled={procesando}
                            className="boton-confirmar-baja"
                        >
                            {procesando
                                ? "Procesando..."
                                : "Confirmar baja"}
                        </button>

                    )}

                </div>

            </div>

        </div>
    );
}

export default BajaMaquina;