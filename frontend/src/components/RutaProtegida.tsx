import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { supabase } from "../api/supabase";

function RutaProtegida() {

    const [autenticado, setAutenticado] = useState<boolean | null>(null);

    useEffect(() => {

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

    }, []);

    // Esperar a comprobar la sesión
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
