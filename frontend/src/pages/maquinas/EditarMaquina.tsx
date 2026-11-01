import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router";

import { obtenerMaquina, actualizarMaquina } from "../../api/maquinas";
import type { MaquinaCrear, MaquinaRespuesta } from "../../types/maquina";
import type { Criticidad, EstadoMaquina } from "../../types/enums";

import "../../styles/CrearMaquinas.css";

// Opciones de criticidad
const CRITICIDADES: Criticidad[] = [
    "Alta",
    "Media",
    "Baja"
];

function EditarMaquina() {

    const { id_maquina } = useParams();
    const navigate = useNavigate();

    // Datos originales de la máquina
    const [maquina, setMaquina] = useState<MaquinaRespuesta | null>(null);

    // Datos editables del formulario
    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [fabricante, setFabricante] = useState("");
    const [modelo, setModelo] = useState("");
    const [numeroSerie, setNumeroSerie] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [criticidad, setCriticidad] = useState<Criticidad | "">("");
    const [fechaPuestaMarcha, setFechaPuestaMarcha] = useState("");

    // Estado actual de la máquina
    const [estado, setEstado] = useState<EstadoMaquina>("Operativa");

    // Control de carga, errores y guardado
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    // Recuperar la máquina y cargar sus datos
    useEffect(() => {

        let activo = true;

        async function cargarMaquina() {

            setCargando(true);
            setError("");

            try {
                const id = Number(id_maquina);

                if (!Number.isInteger(id) || id <= 0) {
                    throw new Error("Identificador de máquina no válido");
                }

                const datos = await obtenerMaquina(id);

                if (!activo) return;

                setMaquina(datos);

                setCodigo(datos.codigo);
                setNombre(datos.nombre);
                setTipo(datos.tipo);
                setFabricante(datos.fabricante ?? "");
                setModelo(datos.modelo ?? "");
                setNumeroSerie(datos.numero_serie ?? "");
                setUbicacion(datos.ubicacion ?? "");
                setCriticidad(datos.criticidad ?? "");
                setFechaPuestaMarcha(datos.fecha_puesta_marcha ?? "");
                setEstado(datos.estado);

            } catch (error) {

                if (activo) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Error al obtener la máquina"
                    );
                }

            } finally {

                if (activo) {
                    setCargando(false);
                }
            }
        }

        cargarMaquina();

        return () => {
            activo = false;
        };

    }, [id_maquina]);

    // Guardar las modificaciones mediante FastAPI
    async function guardarCambios(e: SubmitEvent<HTMLFormElement>) {

        e.preventDefault();

        if (!maquina) return;

        setError("");
        setGuardando(true);

        try {

            const datos: MaquinaCrear = {
                codigo: codigo.trim(),
                nombre: nombre.trim(),
                tipo: tipo.trim(),
                fabricante: fabricante.trim() || null,
                modelo: modelo.trim() || null,
                numero_serie: numeroSerie.trim() || null,
                ubicacion: ubicacion.trim() || null,
                criticidad: criticidad || null,
                fecha_puesta_marcha: fechaPuestaMarcha || null,

                // Conservar el estado original de la máquina
                estado: estado
            };

            await actualizarMaquina(maquina.id_maquina, datos);

            // Regresar a la ficha de la máquina
            navigate(`/maquinas/${maquina.id_maquina}`, {
                replace: true
            });

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "Error al actualizar la máquina"
            );

        } finally {
            setGuardando(false);
        }
    }

    // Cancelar la edición sin guardar
    function cancelar() {
        navigate(`/maquinas/${id_maquina}`);
    }

    if (cargando) {
        return <p>Cargando máquina...</p>;
    }

    if (!maquina) {
        return <p role="alert">{error || "La máquina no existe"}</p>;
    }

    return (
        <div className="pagina-crear-maquina">

            <h2>Editar máquina</h2>

            <form
                className="formulario-maquina"
                onSubmit={guardarCambios}
            >

                {/* Código */}
                <div className="formulario-campo">
                    <label htmlFor="codigo">Código*</label>
                    <input
                        id="codigo"
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        required
                    />
                </div>

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

                {/* Tipo */}
                <div className="formulario-campo">
                    <label htmlFor="tipo">Tipo*</label>
                    <input
                        id="tipo"
                        type="text"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        required
                    />
                </div>

                {/* Fabricante */}
                <div className="formulario-campo">
                    <label htmlFor="fabricante">Fabricante</label>
                    <input
                        id="fabricante"
                        type="text"
                        value={fabricante}
                        onChange={(e) => setFabricante(e.target.value)}
                    />
                </div>

                {/* Modelo */}
                <div className="formulario-campo">
                    <label htmlFor="modelo">Modelo</label>
                    <input
                        id="modelo"
                        type="text"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                    />
                </div>

                {/* Número de serie */}
                <div className="formulario-campo">
                    <label htmlFor="numeroSerie">Número de serie</label>
                    <input
                        id="numeroSerie"
                        type="text"
                        value={numeroSerie}
                        onChange={(e) => setNumeroSerie(e.target.value)}
                    />
                </div>

                {/* Ubicación */}
                <div className="formulario-campo">
                    <label htmlFor="ubicacion">Ubicación</label>
                    <input
                        id="ubicacion"
                        type="text"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                    />
                </div>

                {/* Criticidad */}
                <div className="formulario-campo">
                    <label htmlFor="criticidad">Criticidad</label>
                    <select
                        id="criticidad"
                        value={criticidad}
                        onChange={(e) =>
                            setCriticidad(e.target.value as Criticidad | "")
                        }
                    >
                        <option value="">Seleccionar criticidad</option>

                        {CRITICIDADES.map((valor) => (
                            <option key={valor} value={valor}>
                                {valor}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fecha de puesta en marcha */}
                <div className="formulario-campo">
                    <label htmlFor="fechaPuestaMarcha">
                        Fecha de puesta en marcha
                    </label>
                    <input
                        id="fechaPuestaMarcha"
                        type="date"
                        value={fechaPuestaMarcha}
                        onChange={(e) =>
                            setFechaPuestaMarcha(e.target.value)
                        }
                    />
                </div>

                {/* Estado actual de la máquina (solo lectura) */}
                <div className="formulario-campo">
                    <label>Estado actual</label>
                    <p>{maquina.estado}</p>
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

export default EditarMaquina;