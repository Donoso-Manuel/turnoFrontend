import { useEffect, useState } from 'react';
import { getAcumulados, exportarAcumulados } from '../api/acumulados';
import { useNavigate } from 'react-router-dom';

export default function Acumulados() {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [rut, setRut] = useState('');

  const cargar = async () => {
    const res = await getAcumulados({ rut });
    setData(res);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleExportar = async () => {
    const blob = await exportarAcumulados({ rut });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'acumulados.xlsx');

    document.body.appendChild(link);
    link.click();
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">

    <div className="max-w-6xl mx-auto">

      {/* VOLVER */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur transition"
      >
        ← Volver al Dashboard
      </button>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">
          Reporte de Acumulados
        </h1>
        <p className="text-gray-400 text-sm">
          Consulta y exportación de noches acumuladas
        </p>
      </div>

      {/* FILTROS */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
        <div className="bg-gray-900 rounded-2xl p-4 flex flex-wrap gap-3 items-center">

          <input
            placeholder="Filtrar por RUT"
            onChange={(e) => setRut(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={cargar}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Buscar
          </button>

          <button
            onClick={handleExportar}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
          >
            Exportar
          </button>

        </div>
      </div>

      {/* TABLA */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700">

        <table className="w-full text-sm">

          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3 text-left">RUT</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Noches</th>
              <th className="p-3 text-left">Última Fecha</th>
            </tr>
          </thead>

          <tbody className="bg-gray-900">
            {data.map((d, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-gray-800 transition"
              >
                <td className="p-3 font-medium">{d.rut}</td>
                <td className="p-3 text-gray-300">{d.nombre}</td>
                <td className="p-3 text-indigo-400 font-semibold">
                  {d.noches_acumuladas}
                </td>
                <td className="p-3 text-gray-400">
                  {d.ultima_fecha?.split('T')[0]}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  </div>
);
}