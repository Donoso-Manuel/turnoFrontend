import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

  const navigate = useNavigate();

  const cards = [
    {
      titulo: 'Gestión de Beneficios',
      descripcion: 'Ver, filtrar y pagar beneficios',
      ruta: '/beneficios',
      color: 'bg-blue-500'
    },
    {
      titulo: 'Lotes de Pago',
      descripcion: 'Consultar pagos realizados',
      ruta: '/lotes',
      color: 'bg-green-500'
    },
    {
      titulo: 'Acumulados',
      descripcion: 'Noches acumuladas por colaborador',
      ruta: '/acumulados',
      color: 'bg-purple-500'
    },
    {
      titulo: 'Corrección de Turnos',
      descripcion: 'Modificar turnos existentes',
      ruta: '/modificador-turnos',
      color: 'bg-yellow-500'
    },
    {
      titulo: 'Ingreso Manual',
      descripcion: 'Registrar turnos manualmente',
      ruta: '/ingreso-turno',
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.ruta)}
            className={`${card.color} text-white p-6 rounded-2xl shadow cursor-pointer hover:scale-105 transition`}
          >
            <h2 className="text-xl font-semibold">
              {card.titulo}
            </h2>
            <p className="text-sm opacity-90 mt-2">
              {card.descripcion}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}