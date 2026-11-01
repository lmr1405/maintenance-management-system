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