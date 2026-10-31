import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { crearPersona } from "../api/personas";
import type { PersonaCrear } from "../types/persona";
import type { RolPersona, Especialidad } from "../types/enums";
import "../styles/CrearPersonas.css";

// Opciones de los enumerados
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

function CrearPersona() {

    const navigate = useNavigate();

    // Datos del formulario
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [rol, setRol] = useState<RolPersona | "">("");
    const [especialidad, setEspecialidad] =
        useState<Especialidad | "">("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [costeHora, setCosteHora] = useState("");
    const [activo, setActivo] = useState(true);

    // Control de errores y guardado
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    // Registrar una persona mediante FastAPI
    async function guardarPersona(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!rol) {
            setError("Debes seleccionar un rol.");
            return;
        }

        setError("");
        setGuardando(true);

        try {

            // Construir los datos para el backend
            const datos: PersonaCrear = {
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                rol,
                especialidad: especialidad || null,
                email: email.trim() || null,
                telefono: telefono.trim() || null,
                coste_hora: costeHora.trim() || null,
                activo
            };

            // Registrar la persona en PostgreSQL mediante FastAPI
            await crearPersona(datos);

            // Volver al listado
            navigate("/personas", { replace: true });

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al registrar la persona"
            );
        } finally {
            setGuardando(false);
        }
    }

    // Cancelar sin guardar cambios
    function cancelar() {
        navigate("/personas");
    }

    return (
        <div className="pagina-crear-persona">

            <h2>Registrar persona</h2>
            <p className="campos-obligatorios">
                Los campos marcados con * son obligatorios.
            </p>

            <form
                className="formulario-persona"
                onSubmit={guardarPersona}
            >

                {/* Nombre */}
                <div className="formulario-campo">
                    <label htmlFor="nombre">Nombre*</label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                {/* Apellidos */}
                <div className="formulario-campo">
                    <label htmlFor="apellidos">Apellidos*</label>
                    <input
                        id="apellidos"
                        type="text"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        required
                    />
                </div>

                {/* Rol */}
                <div className="formulario-campo">
                    <label htmlFor="rol">Rol*</label>

                    <select
                        id="rol"
                        value={rol}
                        onChange={(e) =>
                            setRol(e.target.value as RolPersona | "")
                        }
                        required
                    >
                        <option value="">Seleccionar rol</option>

                        {ROLES.map((valor) => (
                            <option key={valor} value={valor}>
                                {valor}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Especialidad */}
                <div className="formulario-campo">
                    <label htmlFor="especialidad">Especialidad</label>

                    <select
                        id="especialidad"
                        value={especialidad}
                        onChange={(e) =>
                            setEspecialidad(e.target.value as Especialidad | "")
                        }
                    >
                        <option value="">Sin especialidad</option>

                        {ESPECIALIDADES.map((valor) => (
                            <option key={valor} value={valor}>
                                {valor}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Email */}
                <div className="formulario-campo">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Teléfono */}
                <div className="formulario-campo">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        id="telefono"
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />
                </div>

                {/* Coste por hora */}
                <div className="formulario-campo">
                    <label htmlFor="costeHora">Coste por hora</label>
                    <input
                        id="costeHora"
                        type="number"
                        min="0"
                        step="0.01"
                        value={costeHora}
                        onChange={(e) => setCosteHora(e.target.value)}
                    />
                </div>

                {/* Estado de la persona */}
                <div className="formulario-campo">
                    <label htmlFor="activo">
                        <input
                            id="activo"
                            type="checkbox"
                            checked={activo}
                            onChange={(e) => setActivo(e.target.checked)}
                        />
                        Persona activa
                    </label>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <p className="formulario-error" role="alert">
                        {error}
                    </p>
                )}

                {/* Botones */}
                <div className="formulario-acciones">

                    <button
                        type="button"
                        onClick={cancelar}
                        disabled={guardando}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={guardando}
                    >
                        {guardando
                            ? "Guardando..."
                            : "Guardar persona"}
                    </button>

                </div>

            </form>
        </div>
    );
}

export default CrearPersona;