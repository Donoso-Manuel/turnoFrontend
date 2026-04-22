import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { exportar } from '../api/beneficios';
import { useNavigate } from 'react-router-dom';

export default function LoteDetalle() {

  const navigate = useNavigate();
  const { lote } = useParams();

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarDetalle();
  }, []);

  const cargarDetalle = async () => {
    try {
      const res = await api.get(`/beneficios/lotes/${lote}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-gray-100">

    <div className="max-w-6xl mx-auto">

      {/* VOLVER */}
      <button
        onClick={() => navigate('/lotes')}
        className="mb-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
      >
        ← Volver a Lotes
      </button>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Lote: <span className="text-indigo-400">{lote}</span>
        </h1>

        <button
          onClick={() => exportar(lote)}
          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
        >
          Exportar Excel
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3 text-left">RUT</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Fecha Generación</th>
              <th className="p-3 text-left">Fecha Pago</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-800 hover:bg-gray-800 transition"
              >
                <td className="p-3 text-white font-semibold">{row.rut}</td>
                <td className="p-3 text-gray-300">{row.nombre}</td>
                <td className="p-3 text-gray-400">
                  {new Date(row.fecha_generacion).toLocaleDateString('es-CL')}
                </td>
                <td className="p-3 text-gray-400">
                  {new Date(row.fecha_pago).toLocaleDateString('es-CL')}
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