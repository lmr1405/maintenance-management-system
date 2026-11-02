import "../../styles/Login.css";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../api/supabase";

function Login() {

    // Datos del formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estado de la petición
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();

    // Iniciar sesión con Supabase Auth
    async function iniciarSesion(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");

        // Comprobar que el cliente Supabase está disponible
        if (!supabase) {
            setError("El inicio de sesión no está disponible en modo demostración.");
            return;
        }

        setCargando(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        setCargando(false);

        if (error) {
            setError("Correo o contraseña incorrectos");
            return;
        }

        // Acceder a la aplicación
        navigate("/", { replace: true });
    }

    
    
    
    return (
        <div className="pagina-login">

            <div className="login-contenedor">

                {/* Tarjeta izquierda: información de la plataforma */}
                <section className="login-informacion">

                    <h1>Gestión de Mantenimiento</h1>

                    <h2>Sistema de gestión de incidencias técnicas</h2>

                    <p>
                        Plataforma web para gestionar el mantenimiento correctivo de maquinaria industrial. 
                        Permite reportar averías, asignar tareas al personal técnico y registrar el tiempo 
                        dedicado a cada reparación.
                    </p>

                    <p>
                        Centraliza los datos de equipos, técnicos e incidencias para facilitar el 
                        seguimiento del trabajo y consultar el historial de reparaciones en cualquier momento.
                    </p>

                </section>

                {/* Tarjeta derecha: inicio de sesión */}
                <section className="login">

                    <h2>Iniciar sesión</h2>

                    <p className="login-descripcion">
                        Introduce tus credenciales para acceder al sistema.
                    </p>

                    <form onSubmit={iniciarSesion}>

                        <div className="login-campo">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="usuario@empresa.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="login-campo">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Introduce tu contraseña"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        {error && (
                            <p className="login-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button type="submit" disabled={cargando}>
                            {cargando ? "Entrando..." : "Iniciar sesión"}
                        </button>

                    </form>

                </section>

            </div>

        </div>
    );

}

export default Login;
