import { useState } from 'react'
import './App.css'

import CargarTurnos from './pages/cargarTurnos';
import Beneficios from './pages/beneficios';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Beneficios />
  <CargarTurnos/>
    </>
  )
}

export default App
