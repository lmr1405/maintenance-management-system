/**
 * Componente ModalConfirmacion.
 * Muestra una ventana emergente reutilizable para informar al usuario
 * sobre el resultado de una operación y confirmar su aceptación.
 *
 * Propiedades:
 * - titulo: título que aparece en la ventana.
 * - mensaje: información que se muestra al usuario.
 * - onAceptar: función que se ejecuta al pulsar el botón "Aceptar".
 *
 * Funcionamiento:
 * - Muestra un icono de confirmación junto al título y mensaje.
 * - Permite cerrar o continuar mediante el botón "Aceptar".
 */
import "../styles/ModalConfirmacion.css";

// Propiedades del componente
interface ModalConfirmacionProps {
    titulo: string;
    mensaje: string;
    onAceptar: () => void;
}

// Ventana modal reutilizable para confirmar operaciones
function ModalConfirmacion({
    titulo,
    mensaje,
    onAceptar
}: ModalConfirmacionProps) {

    return (
        <div className="modal-fondo">
            <div
                className="modal-contenido"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-titulo"
                aria-describedby="modal-mensaje"
            >

                {/* Icono de confirmación */}
                <div className="modal-icono">
                    ✓
                </div>

                {/* Información de la operación */}
                <h3 id="modal-titulo">{titulo}</h3>

                <p id="modal-mensaje">{mensaje}</p>

                {/* Confirmar y continuar */}
                <button
                    type="button"
                    onClick={onAceptar}
                    autoFocus
                >
                    Aceptar
                </button>

            </div>
        </div>
    );
}

export default ModalConfirmacion;