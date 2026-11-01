import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { obtenerPersona } from "../../api/personas";
import type { PersonaRespuesta } from "../../types/persona";

import "../../styles/DetallePersona.css";

function DetallePersona() {

    const { id_persona } = useParams();
    const navigate = useNavigate();

    // Datos de la persona seleccionada
    const [persona, setPersona] = useState<PersonaRespuesta | null>(null);

    // Control de errores y carga
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    // Obtener los datos de la persona desde FastAPI
    useEffect(() => {

        let activo = true;

        async function cargarPersona() {

            setCargando(true);
            setError("");

            try {

                const id = Number(id_persona);

                if (!Number.isInteger(id) || id <= 0) {
                    throw new Error("Identificador de persona no válido");
                }

                const datos = await obtenerPersona(id);

                if (activo) {
                    setPersona(datos);
                }

            } catch (error) {

                if (activo) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Error al obtener la persona"
                    );
                }

            } finally {

                if (activo) {
                    setCargando(false);
                }
            }
        }

        cargarPersona();

        return () => {
            activo = false;
        };

    }, [id_persona]);

    if (cargando) {
        return <p>Cargando persona...</p>;
    }

    if (error || !persona) {
        return <p role="alert">{error || "La persona no existe"}</p>;
    }

    return (
        <div className="pagina-personas">

            <h2>Gestionar persona</h2>

            {/* Información de la persona */}
            <div className="detalle-persona">

                <h3>{persona.nombre} {persona.apellidos}</h3>

                <p><strong>Rol:</strong> {persona.rol}</p>
                <p><strong>Especialidad:</strong> {persona.especialidad ?? "-"}</p>
                <p><strong>Email:</strong> {persona.email ?? "-"}</p>
                <p><strong>Teléfono:</strong> {persona.telefono ?? "-"}</p>
                <p><strong>Coste por hora:</strong> {persona.coste_hora ?? "-"}</p>
                <p><strong>Estado:</strong> {persona.activo ? "Activo" : "De baja"}</p>

            </div>

            {/* Acciones disponibles */}
            <div className="personas-acciones">

                <button
                    type="button"
                    onClick={() => navigate("/personas")}
                >
                    Volver
                </button>

                <Link to={`/personas/${persona.id_persona}/editar`}>
                    Editar persona
                </Link>

            </div>

        </div>
    );
}

export default DetallePersona;