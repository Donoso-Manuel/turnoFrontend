import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKPIs } from '../api/kpis';

export default function Dashboard() {

  const navigate = useNavigate();

  const hoy = new Date();

  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1);

  const [kpis, setKpis] = useState({
    pendientes: 0,
    pagadosMes: 0,
    acumuladosCriticos: 0
  });

  const cargarKpis = async () => {
    const data = await getKPIs({ year, month });
    setKpis(data);
  };

  useEffect(() => {
    cargarKpis();
  }, [year, month]);

  const cards = [
    {
      titulo: 'Gestión de Beneficios',
      descripcion: 'Ver, filtrar y pagar beneficios',
      ruta: '/beneficios',
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      titulo: 'Lotes de Pago',
      descripcion: 'Consultar pagos realizados',
      ruta: '/lotes',
      color: 'from-emerald-500 to-emerald-700'
    },
    {
      titulo: 'Acumulados',
      descripcion: 'Noches acumuladas por colaborador',
      ruta: '/acumulados',
      color: 'from-violet-500 to-violet-700'
    },
    {
      titulo: 'Corrección de Turnos',
      descripcion: 'Modificar turnos existentes',
      ruta: '/modificador-turnos',
      color: 'from-amber-500 to-amber-600'
    },
    {
      titulo: 'Ingreso Manual',
      descripcion: 'Registrar turnos manualmente',
      ruta: '/ingreso-turno',
      color: 'from-pink-500 to-pink-600'
    },
    {
      titulo: 'Carga Masiva',
      descripcion: 'Importar turnos desde Excel',
      ruta: '/carga-turnos-masivo',
      color: 'from-cyan-500 to-cyan-700'
    }
  ];

  const cardKpis = [
    {
      titulo: 'Pendientes',
      valor: kpis.pendientes,
      color: 'text-red-400'
    },
    {
      titulo: 'Pagados',
      valor: kpis.pagadosMes,
      color: 'text-green-400'
    },
    {
      titulo: 'Críticos (+10)',
      valor: kpis.acumuladosCriticos,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Panel de control general del sistema
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4 mb-8">

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        >
          {[2024, 2025, 2026].map(y => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        {cardKpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-slate-800/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition"
          >
            <p className="text-slate-400 text-sm">
              {kpi.titulo}
            </p>

            <p className={`text-4xl font-bold mt-2 ${kpi.color}`}>
              {kpi.valor}
            </p>
          </div>
        ))}

      </div>

      {/* CARDS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.ruta)}
            className={`
              bg-gradient-to-br ${card.color}
              p-6 rounded-2xl
              shadow-lg
              cursor-pointer
              transform hover:-translate-y-1 hover:scale-[1.03]
              transition-all duration-300
              relative overflow-hidden
            `}
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition"></div>

            <h2 className="text-xl font-semibold relative z-10">
              {card.titulo}
            </h2>

            <p className="text-sm mt-2 opacity-90 relative z-10">
              {card.descripcion}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}