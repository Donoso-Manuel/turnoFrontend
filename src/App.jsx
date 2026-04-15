import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route,Routes } from 'react-router-dom';

import CargarTurnos from './pages/cargarTurnos';
import Beneficios from './pages/beneficios';
import TurnosCorreccion from './pages/TurnosCorreccion';
import TurnoManual from './pages/TurnoManual';
import LotesBeneficios from './pages/LotesBeneficios';
import LoteDetalle from './pages/LoteDetalle';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<BrowserRouter>
<Routes>
  <Route path='/' element={<Beneficios/>} />
  <Route path='/lotes' element={<LotesBeneficios/>} />
  <Route path='/lotes/:lote' element={<LoteDetalle/>} />
  <Route path='/ingreso-turno' element={<TurnoManual/>}/>
  <Route path='/carga-turnos-masivo' element={<CargarTurnos/>} />
  <Route path='/modificador-turnos' element={  <TurnosCorreccion/>} />
</Routes>
</BrowserRouter>

    </>
  )
}

export default App
