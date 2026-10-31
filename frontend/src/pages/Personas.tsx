import { useEffect, useState } from "react";
import { Link } from "react-router";
import { obtenerPersonas } from "../api/personas";
import type { PersonaRespuesta } from "../types/persona";
import type { RolPersona, Especialidad } from "../types/enums";
import "../styles/Personas.css";

// Opciones para los filtros
const ROLES: RolPersona[] = [
    "Técnico de mantenimiento",
    "Operario",
    "Responsable"
];

const ESPECIALIDADES: Especialidad[] = [
    "Mecánica",
    "Eléctrica",
    "Electrónica",
    "Hidráulica",
    "Neumática"
];

function Personas() {

    // Personas registradas en la base de datos
    const [personas, setPersonas] = useState<PersonaRespuesta[]>([]);

    // Control de carga y errores
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Filtros de búsqueda
    const [busqueda, setBusqueda] = useState("");
    const [filtroRol, setFiltroRol] = useState("");
    const [filtroEspecialidad, setFiltroEspecialidad] = useState("");

    useEffect(() => {

        // Consultar las personas mediante FastAPI
        obtenerPersonas()
            .then((datos) => {
                setPersonas(datos);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setCargando(false);
            });

    }, []);

    // Filtrar las personas sin realizar nuevas peticiones HTTP
    const personasFiltradas = personas.filter((persona) => {

        const textoBusqueda = busqueda.trim().toLocaleLowerCase("es");

        const nombreCompleto =
            `${persona.nombre} ${persona.apellidos}`
                .toLocaleLowerCase("es");

        const coincideNombre =
            nombreCompleto.includes(textoBusqueda);

        const coincideRol =
            filtroRol === "" || persona.rol === filtroRol;

        const coincideEspecialidad =
            filtroEspecialidad === "" ||
            persona.especialidad === filtroEspecialidad;

        return coincideNombre && coincideRol && coincideEspecialidad;
    });

        // Comprobar si existe algún filtro activo
        const hayFiltrosActivos =
            busqueda.trim() !== "" ||
            filtroRol !== "" ||
            filtroEspecialidad !== "";

        // Restablecer todos los filtros
        function limpiarFiltros() {
            setBusqueda("");
            setFiltroRol("");
            setFiltroEspecialidad("");
        }

    return (
        <div className="pagina-personas">

            <h2>Gestión de Personas</h2>

            {cargando ? (
                <p>Cargando personas...</p>
            ) : error ? (
                <p className="personas-error">{error}</p>
            ) : (
                <>
                    <p>Personas registradas: {personas.length}</p>

                    {/* Filtros de búsqueda */}
                    <div className="personas-filtros">

                        <div className="personas-campo">
                            <label htmlFor="buscarPersona">
                                Buscar por nombre o apellidos
                            </label>

                            <input
                                id="buscarPersona"
                                type="search"
                                value={busqueda}
                                onChange={(e) =>
                                    setBusqueda(e.target.value)
                                }
                                placeholder="Buscar persona..."
                            />
                        </div>

                        <div className="personas-campo">
                            <label htmlFor="filtroRol">Rol</label>

                            <select
                                id="filtroRol"
                                value={filtroRol}
                                onChange={(e) =>
                                    setFiltroRol(e.target.value)
                                }
                            >
                                <option value="">Todos los roles</option>

                                {ROLES.map((valor) => (
                                    <option key={valor} value={valor}>
                                        {valor}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="personas-campo">
                            <label htmlFor="filtroEspecialidad">
                                Especialidad
                            </label>

                            <select
                                id="filtroEspecialidad"
                                value={filtroEspecialidad}
                                onChange={(e) =>
                                    setFiltroEspecialidad(e.target.value)
                                }
                            >
                                <option value="">
                                    Todas las especialidades
                                </option>

                                {ESPECIALIDADES.map((valor) => (
                                    <option key={valor} value={valor}>
                                        {valor}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Limpiar los filtros de búsqueda */}
                        <div className="personas-limpiar-filtros">
                            <button
                                type="button"
                                onClick={limpiarFiltros}
                                disabled={!hayFiltrosActivos}
                            >
                                Limpiar filtros
                            </button>
                        </div>

                    </div>

                    {/* Tabla de personas registradas */}
                    {personas.length === 0 ? (
                        <p>No hay personas registradas.</p>
                    ) : personasFiltradas.length === 0 ? (
                        <p>No se encontraron personas con esos filtros.</p>
                    ) : (
                        <table className="tabla-personas">

                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellidos</th>
                                    <th>Rol</th>
                                    <th>Especialidad</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Coste/hora</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>

                            <tbody>
                                {personasFiltradas.map((persona) => (
                                    <tr key={persona.id_persona}>
                                        <td>{persona.nombre}</td>
                                        <td>{persona.apellidos}</td>
                                        <td>{persona.rol}</td>
                                        <td>{persona.especialidad ?? "-"}</td>
                                        <td>{persona.email ?? "-"}</td>
                                        <td>{persona.telefono ?? "-"}</td>
                                        <td>{persona.coste_hora ?? "-"}</td>
                                        <td>
                                            {persona.activo
                                                ? "Activo"
                                                : "Inactivo"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}

                </>
            )}

            {/* Acceso al formulario de creación */}
            <div className="personas-acciones">
                <Link
                    to="/personas/crear"
                    className="boton-crear-persona"
                >
                    Crear persona
                </Link>
            </div>

        </div>
    );
}

export default Personas;