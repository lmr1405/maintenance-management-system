/**
 * Página DetalleAveria.
 * Muestra la información de una avería y permite gestionar
 * las distintas etapas de su ciclo de vida.
 *
 * Funcionamiento:
 * - Obtiene los datos de la avería y las personas desde FastAPI.
 * - Permite asignar un técnico a una avería abierta.
 * - Permite iniciar la reparación de una avería asignada.
 * - Permite resolver la avería registrando la causa y solución.
 * - Muestra los datos de reparación y el tiempo de parada.
 * - Permite cerrar la avería mediante la validación de un responsable.
 * - Muestra mensajes de confirmación después de cada operación.
 */
import "../../styles/DetalleAveria.css"
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import { obtenerAveria, asignarTecnico, iniciarReparacion, resolverAveria, cerrarAveria } from "../../api/averias";
import { obtenerPersonas } from "../../api/personas";

import type { AveriaRespuesta } from "../../types/averia";
import type { PersonaRespuesta } from "../../types/persona";
import type { TipoSolucion } from "../../types/enums";

// importamos la venta de aceptar
import ModalConfirmacion from "../../components/ModalConfirmacion";

// Página para consultar y gestionar una avería
function DetalleAveria() {

    const { id } = useParams();
    const navigate = useNavigate();

    // Datos obtenidos de FastAPI
    const [averia, setAveria] = useState<AveriaRespuesta | null>(null);
    const [tecnicos, setTecnicos] = useState<PersonaRespuesta[]>([]);

    // Técnico seleccionado para la asignación
    const [idTecnico, setIdTecnico] = useState("");

    // Control de carga, errores y guardado
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    // Control de la ventana de confirmación
    const [mostrarModal, setMostrarModal] = useState(false);

    // Mensajes de confirmación según la operación
    const [tituloModal, setTituloModal] = useState("");
    const [mensajeModal, setMensajeModal] = useState("");

    // Datos necesarios para resolver la avería
    const [causaRaiz, setCausaRaiz] = useState("");
    const [solucionAplicada, setSolucionAplicada] = useState("");

    // Información adicional de la reparación
    const [repuestosSustituidos, setRepuestosSustituidos] = useState("");
    const [tipoSolucion, setTipoSolucion] = useState<TipoSolucion | "">("");
    const [recomendacionPreventiva, setRecomendacionPreventiva] = useState("");

    // Responsable seleccionado para cerrar la avería
    const [idResponsable, setIdResponsable] = useState("");

    // Personas que pueden validar el cierre
    const [responsables, setResponsables] = useState<PersonaRespuesta[]>([]);

    useEffect(() => {

        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            setError("Identificador de avería no válido");
            setCargando(false);
            return;
        }

        // Consultar la avería y las personas registradas
        Promise.all([
            obtenerAveria(Number(id)),
            obtenerPersonas()
        ])
            .then(([datosAveria, datosPersonas]) => {

                setAveria(datosAveria);

                // Conservar técnicos activos y dados de baja para el historial
                const personasTecnicas = datosPersonas.filter(
                    (persona) =>
                        persona.rol === "Técnico de mantenimiento"
                );

                setTecnicos(personasTecnicas);

                // Mostrar únicamente responsables activos
                const personasResponsables = datosPersonas.filter(
                    (persona) =>
                        persona.rol === "Responsable" 
                );

                setResponsables(personasResponsables);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setCargando(false);
            });

    }, [id]);

    // Asignar un técnico a la avería
    async function guardarAsignacion() {

        if (!averia || !idTecnico) {
            return;
        }

        setError("");
        setGuardando(true);

        try {

            // Solicitar la asignación a FastAPI
            await asignarTecnico(
                averia.id_averia,
                Number(idTecnico)
            );

            // Mostrar confirmación después de asignar correctamente
            setTituloModal("Técnico asignado correctamente");
            setMensajeModal("La avería ha cambiado al estado Asignada.");
            setMostrarModal(true);

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al asignar el técnico"
            );
        } finally {
            setGuardando(false);
        }
    }

    // Iniciar la reparación de una avería asignada
    async function comenzarReparacion() {

        if (!averia || averia.estado !== "Asignada") {
            return;
        }

        setError("");
        setGuardando(true);

        try {

                await iniciarReparacion(
                    averia.id_averia
                );

                // Mostrar confirmación
                setTituloModal("Reparación iniciada correctamente");
                setMensajeModal("La avería ha cambiado al estado En curso.");
                setMostrarModal(true);

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al iniciar la reparación"
            );
        } finally {
            setGuardando(false);
        }
    }

    // Resolver una avería cuya reparación ha finalizado
    async function finalizarReparacion() {

        if (!averia || averia.estado !== "En curso") {
            return;
        }

        if (!causaRaiz.trim() || !solucionAplicada.trim()) {
            setError("Debes indicar la causa raíz y la solución aplicada");
            return;
        }

        setError("");
        setGuardando(true);

        try {

            // Comprobar que existe un técnico asignado
            if (averia.id_tecnico_asignado === null) {
                setError("La avería no tiene un técnico asignado");
                return;
            }

            // Solicitar a FastAPI la resolución de la avería
            await resolverAveria(
                averia.id_averia,
                averia.id_tecnico_asignado,
                causaRaiz.trim(),
                solucionAplicada.trim(),
                repuestosSustituidos.trim() || null,
                tipoSolucion || null,
                recomendacionPreventiva.trim() || null
            );

            // Mostrar confirmación de resolución
            setTituloModal("Avería resuelta correctamente");
            setMensajeModal("La avería ha cambiado al estado Resuelta.");
            setMostrarModal(true);

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al resolver la avería"
            );
        } finally {
            setGuardando(false);
        }
    }

    // Cerrar una avería que ya ha sido resuelta
    async function finalizarAveria() {

        if (!averia || averia.estado !== "Resuelta") {
            return;
        }

        if (!idResponsable) {
            setError("Debes seleccionar un responsable");
            return;
        }

        setError("");
        setGuardando(true);

        try {

            // Buscar el responsable que valida el cierre
            const responsable = responsables.find(
                (persona) => persona.id_persona === Number(idResponsable)
            );

            // Solicitar a FastAPI el cierre de la avería
            await cerrarAveria(
                averia.id_averia,
                Number(idResponsable)
            );

            // Mostrar confirmación del cierre
            setTituloModal("Avería cerrada correctamente");

            setMensajeModal(
                responsable
                    ? `La avería ha sido cerrada por ${responsable.nombre} ${responsable.apellidos}.`
                    : "La avería ha sido cerrada por el responsable."
            );

            setMostrarModal(true);

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al cerrar la avería"
            );
        } finally {
            setGuardando(false);
        }
    }

    return (
        <div className="pagina-detalle-averia">

            <h2>Detalle de avería</h2>

            {cargando ? (
                <p>Cargando avería...</p>
            ) : !averia ? (
                <p>{error || "No se encontró la avería."}</p>
            ) : (
                <>
                    <h3>{averia.numero} - {averia.titulo}</h3>

                    <p><strong>Estado:</strong> {averia.estado}</p>
                    <p><strong>Prioridad:</strong> {averia.prioridad}</p>
                    <p><strong>Síntoma:</strong> {averia.sintoma}</p>

                    <h3>Asignación de técnico</h3>

                    {averia.estado === "Abierta" ? (
                        <div>

                            <label htmlFor="idTecnico">
                                Seleccionar técnico
                            </label>

                            <select
                                id="idTecnico"
                                value={idTecnico}
                                onChange={(e) => setIdTecnico(e.target.value)}
                            >
                                <option value="">
                                    Seleccionar técnico
                                </option>

                                {tecnicos.filter((tecnico) => tecnico.activo).map((tecnico) => (
                                    <option
                                        key={tecnico.id_persona}
                                        value={tecnico.id_persona}
                                    >
                                        {tecnico.nombre} {tecnico.apellidos}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={guardarAsignacion}
                                disabled={guardando || !idTecnico}
                            >
                                {guardando
                                    ? "Asignando..."
                                    : "Asignar técnico"}
                            </button>

                        </div>
                    ) : (
                        <p>
                            <strong>Técnico asignado:</strong>{" "}
                            {(() => {
                                // Buscar el técnico asignado a la avería
                                const tecnico = tecnicos.find(
                                    (tecnico) =>
                                        tecnico.id_persona === averia.id_tecnico_asignado
                                );

                                if (!tecnico) {
                                    return averia.id_tecnico_asignado === null
                                        ? "Sin asignar"
                                        : "Técnico no disponible";
                                }

                                // Mostrar el nombre y avisar si está dado de baja
                                return `${tecnico.nombre} ${tecnico.apellidos}${
                                    !tecnico.activo ? " (Técnico dado de baja)" : ""
                                }`;
                            })()}
                        </p>
                    )}

                    {/* Iniciar reparación cuando la avería esté asignada */}
                    {averia.estado === "Asignada" && (
                        <button
                            type="button"
                            onClick={comenzarReparacion}
                            disabled={guardando}
                        >
                            {guardando
                                ? "Iniciando..."
                                : "Iniciar reparación"}
                        </button>
                    )}

                    {/* Resolver la avería cuando esté en curso */}
                    {averia.estado === "En curso" && (
                        <div className="formulario-resolucion">

                            <h3>Resolver avería</h3>

                            <div className="formulario-campo">
                                <label htmlFor="causaRaiz">Causa raíz *</label>

                                <textarea
                                    id="causaRaiz"
                                    value={causaRaiz}
                                    onChange={(e) => setCausaRaiz(e.target.value)}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="formulario-campo">
                                <label htmlFor="solucionAplicada">
                                    Solución aplicada *
                                </label>

                                <textarea
                                    id="solucionAplicada"
                                    value={solucionAplicada}
                                    onChange={(e) => setSolucionAplicada(e.target.value)}
                                    rows={3}
                                    required
                                />
                            </div>

                            {/* Repuestos sustituidos */}
                            <div className="formulario-campo">
                                <label htmlFor="repuestosSustituidos">
                                    Repuestos sustituidos
                                </label>

                                <textarea
                                    id="repuestosSustituidos"
                                    value={repuestosSustituidos}
                                    onChange={(e) => setRepuestosSustituidos(e.target.value)}
                                    rows={3}
                                    placeholder="Indica los repuestos utilizados..."
                                />
                            </div>

                            {/* Tipo de solución */}
                            <div className="formulario-campo">
                                <label htmlFor="tipoSolucion">
                                    Tipo de solución
                                </label>

                                <select
                                    id="tipoSolucion"
                                    value={tipoSolucion}
                                    onChange={(e) =>
                                        setTipoSolucion(e.target.value as TipoSolucion | "")
                                    }
                                >
                                    <option value="">Seleccionar tipo de solución</option>
                                    <option value="Reparación definitiva">Reparación definitiva</option>
                                    <option value="Reparación provisional">Reparación provisional</option>
                                    <option value="Sustitución">Sustitución</option>
                                    <option value="Ajuste">Ajuste</option>
                                </select>
                            </div>

                            {/* Recomendación preventiva */}
                            <div className="formulario-campo">
                                <label htmlFor="recomendacionPreventiva">
                                    Recomendación preventiva
                                </label>

                                <textarea
                                    id="recomendacionPreventiva"
                                    value={recomendacionPreventiva}
                                    onChange={(e) => setRecomendacionPreventiva(e.target.value)}
                                    rows={3}
                                    placeholder="Medidas para evitar futuras averías..."
                                />
                            </div>

                            <button
                                type="button"
                                onClick={finalizarReparacion}
                                disabled={guardando}
                            >
                                {guardando
                                    ? "Resolviendo..."
                                    : "Resolver avería"}
                            </button>

                        </div>
                    )}

                    {/* Mostrar información de la reparación */}
                    {(averia.estado === "Resuelta" || averia.estado === "Cerrada") && (
                        <div className="detalle-resolucion">

                            <h3>Información de la reparación</h3>

                            {averia.causa_raiz && (
                                <p>
                                    <strong>Causa raíz:</strong> {averia.causa_raiz}
                                </p>
                            )}

                            {averia.solucion_aplicada && (
                                <p>
                                    <strong>Solución aplicada:</strong> {averia.solucion_aplicada}
                                </p>
                            )}

                            {averia.repuestos_sustituidos && (
                                <p>
                                    <strong>Repuestos sustituidos:</strong> {averia.repuestos_sustituidos}
                                </p>
                            )}

                            {averia.tipo_solucion && (
                                <p>
                                    <strong>Tipo de solución:</strong> {averia.tipo_solucion}
                                </p>
                            )}

                            {averia.recomendacion_preventiva && (
                                <p>
                                    <strong>Recomendación preventiva:</strong> {averia.recomendacion_preventiva}
                                </p>
                            )}

                            {averia.fecha_resolucion && (
                                <p>
                                    <strong>Fecha de resolución:</strong>{" "}
                                    {new Date(averia.fecha_resolucion).toLocaleString("es-ES")}
                                </p>
                            )}

                            {/* Tiempo de parada calculado por el backend */}
                            {averia.tiempo_parada_horas !== null && (
                                <p>
                                    <strong>Tiempo de parada:</strong>{" "}
                                    {averia.tiempo_parada_horas.toLocaleString("es-ES")} horas
                                </p>
                            )}

                            {/* Información del cierre */}
                            {averia.estado === "Cerrada" && (
                                <>
                                    {averia.id_validada_por !== null && (
                                        <p>
                                            <strong>Validada por:</strong>{" "}
                                            {(() => {
                                                const responsable = responsables.find(
                                                    (persona) =>
                                                        persona.id_persona === averia.id_validada_por
                                                );

                                                if (!responsable) {
                                                    return "Responsable no disponible";
                                                }

                                                return `${responsable.nombre} ${responsable.apellidos}${
                                                    !responsable.activo ? " (Responsable dado de baja)" : ""
                                                }`;
                                            })()}
                                        </p>
                                    )}

                                    {averia.fecha_cierre && (
                                        <p>
                                            <strong>Fecha de cierre:</strong>{" "}
                                            {new Date(averia.fecha_cierre).toLocaleString("es-ES")}
                                        </p>
                                    )}
                                </>
                            )}

                        </div>
                    )}

                    {/* Cerrar avería cuando esté resuelta */}
                    {averia.estado === "Resuelta" && (
                        <div className="formulario-cierre">

                            <h3>Cerrar avería</h3>

                            <div className="formulario-campo">
                                <label htmlFor="idResponsable">
                                    Responsable que valida el cierre *
                                </label>

                                <select
                                    id="idResponsable"
                                    value={idResponsable}
                                    onChange={(e) => setIdResponsable(e.target.value)}
                                    required
                                >
                                    <option value="">
                                        Seleccionar responsable
                                    </option>

                                    {responsables.filter((responsable) => responsable.activo).map((responsable) => (
                                        <option
                                            key={responsable.id_persona}
                                            value={responsable.id_persona}
                                        >
                                            {responsable.nombre} {responsable.apellidos}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={finalizarAveria}
                                disabled={guardando || !idResponsable}
                            >
                                {guardando
                                    ? "Cerrando..."
                                    : "Cerrar avería"}
                            </button>

                        </div>
                    )}

                    {error && (
                        <p role="alert">{error}</p>
                    )}

                </>
            )}

            <button
                type="button"
                onClick={() => navigate("/averias")}
            >
                Volver a averías
            </button>

            {/* Confirmación de asignación del técnico */}
            {mostrarModal && (
            <ModalConfirmacion
                titulo={tituloModal}
                mensaje={mensajeModal}
                onAceptar={() => navigate("/averias", { replace: true })}
            />
        )}

        </div>
    );
}

export default DetalleAveria;