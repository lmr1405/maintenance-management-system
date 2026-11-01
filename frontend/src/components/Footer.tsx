/**
 * Componente Footer.
 * Muestra el pie de página de la aplicación con el año actual
 * y el nombre del desarrollador.
 */
import "../styles/Footer.css";

function Footer() {
    return (
        <footer className="app-footer">
            <span>© {new Date().getFullYear()} Gestión de Mantenimiento</span>
            <span>Desarrollado por Luis Menéndez</span>
        </footer>
    );
}

export default Footer;