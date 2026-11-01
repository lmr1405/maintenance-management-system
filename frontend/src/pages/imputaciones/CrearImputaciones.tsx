/**
 * Página CrearImputacion.
 * Muestra el formulario para registrar las horas de trabajo
 * dedicadas por los técnicos a las reparaciones de averías.
 *
 * Funcionamiento:
 * - Obtiene las averías en curso y los técnicos activos desde FastAPI.
 * - Permite seleccionar la avería y el técnico que realiza el trabajo.
 * - Establece la fecha actual por defecto.
 * - Permite registrar las horas y la descripción de la intervención.
 * - Valida los datos antes de enviar la imputación al backend.
 * - Redirige al listado de imputaciones después del registro.
 */
import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";

import { crearImputacion } from "../../api/imputaciones";
import { obtenerAverias } from "../../api/averias";
import { obtenerPersonas } from "../../api/personas";

import type { ImputacionHorasCrear } from "../../types/imputacion";
import type { AveriaRespuesta } from "../../types/averia";
import type { PersonaRespuesta } from "../../types/persona";

import "../../styles/CrearImputaciones.css";

// Obtener la fecha local actual
function obtenerFechaActual(): string {
    const ahora = new Date();

    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function CrearImputacion() {

    const navigate = useNavigate();

    // Datos obtenidos de FastAPI
    const [averias, setAverias] = useState<AveriaRespuesta[]>([]);
    const [tecnicos, setTecnicos] = useState<PersonaRespuesta[]>([]);

    // Datos del formulario
    const [idAveria, setIdAveria] = useState("");
    const [idTecnico, setIdTecnico] = useState("");
    const [fecha, setFecha] = useState(obtenerFechaActual);
    const [horas, setHoras] = useState("");
    const [descripcion, setDescripcion] = useState("");

    // Control de carga, errores y guardado
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    // Obtener la avería seleccionada para mostrar su información
    const averiaSeleccionada = averias.find(
        (averia) => averia.id_averia === Number(idAveria)
    );

    // Obtener el técnico asignado a esa avería
    const tecnicoAsignado = tecnicos.find(
        (tecnico) =>
            tecnico.id_persona === averiaSeleccionada?.id_tecnico_asignado
    );

    useEffect(() => {

        // Consultar averías y personas registradas
        Promise.all([
            obtenerAverias(),
            obtenerPersonas()
        ])
            .then(([datosAverias, datosPersonas]) => {

                // Mostrar únicamente averías en curso con técnico asignado
                setAverias(
                    datosAverias.filter(
                        (averia) =>
                            averia.estado === "En curso" &&
                            averia.id_tecnico_asignado !== null
                    )
                );

                // Mostrar únicamente técnicos activos
                const personasTecnicas = datosPersonas.filter(
                    (persona) =>
                        persona.rol === "Técnico de mantenimiento" &&
                        persona.activo
                );

                setTecnicos(personasTecnicas);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setCargando(false);
            });

    }, []);

    // Registrar las horas de trabajo
    async function guardarImputacion(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        // Comprobar la avería y el técnico seleccionados
        if (
            !averiaSeleccionada ||
            averiaSeleccionada.estado !== "En curso" ||
            !idTecnico ||
            !tecnicos.some(
                (tecnico) => tecnico.id_persona === Number(idTecnico)
            )
        ) {
            setError("Selecciona una avería en curso y un técnico activo");
            return;
        }

        setError("");
        setGuardando(true);

        try {

            // Construir los datos para FastAPI
            const datos: ImputacionHorasCrear = {
                id_averia: Number(idAveria),
                id_tecnico: Number(idTecnico),
                fecha,
                horas,
                descripcion_trabajo: descripcion.trim()
            };

            // Registrar la imputación
            await crearImputacion(datos);

            // Volver al listado
            navigate("/imputaciones", { replace: true });

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al registrar la imputación"
            );
        } finally {
            setGuardando(false);
        }
    }

    // Cancelar sin guardar
    function cancelar() {
        navigate("/imputaciones");
    }

    return (
        <div className="pagina-crear-imputacion">

            <h2>Registrar imputación de horas</h2>

            <p>Los campos marcados con * son obligatorios.</p>

            {cargando ? (
                <p>Cargando averías y técnicos...</p>
            ) : (
                <form
                    className="formulario-imputacion"
                    onSubmit={guardarImputacion}
                >

                    
                {/* Seleccionar avería */}
                <div className="formulario-campo">
                    <label htmlFor="idAveria">Avería *</label>

                    <select
                        id="idAveria"
                        value={idAveria}
                        onChange={(e) => setIdAveria(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar avería</option>

                        {averias.map((averia) => (
                            <option
                                key={averia.id_averia}
                                value={averia.id_averia}
                            >
                                {averia.numero}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Informar cuando no existen averías disponibles */}
                {averias.length === 0 && (
                    <p className="formulario-error">
                        No hay averías en curso disponibles para imputar horas.
                    </p>
                )}

                {/* Título de la avería seleccionada */}
                <div className="formulario-campo">
                    <label htmlFor="tituloAveria">
                        Título de la avería
                    </label>

                    <input
                        id="tituloAveria"
                        type="text"
                        value={averiaSeleccionada?.titulo ?? ""}
                        placeholder="Selecciona una avería"
                        readOnly
                    />
                </div>


                {/* Seleccionar técnico que realiza el trabajo */}
                <div className="formulario-campo">
                    <label htmlFor="idTecnico">Técnico *</label>

                    <select
                        id="idTecnico"
                        value={idTecnico}
                        onChange={(e) => setIdTecnico(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar técnico</option>

                        {tecnicos.map((tecnico) => (
                            <option
                                key={tecnico.id_persona}
                                value={tecnico.id_persona}
                            >
                                {tecnico.nombre} {tecnico.apellidos}
                            </option>
                        ))}
                    </select>
                </div>

                    {/* Fecha del trabajo */}
                    <div className="formulario-campo">
                        <label htmlFor="fecha">Fecha *</label>

                        <input
                            id="fecha"
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>

                    {/* Horas trabajadas */}
                    <div className="formulario-campo">
                        <label htmlFor="horas">Horas trabajadas *</label>

                        <input
                            id="horas"
                            type="number"
                            min="0.25"
                            step="0.25"
                            value={horas}
                            onChange={(e) => setHoras(e.target.value)}
                            placeholder="Ej. 1.50"
                            required
                        />
                    </div>

                    {/* Descripción del trabajo */}
                    <div className="formulario-campo">
                        <label htmlFor="descripcion">
                            Descripción del trabajo *
                        </label>

                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Describe la intervención realizada..."
                            rows={5}
                            required
                        />
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
                            disabled={
                                guardando ||
                                !averiaSeleccionada ||
                                !idTecnico
                            }
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar imputación"}
                        </button>

                    </div>

                </form>
            )}
        </div>
    );
}

export default CrearImputacion;