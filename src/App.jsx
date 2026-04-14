import { useState } from 'react'
import './App.css'

import CargarTurnos from './pages/cargarTurnos';
import Beneficios from './pages/beneficios';
import TurnosCorreccion from './pages/TurnosCorreccion';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Beneficios />
  <CargarTurnos/>
  <TurnosCorreccion/>
    </>
  )
}

export default App
