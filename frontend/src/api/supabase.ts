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

// Identificar si se ejecuta en modo demostración
const modoDemo = import.meta.env.VITE_DEMO_MODE === "true";

// Variables de Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Comprobar la configuración cuando se requiere autenticación
if (!modoDemo && (!SUPABASE_URL || !SUPABASE_KEY)) {
    throw new Error("Faltan las variables de configuración de Supabase");
}


/**
 * Crear el cliente Supabase solo cuando se requiere autenticación.
 * En modo demostración no se inicializa el cliente.
 */
export const supabase = modoDemo
    ? null
    : createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
            // Mantener la sesión mientras la pestaña esté abierta
            auth: {
                storage: window.sessionStorage,
                persistSession: true,
                autoRefreshToken: true
            }
        }
    );

