import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router";

import { obtenerPersona, actualizarPersona } from "../../api/personas";
import type { PersonaCrear, PersonaRespuesta } from "../../types/persona";
import type { RolPersona, Especialidad } from "../../types/enums";

import "../../styles/CrearPersonas.css";

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

function EditarPersona() {

    const { id_persona } = useParams();
    const navigate = useNavigate();

    // Datos originales de la persona
    const [persona, setPersona] = useState<PersonaRespuesta | null>(null);

    // Datos editables del formulario
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [rol, setRol] = useState<RolPersona | "">("");
    const [especialidad, setEspecialidad] = useState<Especialidad | "">("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [costeHora, setCosteHora] = useState("");
    const [activo, setActivo] = useState(true);

    // Control de carga, errores y guardado
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    // Recuperar la persona y cargar sus datos
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

                if (!activo) return;

                setPersona(datos);
                setNombre(datos.nombre);
                setApellidos(datos.apellidos);
                setRol(datos.rol);
                setEspecialidad(datos.especialidad ?? "");
                setEmail(datos.email ?? "");
                setTelefono(datos.telefono ?? "");
                setCosteHora(datos.coste_hora ?? "");
                setActivo(datos.activo);

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

    // Guardar las modificaciones mediante FastAPI
    async function guardarCambios(e: SubmitEvent<HTMLFormElement>) {

        e.preventDefault();

        if (!persona || !rol) return;

        setError("");
        setGuardando(true);

        try {

            const datos: PersonaCrear = {
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                rol,
                especialidad: especialidad || null,
                email: email.trim() || null,
                telefono: telefono.trim() || null,
                coste_hora: costeHora.trim() || null,

                // Conservar el estado original de la persona
                activo: activo
            };

            await actualizarPersona(persona.id_persona, datos);

            // Regresar al listado de personas
            navigate("/personas", { replace: true });

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "Error al actualizar la persona"
            );

        } finally {
            setGuardando(false);
        }
    }

    // Cancelar la edición sin guardar
    function cancelar() {
        navigate("/personas");
    }

    if (cargando) {
        return <p>Cargando persona...</p>;
    }

    if (!persona) {
        return <p role="alert">{error || "La persona no existe"}</p>;
    }

    return (
        <div className="pagina-crear-persona">

            <h2>Editar persona</h2>

            <p className="campos-obligatorios">
                Los campos marcados con * son obligatorios.
            </p>

            <form
                className="formulario-persona"
                onSubmit={guardarCambios}
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
                    <label htmlFor="activo">Estado</label>
                    <select
                        id="activo"
                        value={activo ? "true" : "false"}
                        onChange={(e) => setActivo(e.target.value === "true")}
                    >
                        <option value="true">Activo</option>
                        <option value="false">De baja</option>
                    </select>
                </div>

                {/* Mensajes de error */}
                {error && (
                    <p className="formulario-error" role="alert">
                        {error}
                    </p>
                )}

                {/* Acciones */}
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
                            : "Guardar cambios"}
                    </button>

                </div>

            </form>
        </div>
    );
}

export default EditarPersona;