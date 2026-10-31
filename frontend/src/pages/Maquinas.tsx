import "../styles/Maquinas.css"
import { useEffect, useState } from "react";
import { obtenerMaquinas } from "../api/maquinas";
import type { MaquinaRespuesta } from "../types/maquina";

function Maquinas() {

    // Almacena las máquinas recibidas de FastAPI
    const [maquinas, setMaquinas] = useState<MaquinaRespuesta[]>([]);

    // Controla los errores y el estado de carga
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        // Consultar las máquinas utilizando la capa API
        obtenerMaquinas()
            .then((datos) => {
                setMaquinas(datos);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setCargando(false);
            });

    }, []);

    return (
        <div className="pagina-maquinas">

            <h2>Gestión de Máquinas</h2>

            {cargando ? (
                <p>Cargando máquinas...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <p>Máquinas registradas: {maquinas.length}</p>

                    {maquinas.length === 0 ? (
                        <p>No hay máquinas registradas.</p>
                    ) : (
                        <table className="tabla-maquinas">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Ubicación</th>
                                    <th>Criticidad</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>

                            <tbody>
                                {maquinas.map((maquina) => (
                                    <tr key={maquina.id_maquina}>
                                        <td>{maquina.codigo}</td>
                                        <td>{maquina.nombre}</td>
                                        <td>{maquina.tipo}</td>
                                        <td>{maquina.ubicacion ?? "-"}</td>
                                        <td>{maquina.criticidad ?? "-"}</td>
                                        <td>{maquina.estado}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
}

export default Maquinas;
