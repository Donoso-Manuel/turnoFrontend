import { useState } from 'react'
import './App.css'

import CargarTurnos from './pages/cargarTurnos';
import Beneficios from './pages/beneficios';
import TurnosCorreccion from './pages/TurnosCorreccion';
import TurnoManual from './pages/TurnoManual';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Beneficios />
  <CargarTurnos/>
  <TurnosCorreccion/>
  <TurnoManual/>
    </>
  )
}

export default App
