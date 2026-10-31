
import { useEffect, useState } from "react";
import { obtenerAverias } from "../api/averias";
import type { AveriaRespuesta } from "../types/averia";

function Averias() {

    // Almacena las averías recibidas de FastAPI
    const [averias, setAverias] = useState<AveriaRespuesta[]>([]);

    // Almacena posibles errores de conexión
    const [error, setError] = useState("");

    // Controla si la consulta sigue en curso
    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        // Obtener las averías utilizando la API
        obtenerAverias()
            .then((datos) => {
                setAverias(datos);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setCargando(false);
            });

    }, []);

    return (
        <div>
            <h2>Gestión de Averías</h2>

            {cargando ? (
                <p>Cargando averías...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <p>Averías registradas: {averias.length}</p>

                    {averias.length === 0 ? (
                        <p>No hay averías registradas.</p>
                    ) : (
                        <ul>
                            {averias.map((averia) => (
                                <li key={averia.id_averia}>
                                    Avería Nº {averia.numero}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default Averias;
