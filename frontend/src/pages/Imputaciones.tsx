import { useEffect, useState } from "react";
import { Link } from "react-router";

import { obtenerImputaciones } from "../api/imputaciones";
import { obtenerAverias } from "../api/averias";
import { obtenerPersonas } from "../api/personas";

import type { ImputacionHorasRespuesta } from "../types/imputacion";
import type { AveriaRespuesta } from "../types/averia";
import type { PersonaRespuesta } from "../types/persona";

import "../styles/Imputaciones.css";

function Imputaciones() {

    // Datos recibidos de FastAPI
    const [imputaciones, setImputaciones] =
        useState<ImputacionHorasRespuesta[]>([]);

    const [averias, setAverias] = useState<AveriaRespuesta[]>([]);
    const [personas, setPersonas] = useState<PersonaRespuesta[]>([]);

    // Control de carga y errores
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Filtros de búsqueda
    const [filtroTecnico, setFiltroTecnico] = useState("");
    const [filtroAveria, setFiltroAveria] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("");

    useEffect(() => {

        // Consultar los datos mediante FastAPI
        Promise.all([
            obtenerImputaciones(),
            obtenerAverias(),
            obtenerPersonas()
        ])
            .then(([datosImputaciones, datosAverias, datosPersonas]) => {

                setImputaciones(datosImputaciones);
                setAverias(datosAverias);
                setPersonas(datosPersonas);

            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setCargando(false);
            });

    }, []);

    // Técnicos registrados
    const tecnicos = personas.filter(
        (persona) => persona.rol === "Técnico de mantenimiento"
    );

    // Obtener nombre del técnico a partir de su ID
    function obtenerNombreTecnico(id: number): string {

        const tecnico = personas.find(
            (persona) => persona.id_persona === id
        );

        return tecnico
            ? `${tecnico.nombre} ${tecnico.apellidos}`
            : `Técnico #${id}`;
    }

    // Aplicar los tres filtros de búsqueda
    const imputacionesFiltradas = imputaciones.filter((imputacion) => {

        const coincideTecnico =
            filtroTecnico === "" ||
            imputacion.id_tecnico === Number(filtroTecnico);

        const coincideAveria =
            filtroAveria === "" ||
            imputacion.id_averia === Number(filtroAveria);

        // Comparar únicamente la parte de fecha
        const coincideFecha =
            filtroFecha === "" ||
            imputacion.fecha.slice(0, 10) === filtroFecha;

        return coincideTecnico && coincideAveria && coincideFecha;
    });

    // Comprobar si hay filtros activos
    const hayFiltrosActivos =
        filtroTecnico !== "" ||
        filtroAveria !== "" ||
        filtroFecha !== "";

    // Limpiar todos los filtros
    function limpiarFiltros() {
        setFiltroTecnico("");
        setFiltroAveria("");
        setFiltroFecha("");
    }

    return (
        <div className="pagina-imputaciones">

            <h2>Imputación de Horas</h2>

            {cargando ? (
                <p>Cargando imputaciones...</p>
            ) : error ? (
                <p className="imputaciones-error">{error}</p>
            ) : (
                <>
                    {/* Filtros de búsqueda */}
                    <div className="imputaciones-filtros">

                        {/* Filtrar por técnico */}
                        <div className="imputaciones-campo">

                            <label htmlFor="filtroTecnico">
                                Técnico
                            </label>

                            <select
                                id="filtroTecnico"
                                value={filtroTecnico}
                                onChange={(e) =>
                                    setFiltroTecnico(e.target.value)
                                }
                            >
                                <option value="">Todos los técnicos</option>

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

                        {/* Filtrar por avería */}
                        <div className="imputaciones-campo">

                            <label htmlFor="filtroAveria">
                                Avería
                            </label>

                            <select
                                id="filtroAveria"
                                value={filtroAveria}
                                onChange={(e) =>
                                    setFiltroAveria(e.target.value)
                                }
                            >
                                <option value="">Todas las averías</option>

                                {averias.map((averia) => (
                                    <option
                                        key={averia.id_averia}
                                        value={averia.id_averia}
                                    >
                                        Avería #{averia.id_averia}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Filtrar por fecha */}
                        <div className="imputaciones-campo">

                            <label htmlFor="filtroFecha">
                                Fecha
                            </label>

                            <input
                                id="filtroFecha"
                                type="date"
                                value={filtroFecha}
                                onChange={(e) =>
                                    setFiltroFecha(e.target.value)
                                }
                            />

                        </div>

                        {/* Limpiar los filtros */}
                        <div className="imputaciones-limpiar-filtros">
                            <button
                                type="button"
                                onClick={limpiarFiltros}
                                disabled={!hayFiltrosActivos}
                            >
                                Limpiar filtros
                            </button>
                        </div>

                    </div>

                    {/* Tabla de imputaciones */}
                    {imputaciones.length === 0 ? (
                        <p>No hay imputaciones registradas.</p>
                    ) : imputacionesFiltradas.length === 0 ? (
                        <p>No se encontraron imputaciones con esos filtros.</p>
                    ) : (
                        <table className="tabla-imputaciones">

                            <thead>
                                <tr>
                                    <th>Avería</th>
                                    <th>Técnico</th>
                                    <th>Fecha</th>
                                    <th>Horas</th>
                                    <th>Descripción del trabajo</th>
                                </tr>
                            </thead>

                            <tbody>
                                {imputacionesFiltradas.map((imputacion) => (
                                    <tr key={imputacion.id_imputacion}>

                                        <td>
                                            Avería #{imputacion.id_averia}
                                        </td>

                                        <td>
                                            {obtenerNombreTecnico(
                                                imputacion.id_tecnico
                                            )}
                                        </td>

                                        <td>
                                            {imputacion.fecha.slice(0, 10)}
                                        </td>

                                        <td>
                                            {imputacion.horas}
                                        </td>

                                        <td>
                                            {imputacion.descripcion_trabajo}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}

                </>
            )}

          
            {/* Pie de página: total de imputaciones y botón de registro */}
            <div className="imputaciones-pie">

                {/* Total de imputaciones registradas */}
                {!cargando && !error && (
                    <p className="imputaciones-total">
                        Imputaciones registradas: {imputaciones.length}
                    </p>
                )}

                {/* Acceso al formulario de registro */}
                <div className="imputaciones-acciones">
                    <Link
                        to="/imputaciones/crear"
                        className="boton-crear-imputacion"
                    >
                        Registrar imputación
                    </Link>
                </div>

            </div>


        </div>
    );
}

export default Imputaciones;