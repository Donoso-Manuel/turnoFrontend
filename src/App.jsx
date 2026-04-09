import { useState } from 'react'
import './App.css'

import CargarTurnos from './pages/cargarTurnos'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <CargarTurnos />
    </>
  )
}

export default App
