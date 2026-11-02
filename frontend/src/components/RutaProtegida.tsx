/**
 * Componente RutaProtegida.
 * Controla el acceso a las páginas de la aplicación comprobando
 * si el usuario tiene una sesión activa en Supabase.
 *
 * Funcionamiento:
 * - useState: almacena el estado de autenticación del usuario.
 * - useEffect: comprueba la sesión y detecta cambios de autenticación.
 * - getSession: consulta si existe una sesión activa.
 * - onAuthStateChange: detecta cuándo el usuario inicia o cierra sesión.
 * - Navigate: redirige al login si el usuario no está autenticado.
 * - Outlet: muestra la página solicitada si la sesión es válida.
 */
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { supabase } from "../api/supabase";

function RutaProtegida() {

    // Comprobar si está activado el modo demostración
    const modoDemo = import.meta.env.VITE_DEMO_MODE === "true";

    const [autenticado, setAutenticado] = useState<boolean | null>(null);

    useEffect(() => {

    // No comprobar la sesión en modo demostración
    // ni cuando Supabase no está inicializado
    if (modoDemo || !supabase) {
        return;
    }

        // Comprobar si existe una sesión
        supabase.auth.getSession().then(({ data }) => {
            setAutenticado(!!data.session);
        });

        // Detectar cambios de sesión
        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                setAutenticado(!!session);
            });

        return () => subscription.unsubscribe();

    }, [modoDemo]);

    // Acceso directo en modo demostración
    if (modoDemo) {
        return <Outlet />;
    }

    // Esperar a comprobar la sesión de Supabase
    if (autenticado === null) {
        return <p>Comprobando sesión...</p>;
    }

    // Redirigir al login si no hay sesión
    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    // Mostrar la página solicitada
    return <Outlet />;
}

export default RutaProtegida;
