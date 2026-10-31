import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";

import { crearImputacion } from "../api/imputaciones";
import { obtenerAverias } from "../api/averias";
import { obtenerPersonas } from "../api/personas";

import type { ImputacionHorasCrear } from "../types/imputacion";
import type { AveriaRespuesta } from "../types/averia";
import type { PersonaRespuesta } from "../types/persona";

import "../styles/CrearImputaciones.css";

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

    useEffect(() => {

        // Consultar averías y personas registradas
        Promise.all([
            obtenerAverias(),
            obtenerPersonas()
        ])
            .then(([datosAverias, datosPersonas]) => {

                setAverias(datosAverias);

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


                    {/* Seleccionar técnico */}
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
                                averias.length === 0 ||
                                tecnicos.length === 0
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