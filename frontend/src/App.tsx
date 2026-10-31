
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import MainLayout from "./layouts/MainLayout";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Maquinas from "./pages/Maquinas";
import Personas from "./pages/Personas";
import Averias from "./pages/Averias";
import Informes from "./pages/Informes";
import Imputaciones from "./pages/Imputaciones";
import Login from "./pages/Login";
import RutaProtegida from "./components/RutaProtegida";

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
                        <Route path="/personas" element={<Personas />} />
                        <Route path="/averias" element={<Averias />} />
                        <Route path="/imputaciones" element={<Imputaciones />} />
                        <Route path="/informes" element={<Informes />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
