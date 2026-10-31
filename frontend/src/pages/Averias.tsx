import { useEffect, useState } from "react";
import { Link } from "react-router";

import { obtenerAverias } from "../api/averias";
import { obtenerMaquinas } from "../api/maquinas";
import { obtenerPersonas } from "../api/personas";

import type { AveriaRespuesta } from "../types/averia";
import type { MaquinaRespuesta } from "../types/maquina";
import type { PersonaRespuesta } from "../types/persona";
import type { EstadoAveria } from "../types/enums";

import "../styles/Averias.css";

// Estados del ciclo de vida de una avería
const ESTADOS: EstadoAveria[] = [
    "Abierta",
    "Asignada",
    "En curso",
    "Resuelta",
    "Cerrada"
];

function Averias() {

    // Datos obtenidos de FastAPI
    const [averias, setAverias] = useState<AveriaRespuesta[]>([]);
    const [maquinas, setMaquinas] = useState<MaquinaRespuesta[]>([]);
    const [personas, setPersonas] = useState<PersonaRespuesta[]>([]);

    // Control de carga y errores
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Filtros de búsqueda
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroMaquina, setFiltroMaquina] = useState("");
    const [filtroTecnico, setFiltroTecnico] = useState("");

    useEffect(() => {

        // Consultar averías, máquinas y personas
        Promise.all([
            obtenerAverias(),
            obtenerMaquinas(),
            obtenerPersonas()
        ])
            .then(([datosAverias, datosMaquinas, datosPersonas]) => {
                setAverias(datosAverias);
                setMaquinas(datosMaquinas);
                setPersonas(datosPersonas);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setCargando(false);
            });

    }, []);

    // Obtener únicamente las personas con rol técnico
    const tecnicos = personas.filter(
        (persona) => persona.rol === "Técnico de mantenimiento"
    );

    // Obtener nombre de la máquina a partir de su ID
    function obtenerNombreMaquina(id: number): string {

        const maquina = maquinas.find(
            (maquina) => maquina.id_maquina === id
        );

        return maquina
            ? `${maquina.codigo} - ${maquina.nombre}`
            : `Máquina #${id}`;
    }

    // Obtener nombre del técnico asignado
    function obtenerNombreTecnico(id: number | null): string {

        if (id === null) {
            return "Sin asignar";
        }

        const tecnico = personas.find(
            (persona) => persona.id_persona === id
        );

        return tecnico
            ? `${tecnico.nombre} ${tecnico.apellidos}`
            : `Técnico #${id}`;
    }

    // Filtrar averías sin realizar nuevas peticiones HTTP
    const averiasFiltradas = averias.filter((averia) => {

        const coincideEstado =
            filtroEstado === "" ||
            averia.estado === filtroEstado;

        const coincideMaquina =
            filtroMaquina === "" ||
            averia.id_maquina === Number(filtroMaquina);

        const coincideTecnico =
            filtroTecnico === "" ||
            averia.id_tecnico_asignado === Number(filtroTecnico);

        return coincideEstado && coincideMaquina && coincideTecnico;
    });

    // Comprobar si existe algún filtro activo
    const hayFiltrosActivos =
        filtroEstado !== "" ||
        filtroMaquina !== "" ||
        filtroTecnico !== "";

    // Restablecer los filtros
    function limpiarFiltros() {
        setFiltroEstado("");
        setFiltroMaquina("");
        setFiltroTecnico("");
    }

    return (
        <div className="pagina-averias">

            {/* Cabecera y acceso al formulario */}
            <div className="averias-cabecera">

                <h2>Gestión de Averías</h2>

                <Link
                    to="/averias/crear"
                    className="boton-crear-averia"
                >
                    Nueva avería
                </Link>

            </div>

            {cargando ? (
                <p>Cargando averías...</p>
            ) : error ? (
                <p className="averias-error" role="alert">
                    {error}
                </p>
            ) : (
                <>
                    {/* Filtros de búsqueda */}
                    <div className="averias-filtros">

                        {/* Estado */}
                        <div className="averias-campo">
                            <label htmlFor="filtroEstado">Estado</label>

                            <select
                                id="filtroEstado"
                                value={filtroEstado}
                                onChange={(e) =>
                                    setFiltroEstado(e.target.value)
                                }
                            >
                                <option value="">Todos los estados</option>

                                {ESTADOS.map((estado) => (
                                    <option key={estado} value={estado}>
                                        {estado}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Máquina */}
                        <div className="averias-campo">
                            <label htmlFor="filtroMaquina">Máquina</label>

                            <select
                                id="filtroMaquina"
                                value={filtroMaquina}
                                onChange={(e) =>
                                    setFiltroMaquina(e.target.value)
                                }
                            >
                                <option value="">Todas las máquinas</option>

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

                        {/* Técnico asignado */}
                        <div className="averias-campo">
                            <label htmlFor="filtroTecnico">Técnico</label>

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

                        {/* Limpiar filtros */}
                        <div className="averias-limpiar-filtros">
                            <button
                                type="button"
                                onClick={limpiarFiltros}
                                disabled={!hayFiltrosActivos}
                            >
                                Limpiar filtros
                            </button>
                        </div>

                    </div>

                    {/* Tabla de averías */}
                    {averias.length === 0 ? (
                        <p>No hay averías registradas.</p>
                    ) : averiasFiltradas.length === 0 ? (
                        <p>No se encontraron averías con esos filtros.</p>
                    ) : (
                        <table className="tabla-averias">

                            <thead>
                                <tr>
                                    <th>Nº avería</th>
                                    <th>Título</th>
                                    <th>Máquina</th>
                                    <th>Prioridad</th>
                                    <th>Técnico asignado</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {averiasFiltradas.map((averia) => (
                                    <tr key={averia.id_averia}>

                                        <td>{averia.numero}</td>

                                        <td>{averia.titulo}</td>

                                        <td>
                                            {obtenerNombreMaquina(
                                                averia.id_maquina
                                            )}
                                        </td>

                                        <td>{averia.prioridad}</td>

                                        <td>
                                            {obtenerNombreTecnico(
                                                averia.id_tecnico_asignado
                                            )}
                                        </td>
                                        
                                        {/* Estado de la avería identificado por colores */}
                                        <td>
                                            <span
                                                className={`averia-estado ${
                                                    averia.estado === "Abierta" ? "abierta" :
                                                    averia.estado === "Asignada" ? "asignada" :
                                                    averia.estado === "En curso" ? "en-curso" :
                                                    averia.estado === "Resuelta" ? "resuelta" :
                                                    averia.estado === "Cerrada" ? "cerrada" : ""
                                                }`}
                                            >
                                                {averia.estado}
                                            </span>
                                        </td>

                                        {/* Acceso a la gestión de la avería */}
                                        <td>
                                            <Link
                                                to={`/averias/${averia.id_averia}`}
                                                className="boton-gestionar-averia"
                                            >
                                                Gestionar
                                            </Link>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}
                    {/* Total de averías registradas */}
                    <p className="averias-total">
                        Averías registradas: {averias.length}
                    </p>
                </>
            )}

        </div>
    );
}

export default Averias;