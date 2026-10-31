import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";

import { crearAveria } from "../api/averias";
import { obtenerMaquinas } from "../api/maquinas";
import { obtenerPersonas } from "../api/personas";

import type { AveriaCrear } from "../types/averia";
import type { MaquinaRespuesta } from "../types/maquina";
import type { PersonaRespuesta } from "../types/persona";
import type { TipoFallo, Prioridad } from "../types/enums";

import "../styles/CrearAveria.css";

// Opciones de los enumerados
const TIPOS_FALLO: TipoFallo[] = [
    "Mecánico",
    "Eléctrico",
    "Electrónico",
    "Hidráulico",
    "Neumático",
    "Software",
    "Otro"
];

const PRIORIDADES: Prioridad[] = [
    "Urgente",
    "Alta",
    "Media",
    "Baja"
];

// Obtener la fecha local actual
function obtenerFechaActual(): string {
    const ahora = new Date();

    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function CrearAveria() {

    const navigate = useNavigate();

    // Datos obtenidos de FastAPI
    const [maquinas, setMaquinas] = useState<MaquinaRespuesta[]>([]);
    const [personas, setPersonas] = useState<PersonaRespuesta[]>([]);

    // Datos del formulario
    const [numero, setNumero] = useState("");
    const [titulo, setTitulo] = useState("");
    const [idMaquina, setIdMaquina] = useState("");
    const [idReportadaPor, setIdReportadaPor] = useState("");

    const [fechaDeteccion, setFechaDeteccion] =
        useState(obtenerFechaActual);

    const [sintoma, setSintoma] = useState("");
    const [tipoFallo, setTipoFallo] = useState<TipoFallo | "">("");
    const [prioridad, setPrioridad] = useState<Prioridad | "">("");
    const [maquinaParada, setMaquinaParada] = useState(false);

    // Control de carga, errores y guardado
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [errorCarga, setErrorCarga] = useState("");
    const [errorRegistro, setErrorRegistro] = useState("");

    useEffect(() => {

        // Consultar máquinas y personas registradas
        Promise.all([
            obtenerMaquinas(),
            obtenerPersonas()
        ])
            .then(([datosMaquinas, datosPersonas]) => {

                // Excluir máquinas dadas de baja
                setMaquinas(
                    datosMaquinas.filter(
                        (maquina) => maquina.estado !== "De baja"
                    )
                );

                // Mostrar únicamente personas activas
                setPersonas(
                    datosPersonas.filter(
                        (persona) => persona.activo
                    )
                );
            })
            .catch((error) => {
                setErrorCarga(error.message);
            })
            .finally(() => {
                setCargando(false);
            });

    }, []);

    // Registrar una nueva avería
    async function guardarAveria(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (
            !numero.trim() ||
            !titulo.trim() ||
            !idMaquina ||
            !idReportadaPor ||
            !fechaDeteccion ||
            !sintoma.trim() ||
            !tipoFallo ||
            !prioridad
        ) {
            setErrorRegistro("Completa todos los campos obligatorios.");
            return;
        }

        setErrorRegistro("");
        setGuardando(true);

        try {

            // Construir los datos de detección de la avería
            const datos: AveriaCrear = {
                numero: numero.trim(),
                id_maquina: Number(idMaquina),
                id_reportada_por: Number(idReportadaPor),
                fecha_deteccion: fechaDeteccion,
                titulo: titulo.trim(),
                sintoma: sintoma.trim(),
                tipo_fallo: tipoFallo,
                prioridad,
                maquina_parada: maquinaParada
            };

            // Registrar la avería mediante FastAPI
            await crearAveria(datos);

            // Volver al listado de averías
            navigate("/averias", { replace: true });

        } catch (error) {
            setErrorRegistro(
                error instanceof Error
                    ? error.message
                    : "Error al registrar la avería"
            );
        } finally {
            setGuardando(false);
        }
    }

    // Cancelar sin guardar
    function cancelar() {
        navigate("/averias");
    }

    return (
        <div className="pagina-nueva-averia">

            <h2>Registrar nueva avería</h2>

            <p>Los campos marcados con * son obligatorios.</p>

            {cargando ? (
                <p>Cargando máquinas y personas...</p>
            ) : errorCarga ? (
                <>
                    <p className="formulario-error" role="alert">
                        {errorCarga}
                    </p>

                    <button type="button" onClick={cancelar}>
                        Volver a averías
                    </button>
                </>
            ) : (
                <form
                    className="formulario-averia"
                    onSubmit={guardarAveria}
                >

                    {/* Número de avería */}
                    <div className="formulario-campo">
                        <label htmlFor="numero">
                            Número de avería *
                        </label>

                        <input
                            id="numero"
                            type="text"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            placeholder="Ej. AV-001"
                            required
                        />
                    </div>

                    {/* Título */}
                    <div className="formulario-campo">
                        <label htmlFor="titulo">
                            Título *
                        </label>

                        <input
                            id="titulo"
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Título de la incidencia"
                            required
                        />
                    </div>

                    {/* Máquina afectada */}
                    <div className="formulario-campo">
                        <label htmlFor="idMaquina">
                            Máquina *
                        </label>

                        <select
                            id="idMaquina"
                            value={idMaquina}
                            onChange={(e) => setIdMaquina(e.target.value)}
                            required
                        >
                            <option value="">Seleccionar máquina</option>

                            {maquinas.map((maquina) => (
                                <option
                                    key={maquina.id_maquina}
                                    value={maquina.id_maquina}
                                >
                                    {maquina.codigo} - {maquina.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Persona que detecta la avería */}
                    <div className="formulario-campo">
                        <label htmlFor="idReportadaPor">
                            Detectada por *
                        </label>

                        <select
                            id="idReportadaPor"
                            value={idReportadaPor}
                            onChange={(e) =>
                                setIdReportadaPor(e.target.value)
                            }
                            required
                        >
                            <option value="">Seleccionar persona</option>

                            {personas.map((persona) => (
                                <option
                                    key={persona.id_persona}
                                    value={persona.id_persona}
                                >
                                    {persona.nombre} {persona.apellidos}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha de detección */}
                    <div className="formulario-campo">
                        <label htmlFor="fechaDeteccion">
                            Fecha de detección *
                        </label>

                        <input
                            id="fechaDeteccion"
                            type="date"
                            value={fechaDeteccion}
                            onChange={(e) =>
                                setFechaDeteccion(e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* Síntoma detectado */}
                    <div className="formulario-campo">
                        <label htmlFor="sintoma">
                            Síntoma detectado *
                        </label>

                        <textarea
                            id="sintoma"
                            value={sintoma}
                            onChange={(e) => setSintoma(e.target.value)}
                            placeholder="Describe la incidencia detectada..."
                            rows={4}
                            required
                        />
                    </div>

                    {/* Tipo de fallo */}
                    <div className="formulario-campo">
                        <label htmlFor="tipoFallo">
                            Tipo de fallo *
                        </label>

                        <select
                            id="tipoFallo"
                            value={tipoFallo}
                            onChange={(e) =>
                                setTipoFallo(e.target.value as TipoFallo | "")
                            }
                            required
                        >
                            <option value="">
                                Seleccionar tipo de fallo
                            </option>

                            {TIPOS_FALLO.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Prioridad */}
                    <div className="formulario-campo">
                        <label htmlFor="prioridad">
                            Prioridad *
                        </label>

                        <select
                            id="prioridad"
                            value={prioridad}
                            onChange={(e) =>
                                setPrioridad(e.target.value as Prioridad | "")
                            }
                            required
                        >
                            <option value="">Seleccionar prioridad</option>

                            {PRIORIDADES.map((valor) => (
                                <option key={valor} value={valor}>
                                    {valor}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Máquina parada */}
                    <div className="formulario-campo">
                        <label htmlFor="maquinaParada">
                            <input
                                id="maquinaParada"
                                type="checkbox"
                                checked={maquinaParada}
                                onChange={(e) =>
                                    setMaquinaParada(e.target.checked)
                                }
                            />
                            Máquina parada
                        </label>
                    </div>

                    {/* Errores de registro */}
                    {errorRegistro && (
                        <p className="formulario-error" role="alert">
                            {errorRegistro}
                        </p>
                    )}

                    {/* Botones del formulario */}
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
                                maquinas.length === 0 ||
                                personas.length === 0
                            }
                        >
                            {guardando
                                ? "Guardando..."
                                : "Registrar avería"}
                        </button>

                    </div>

                </form>
            )}

        </div>
    );
}

export default CrearAveria;