/**
 * Archivo de configuración del cliente Supabase.
 * Establece la conexión con Supabase para gestionar la autenticación
 * de los usuarios y controlar sus sesiones.
 *
 * Configuración:
 * - SUPABASE_URL: dirección del proyecto Supabase.
 * - SUPABASE_KEY: clave pública para conectar con Supabase.
 * - createClient: crea el cliente de autenticación.
 * - sessionStorage: mantiene la sesión mientras la pestaña esté abierta.
 * - persistSession: permite conservar la sesión durante su uso.
 * - autoRefreshToken: renueva automáticamente el token de autenticación.
 */
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
