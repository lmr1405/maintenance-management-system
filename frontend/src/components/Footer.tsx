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