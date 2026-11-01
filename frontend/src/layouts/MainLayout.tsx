/**
 * Componente MainLayout.
 * Define la estructura principal de la aplicación y organiza
 * los elementos comunes que aparecen en todas las páginas.
 *
 * Propiedades:
 * - children: contenido de la página que se muestra dentro del diseño.
 *
 * Funcionamiento:
 * - Sidebar: muestra el menú lateral de navegación.
 * - header: muestra la cabecera con el título de la aplicación.
 * - page-content: contiene la información de la página seleccionada.
 * - Footer: muestra el pie de página de la aplicación.
 * - MainLayout.css: establece la distribución y los estilos generales.
 *
 * Permite mantener una estructura visual uniforme en toda la aplicación.
 */
import type { ReactNode } from "react";
import '../styles/MainLayout.css'
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Propiedades que recibe el componente
interface MainLayoutProps 
{
    children: ReactNode
}

function MainLayout( { children }: MainLayoutProps)
{
    return (
        <div className="main-layout">
            
            {/* Menu lateral */}
            <Sidebar />


            {/* Zona principal de la aplicacion */}
            <div className="main-content">

                {/* cabecera */}
                <header className="header">
                    <h1>Gestión de Mantenimiento</h1>
                </header>

                {/* Contenido de cada pagina*/}
                <main className="page-content">
                    {children}
                </main>

                <Footer />

            </div>

        </div>
    )
}
export default MainLayout