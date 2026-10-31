import { createClient } from "@supabase/supabase-js";

// Variables de entorno del frontend
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Cliente para gestionar la autenticación
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        // Guardar la sesión solo mientras la pestaña permanezca abierta.
        // Al cerrarla, se solicitarán nuevamente las credenciales. 
        auth: {
            storage: window.sessionStorage,
            persistSession: true,
            autoRefreshToken: true
        }
    }
);
