import { BrowserRouter, Routes, Route } from 'react-router'
import MainLayout from './layouts/MainLayout'
import './App.css'
import Dashboard from './pages/Dashboard'
import Maquinas from './pages/Maquinas'
import Personas from './pages/Personas'
import Averias from './pages/Averias'
import Informes from './pages/Informes'
import Imputaciones from './pages/Imputaciones'

function App() {
  return (
    <BrowserRouter>
       <MainLayout>
          <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path='/maquinas' element={<Maquinas />} />
              <Route path='/personas' element={<Personas />} />
              <Route path='/averias' element={<Averias />} />
              <Route path='/imputaciones' element={<Imputaciones />} />
              <Route path='/informes' element={<Informes />} />
          </Routes>
      </MainLayout>
    </BrowserRouter>
   
  )
}
export default App