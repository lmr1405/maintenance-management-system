/**
 * Componente Sidebar.
 * Muestra el menú lateral de navegación de la aplicación,
 * permitiendo acceder a las distintas secciones y cerrar sesión.
 *
 * Funcionamiento:
 * - NavLink: permite navegar entre las páginas y resalta la sección activa.
 * - useNavigate: permite redirigir al usuario a otra página.
 * - cerrarSesion: finaliza la sesión del usuario mediante Supabase.
 * - signOut: cierra la sesión de autenticación.
 *
 * Secciones:
 * - Dashboard, Máquinas, Personas, Averías, Imputaciones e Informes.
 */
import { NavLink, useNavigate } from "react-router";
import { supabase } from "../api/supabase";
import "../styles/Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();

    // Comprobar si la aplicación está en modo demostración
    const modoDemo = import.meta.env.VITE_DEMO_MODE === "true";

// Cerrar la sesión del usuario
async function cerrarSesion() {

    // No cerrar sesión si Supabase no está inicializado
    if (!supabase) {
        return;
    }

    const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Error al cerrar sesión:", error.message);
            return;
        }

        // Redirigir al login
        navigate("/login", { replace: true });
    }


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

                    {/* Mostrar el cierre de sesión solo cuando hay autenticación */}
                    {!modoDemo && (
                        <li>
                            <button type="button" onClick={cerrarSesion}>
                                Cerrar sesión
                            </button>
                        </li>
                    )}


                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar