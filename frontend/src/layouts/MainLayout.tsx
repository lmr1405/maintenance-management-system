import type { ReactNode } from "react";
import '../styles/MainLayout.css'

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
            <aside className="sidebar">
                <h2>Mantenimiento</h2>
            </aside>


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