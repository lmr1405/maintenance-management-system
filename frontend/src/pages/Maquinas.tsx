import { useEffect, useState } from "react";
import { obtenerMaquinas } from "../api/maquinas";
import type { MaquinaRespuesta } from "../types/maquina";

function Maquinas() {

    // Almacena las máquinas recibidas de FastAPI
    const [maquinas, setMaquinas] = useState<MaquinaRespuesta[]>([]);

    // Almacena posibles errores de conexión
    const [error, setError] = useState("");

    useEffect(() => {

        /// Consultar las máquinas mediante la capa API
        obtenerMaquinas()
            .then((datos) => {
                setMaquinas(datos);
            })
            .catch((error) => {
                setError(error.message);
            });

    }, []);

    return (
        <div>
            <h2>Gestión de Máquinas</h2>

            {error && <p>{error}</p>}

            <p>Máquinas registradas: {maquinas.length}</p>

            {maquinas.length === 0 ? (
                <p>No hay máquinas registradas.</p>
            ) : (
                <ul>
                    {maquinas.map((maquina) => (
                        <li key={maquina.id_maquina}>
                            {maquina.codigo} - {maquina.nombre}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Maquinas;