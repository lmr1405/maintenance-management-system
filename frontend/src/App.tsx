import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import MainLayout from "./layouts/MainLayout";
import "./App.css";

import Dashboard from "./pages/dashboard/Dashboard";
import Maquinas from "./pages/maquinas/Maquinas";
import Personas from "./pages/personas/Personas";
import Averias from "./pages/averias/Averias";
import Informes from "./pages/informes/Informes";
import Imputaciones from "./pages/imputaciones/Imputaciones";
import Login from "./pages/login/Login";
import RutaProtegida from "./components/RutaProtegida";
import CrearMaquina from "./pages/maquinas/CrearMaquinas";
import CrearPersona from "./pages/personas/CrearPersonas";
import CrearImputacion from "./pages/imputaciones/CrearImputaciones";
import CrearAveria from "./pages/averias/CrearAveria";
import DetalleAveria from "./pages/averias/DetalleAveria";
import DetalleMaquina from "./pages/maquinas/DetalleMaquina";
import EditarMaquina from "./pages/maquinas/EditarMaquina";
import BajaMaquina from "./pages/maquinas/BajaMaquina";
import DetallePersona from "./pages/personas/DetallePersona";
import EditarPersona from "./pages/personas/EditarPersona";

function LayoutProtegido() {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta pública */}
                <Route path="/login" element={<Login />} />

                {/* Rutas privadas */}
                <Route element={<RutaProtegida />}>
                    <Route element={<LayoutProtegido />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/maquinas" element={<Maquinas />} />
                        <Route path="/maquinas/crear" element={<CrearMaquina />} />
                        <Route path="/maquinas/:id_maquina" element={<DetalleMaquina />} />
                        <Route path="/maquinas/:id_maquina/editar" element={<EditarMaquina />} />
                        <Route path="/maquinas/:id_maquina/baja" element={<BajaMaquina />} />
                        <Route path="/personas" element={<Personas />} />
                        <Route path="/personas/:id_persona" element={<DetallePersona />} />
                        <Route path="/personas/crear" element={<CrearPersona />} />
                        <Route path="/personas/:id_persona/editar" element={<EditarPersona />} />
                        <Route path="/averias" element={<Averias />} />
                        <Route path="/averias/crear" element={<CrearAveria />} />
                        <Route path="/averias/:id" element={<DetalleAveria />} />
                        <Route path="/imputaciones" element={<Imputaciones />} />
                        <Route path="/imputaciones/crear" element={<CrearImputacion />} />
                        <Route path="/informes" element={<Informes />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
