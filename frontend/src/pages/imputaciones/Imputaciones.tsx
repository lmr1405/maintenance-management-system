import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
    obtenerImputaciones, obtenerTotalHorasPorAveria, obtenerTotalHorasPorMaquina, obtenerTotalHorasPorTecnico
} from "../../api/imputaciones";
import { obtenerAverias } from "../../api/averias";
import { obtenerPersonas } from "../../api/personas";

import type { ImputacionHorasRespuesta } from "../../types/imputacion";
import type { AveriaRespuesta } from "../../types/averia";
import type { PersonaRespuesta } from "../../types/persona";
import { obtenerMaquinas } from "../../api/maquinas";
import type { MaquinaRespuesta } from "../../types/maquina";

import "../../styles/Imputaciones.css";

function Imputaciones() {

    // Datos recibidos de FastAPI
    const [imputaciones, setImputaciones] =
        useState<ImputacionHorasRespuesta[]>([]);

    const [averias, setAverias] = useState<AveriaRespuesta[]>([]);
    const [personas, setPersonas] = useState<PersonaRespuesta[]>([]);

    // Máquinas recibidas de FastAPI
    const [maquinas, setMaquinas] = useState<MaquinaRespuesta[]>([]);

    // Totales de horas obtenidos de FastAPI
    const [totalesAverias, setTotalesAverias] = useState<Record<number, number>>({});
    const [totalesMaquinas, setTotalesMaquinas] = useState<Record<number, number>>({});
    const [totalesTecnicos, setTotalesTecnicos] = useState<Record<number, number>>({});

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
            obtenerPersonas(),
            obtenerMaquinas()
        ])
            .then(async ([datosImputaciones, datosAverias, datosPersonas, datosMaquinas]) => {

                setImputaciones(datosImputaciones);
                setAverias(datosAverias);
                setPersonas(datosPersonas);
                setMaquinas(datosMaquinas);

                // Consultar las horas totales de cada avería
                const resultadosAverias = await Promise.all(
                    datosAverias.map(async (averia) => {
                        const resultado = await obtenerTotalHorasPorAveria(averia.id_averia);

                        return [averia.id_averia, resultado.total_horas] as const;
                    })
                );

                setTotalesAverias(Object.fromEntries(resultadosAverias));

                // Consultar las horas totales de cada máquina
                const resultadosMaquinas = await Promise.all(
                    datosMaquinas.map(async (maquina) => {
                        const resultado = await obtenerTotalHorasPorMaquina(maquina.id_maquina);

                        return [maquina.id_maquina, resultado.total_horas] as const;
                    })
                );

                setTotalesMaquinas(Object.fromEntries(resultadosMaquinas));

                // Consultar las horas totales de cada técnico
                const resultadosTecnicos = await Promise.all(
                    datosPersonas
                        .filter((persona) => persona.rol === "Técnico de mantenimiento")
                        .map(async (tecnico) => {
                            const resultado = await obtenerTotalHorasPorTecnico(tecnico.id_persona);

                            return [tecnico.id_persona, resultado.total_horas] as const;
                        })
                );

                setTotalesTecnicos(Object.fromEntries(resultadosTecnicos));

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

                                        {/* Mostrar el número de avería */}
                                        <td>
                                            {averias.find(
                                                (averia) => averia.id_averia === imputacion.id_averia
                                            )?.numero ?? imputacion.id_averia}
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

                    {/* Totales de horas por avería */}
                    <section className="imputaciones-resumen">
                        <h3>Total de horas por avería</h3>

                        <table className="tabla-imputaciones">
                            <thead>
                                <tr>
                                    <th>Avería</th>
                                    <th>Total de horas</th>
                                </tr>
                            </thead>

                            <tbody>
                                {averias.map((averia) => (
                                    <tr key={averia.id_averia}>
                                        <td>{averia.numero}</td>
                                        <td>
                                            {totalesAverias[averia.id_averia] ?? 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    {/* Totales de horas por máquina */}
                    <section className="imputaciones-resumen">
                        <h3>Total de horas por máquina</h3>

                        <table className="tabla-imputaciones">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Máquina</th>
                                    <th>Total de horas</th>
                                </tr>
                            </thead>

                            <tbody>
                                {maquinas.map((maquina) => (
                                    <tr key={maquina.id_maquina}>
                                        <td>{maquina.codigo}</td>
                                        <td>{maquina.nombre}</td>
                                        <td>
                                            {totalesMaquinas[maquina.id_maquina] ?? 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    {/* Totales de horas por técnico */}
                    <section className="imputaciones-resumen">
                        <h3>Total de horas por técnico</h3>

                        <table className="tabla-imputaciones">
                            <thead>
                                <tr>
                                    <th>Técnico</th>
                                    <th>Total de horas</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tecnicos.map((tecnico) => (
                                    <tr key={tecnico.id_persona}>
                                        <td>
                                            {tecnico.nombre} {tecnico.apellidos}
                                        </td>
                                        <td>
                                            {totalesTecnicos[tecnico.id_persona] ?? 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

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