import { BrowserRouter, Routes, Route } from 'react-router'
import MainLayout from './layouts/MainLayout'
import './App.css'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
       <MainLayout>
          <Routes>
              <Route path="/" element={<Dashboard />} />
          </Routes>
      </MainLayout>
    </BrowserRouter>
   
  )
}
export default App