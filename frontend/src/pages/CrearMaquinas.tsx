import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { crearMaquina } from "../api/maquinas";
import type { MaquinaCrear } from "../types/maquina";
import type { Criticidad } from "../types/enums";
import "../styles/CrearMaquinas.css";

// Obtener la fecha local actual
function obtenerFechaActual(): string {
    const ahora = new Date();

    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

// Opciones de criticidad según el tipo definido en enums.ts
const CRITICIDADES: Criticidad[] = [
    "Alta",
    "Media",
    "Baja"
];

function CrearMaquina() {

    const navigate = useNavigate();

    // Datos introducidos por el usuario
    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [fabricante, setFabricante] = useState("");
    const [modelo, setModelo] = useState("");
    const [numeroSerie, setNumeroSerie] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [criticidad, setCriticidad] = useState<Criticidad | "">("");
    const [fechaPuestaMarcha, setFechaPuestaMarcha] =
        useState(obtenerFechaActual);

    // Control de errores y estado de guardado
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    // Registrar la máquina mediante FastAPI
    async function guardarMaquina(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setGuardando(true);

        try {

            // Construir los datos para el backend
            const datos: MaquinaCrear = {
                codigo: codigo.trim(),
                nombre: nombre.trim(),
                tipo: tipo.trim(),
                fabricante: fabricante.trim() || null,
                modelo: modelo.trim() || null,
                numero_serie: numeroSerie.trim() || null,
                ubicacion: ubicacion.trim() || null,
                fecha_puesta_marcha: fechaPuestaMarcha || null,
                criticidad: criticidad || null
            };

            // Enviar la petición POST a FastAPI
            await crearMaquina(datos);

            // Volver al listado de máquinas
            navigate("/maquinas", { replace: true });

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al registrar la máquina"
            );
        } finally {
            setGuardando(false);
        }
    }

    // Cancelar la operación sin guardar
    function cancelar() {
        navigate("/maquinas");
    }

    return (
        <div className="pagina-crear-maquina">

            <h2>Registrar máquina</h2>

            <form
                className="formulario-maquina"
                onSubmit={guardarMaquina}
            >

                {/* Código de identificación */}
                <div className="formulario-campo">
                    <label htmlFor="codigo">Código*</label>
                    <input
                        id="codigo"
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        placeholder="Ej. MQ-001"
                        required
                    />
                </div>

                {/* Nombre de la máquina */}
                <div className="formulario-campo">
                    <label htmlFor="nombre">Nombre*</label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre de la máquina"
                        required
                    />
                </div>

                {/* Tipo de máquina */}
                <div className="formulario-campo">
                    <label htmlFor="tipo">Tipo*</label>
                    <input
                        id="tipo"
                        type="text"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        placeholder="Tipo de máquina"
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
                        placeholder="Fabricante"
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
                        placeholder="Modelo"
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
                        placeholder="Número de serie"
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
                        placeholder="Ubicación de la máquina"
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

                {/* Mensaje de error */}
                {error && (
                    <p className="formulario-error" role="alert">
                        {error}
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
                        disabled={guardando}
                    >
                        {guardando
                            ? "Guardando..."
                            : "Guardar máquina"}
                    </button>

                </div>

            </form>
        </div>
    );
}

export default CrearMaquina;