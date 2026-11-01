import "../../styles/Maquinas.css"
import { Link } from "react-router";
import { useEffect, useState } from "react";

import { obtenerMaquinas } from "../../api/maquinas";
import type { MaquinaRespuesta } from "../../types/maquina";
import type { EstadoMaquina } from "../../types/enums";

function Maquinas() {

    // Almacena las máquinas recibidas de FastAPI
    const [maquinas, setMaquinas] = useState<MaquinaRespuesta[]>([]);

    // Filtros del listado
    const [estado, setEstado] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [tipo, setTipo] = useState("");

    // Tipos de máquinas disponibles para el filtro
    const [tiposDisponibles, setTiposDisponibles] = useState<string[]>([]);

    // Controla los errores y el estado de carga
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    // Obtener los tipos de máquinas registrados
    useEffect(() => {
        obtenerMaquinas()
            .then((datos) => {
                const tipos = [...new Set(datos.map((m) => m.tipo))]
                    .sort();

                setTiposDisponibles(tipos);
            })
            .catch((error) => {
                console.error("Error al obtener los tipos:", error);
            });
    }, []);

    // Consultar máquinas cada vez que cambian los filtros
    useEffect(() => {

        // Evitar actualizar el estado después de desmontar
        // el componente o cambiar los filtros
        let activo = true;

        setCargando(true);
        setError("");

        // Consultar las máquinas utilizando la capa API
        obtenerMaquinas({
            estado: estado || undefined,
            ubicacion: ubicacion.trim() || undefined,
            tipo: tipo.trim() || undefined
        })
            .then((datos) => {
                if (activo) {
                    setMaquinas(datos);
                }
            })
            .catch((error) => {
                if (activo) {
                    setError(error.message);
                }
            })
            .finally(() => {
                if (activo) {
                    setCargando(false);
                }
            });

        return () => {
            activo = false;
        };      

    }, [estado, ubicacion, tipo]);

      // Estados disponibles para filtrar las máquinas
        const estados: EstadoMaquina[] = [
            "Operativa",
            "En avería",
            "Fuera de servicio",
            "De baja"
        ];

        // Restablecer todos los filtros
        function limpiarFiltros() {
            setEstado("");
            setUbicacion("");
            setTipo("");
        }

    return (
        <div className="pagina-maquinas">

            <h2>Gestión de Máquinas</h2>
            {/* Filtros del listado */}
            <div className="maquinas-filtros">

                {/* Filtrar por estado */}
                <div className="filtro-campo">
                    <label htmlFor="filtro-estado">Estado</label>

                    <select
                        id="filtro-estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="">Todos los estados</option>

                        {estados.map((valor) => (
                            <option key={valor} value={valor}>
                                {valor}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtrar por ubicación */}
                <div className="filtro-campo">
                    <label htmlFor="filtro-ubicacion">Ubicación</label>

                    <input
                        id="filtro-ubicacion"
                        type="text"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        placeholder="Buscar ubicación"
                    />
                </div>

                {/* Filtrar por tipo */}
                <div className="filtro-campo">
                    <label htmlFor="filtro-tipo">Tipo</label>

                   <select
                        id="filtro-tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    >
                        <option value="">Todos los tipos</option>

                        {tiposDisponibles.map((valor) => (
                            <option key={valor} value={valor}>
                                {valor}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Limpiar filtros */}
                <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="boton-limpiar-filtros"
                >
                    Limpiar filtros
                </button>

            </div>

            {cargando ? (
                <p>Cargando máquinas...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <p>Máquinas registradas: {maquinas.length}</p>

                    {maquinas.length === 0 ? (
                        <p>No hay máquinas registradas.</p>
                    ) : (
                        <table className="tabla-maquinas">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Ubicación</th>
                                    <th>Criticidad</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {maquinas.map((maquina) => (
                                    <tr key={maquina.id_maquina}>
                                        <td>{maquina.codigo}</td>
                                        <td>{maquina.nombre}</td>
                                        <td>{maquina.tipo}</td>
                                        <td>{maquina.ubicacion ?? "-"}</td>
                                        <td>{maquina.criticidad ?? "-"}</td>
                                        <td>{maquina.estado}</td>
                                        {/* Acceso a la gestión individual de la máquina */}
                                        <td>
                                            <Link
                                                to={`/maquinas/${maquina.id_maquina}`}
                                                className="boton-gestionar-maquina"
                                            >
                                                Gestionar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>                
            )}
                {/* Acceso al formulario de creación */}
                <div className="maquinas-acciones">
                    <Link to="/maquinas/crear" className="boton-crear-maquina">
                        Crear máquina
                    </Link>
                </div>
        </div>
    );
}

export default Maquinas;
