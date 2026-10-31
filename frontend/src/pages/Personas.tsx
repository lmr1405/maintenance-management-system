import { useEffect, useState } from "react";
import { obtenerPersonas } from "../api/personas";
import type { PersonaRespuesta } from "../types/persona";

function Personas() {

    // Almacena las personas recibidas de FastAPI
    const [personas, setPersonas] = useState<PersonaRespuesta[]>([]);

    // Almacena posibles errores de conexión
    const [error, setError] = useState("");

    useEffect(() => {

        // Obtener las personas utilizando la API
        obtenerPersonas()
            .then((datos) => {
                setPersonas(datos);
            })
            .catch((error) => {
                setError(error.message);
            });

    }, []);

    return (
        <div>
            <h2>Gestión de Personas</h2>

            {error && <p>{error}</p>}

            <h3>Personas registradas</h3>

            {personas.length === 0 ? (
                <p>No hay personas registradas.</p>
            ) : (
                <pre>{JSON.stringify(personas, null, 2)}</pre>
            )}
        </div>
    );
}

export default Personas;