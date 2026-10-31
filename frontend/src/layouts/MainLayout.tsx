import type { ReactNode } from "react";
import '../styles/MainLayout.css'
import Sidebar from "../components/Sidebar";

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

            </div>

        </div>
    )
}
export default MainLayout