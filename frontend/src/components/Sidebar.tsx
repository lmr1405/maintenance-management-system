import '../styles/Sidebar.css'
function Sidebar() {
    return (
        <aside className="sidebar">
            <h2>Mantenimiento</h2>

            <nav>
                <ul>
                    <li>Inicio</li>
                    <li>Máquinas</li>                    
                    <li>Personas</li>
                    <li>Averías</li>
                    <li>Imputaciones</li>
                    <li>Informes</li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar