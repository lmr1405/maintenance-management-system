import { NavLink } from 'react-router'
import '../styles/Sidebar.css'

function Sidebar() {
    return (
        <aside className="sidebar">
            <h2>Mantenimiento</h2>

            <nav>
                <ul>
                    <li>
                        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
                    </li>

                    <li>
                        <NavLink to="/maquinas" className={({isActive}) => isActive ? "active" : ""}>Máquinas
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/personas" className={({isActive}) => isActive ? "active" : ""}>Personas
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/averias" className={({isActive}) => isActive ? "active" : ""}>Averías
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/imputaciones" className={({ isActive }) => isActive ? "active" : ""}>
                            Imputaciones
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/informes" className={({ isActive }) => isActive ? "active" : ""}>
                            Informes
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar