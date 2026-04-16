import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route,Routes } from 'react-router-dom';

import CargarTurnos from './pages/cargarTurnos';
import Beneficios from './pages/beneficios';
import TurnosCorreccion from './pages/TurnosCorreccion';
import TurnoManual from './pages/TurnoManual';
import LotesBeneficios from './pages/LotesBeneficios';
import LoteDetalle from './pages/LoteDetalle';
import Acumulados from './pages/Acumulados';
import Dashboard from './pages/Dashboard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<BrowserRouter>
<Routes>
    <Route path='/' element={<Dashboard/>} />

  <Route path='/beneficios' element={<Beneficios/>} />
  <Route path='/lotes' element={<LotesBeneficios/>} />
  <Route path='/lotes/:lote' element={<LoteDetalle/>} />
  <Route path='/ingreso-turno' element={<TurnoManual/>}/>
  <Route path='/carga-turnos-masivo' element={<CargarTurnos/>} />
  <Route path='/modificador-turnos' element={  <TurnosCorreccion/>} />
  <Route path='/acumulados' element={<Acumulados/>} />
</Routes>
</BrowserRouter>

    </>
  )
}

export default App
