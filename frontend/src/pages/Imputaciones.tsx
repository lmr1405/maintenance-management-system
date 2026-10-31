import { useEffect, useState } from "react";
import { obtenerImputaciones } from "../api/imputaciones";
import type { ImputacionHorasRespuesta } from "../types/imputacion";

function Imputaciones() {

    // Almacena las imputaciones recibidas de FastAPI
    const [imputaciones, setImputaciones] = useState<ImputacionHorasRespuesta[]>([]);

    // Almacena posibles errores de conexión
    const [error, setError] = useState("");

    // Controla si la consulta sigue en curso
    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        // Obtener las imputaciones utilizando la API
        obtenerImputaciones()
            .then((datos) => {
                setImputaciones(datos);
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
            <h2>Imputación de Horas</h2>

            {cargando ? (
                <p>Cargando imputaciones...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <p>Imputaciones registradas: {imputaciones.length}</p>

                    {imputaciones.length === 0 ? (
                        <p>No hay imputaciones registradas.</p>
                    ) : (
                        <ul>
                            {imputaciones.map((imputacion) => (
                                <li key={imputacion.id_imputacion}>
                                    Avería Nº {imputacion.id_averia}
                                    {" - "}
                                    {imputacion.horas} horas
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default Imputaciones;
