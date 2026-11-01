import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { obtenerImputaciones } from "../../api/imputaciones";

import { obtenerAverias } from "../../api/averias";
import { obtenerPersonas } from "../../api/personas";

import type { ImputacionHorasRespuesta } from "../../types/imputacion";
import type { AveriaRespuesta } from "../../types/averia";
import type { PersonaRespuesta } from "../../types/persona";

import "../../styles/Imputaciones.css";

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

   // Selector y navegación para consultar los totales de horas
    const [tipoConsulta, setTipoConsulta] = useState("");
    const [errorConsulta, setErrorConsulta] = useState(false);

    const navigate = useNavigate();

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


// Aplicar filtros únicamente a las imputaciones registradas
    const imputacionesFiltradas = imputaciones.filter((imputacion) => {

        const coincideTecnico =
            filtroTecnico === "" ||
            imputacion.id_tecnico === Number(filtroTecnico);

        const coincideAveria =
            filtroAveria === "" ||
            imputacion.id_averia === Number(filtroAveria);

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

    // Consultar los totales según la opción seleccionada
    function consultarTotalHoras() {
        if (!tipoConsulta) {
            setErrorConsulta(true);
            return;
        }

        setErrorConsulta(false);
        navigate(`/imputaciones/${tipoConsulta}`);
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
                                        Avería #{averia.numero}
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
                        <p>No se encontraron registros con esos filtros.</p>
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
                            
                            {/* Mostrar el historial de imputaciones registradas, incluyendo
                                la avería, el técnico, la fecha, las horas trabajadas
                                y la descripción de cada intervención */}
                            <tbody>
                                {imputacionesFiltradas.map((imputacion) => (
                                    <tr key={imputacion.id_imputacion}>

                                        {/* Número de avería */}
                                        <td>
                                            {averias.find(
                                                (averia) => averia.id_averia === imputacion.id_averia
                                            )?.numero ?? imputacion.id_averia}
                                        </td>

                                        {/* Técnico que realizó el trabajo */}
                                        <td>
                                            {obtenerNombreTecnico(imputacion.id_tecnico)}
                                        </td>

                                        {/* Fecha de la intervención */}
                                        <td>
                                            {imputacion.fecha.slice(0, 10)}
                                        </td>

                                        {/* Horas registradas */}
                                        <td>
                                            {imputacion.horas} h
                                        </td>

                                        {/* Descripción del trabajo */}
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

                {/* Acciones de imputaciones */}
                <div className="imputaciones-acciones">

                    {/* Selector de consulta */}
                    <div className="imputaciones-consulta">
                        <select
                            value={tipoConsulta}
                            aria-label="Tipo de consulta"
                            onChange={(e) => {
                                setTipoConsulta(e.target.value);
                                setErrorConsulta(false);
                            }}
                        >
                            <option value="">Seleccionar consulta</option>
                            <option value="averias">Por avería</option>
                            <option value="maquinas">Por máquina</option>
                            <option value="tecnicos">Por técnico</option>
                        </select>

                        {errorConsulta && (
                            <span className="imputaciones-error-consulta">
                                Elija una opción
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        className="boton-crear-imputacion"
                        onClick={consultarTotalHoras}
                    >
                        Consultar total de horas
                    </button>

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