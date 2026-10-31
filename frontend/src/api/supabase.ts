import { createClient } from "@supabase/supabase-js";

// Variables de entorno del frontend
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Cliente para gestionar la autenticación
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
