/**
 * Archivo de configuración de la conexión con el backend.
 * Obtiene la dirección del servidor FastAPI desde las variables
 * de entorno para realizar las peticiones a la API.
 *
 * Constantes:
 * - API_URL: dirección base del servidor FastAPI.
 */
// Dirección del servidor FastAPI
export const API_URL = import.meta.env.VITE_API_URL;