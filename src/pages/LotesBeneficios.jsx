import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function LotesBeneficios() {

  const [lotes, setLotes] = useState([]);
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
        cargarLotes();
  }, []);

  const cargarLotes = async () => {
    try {
        let url = '/beneficios/lotes'
        if(desde && hasta && desde > hasta){
            alert('La fecha desde no puede ser mayor que hasta')
            return;
        }

        if(desde && hasta){
            url += `?desde=${desde}&hasta=${hasta}`
        }
      
        const res = await api.get(url);
      setLotes(res.data);
      console.log(lotes)
    } catch (error) {
      console.error(error);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-gray-100">

    <div className="max-w-6xl mx-auto">

      {/* VOLVER */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
      >
        ← Volver al Dashboard
      </button>

      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-6">
        Lotes de Pago
      </h1>

      {/* FILTROS */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
        <div className="bg-gray-900 rounded-2xl p-4 flex gap-3 items-center">

          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1"
          />

          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1"
          />

          <button
            onClick={cargarLotes}
            className="px-4 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700"
          >
            Filtrar
          </button>

        </div>
      </div>

      {/* TABLA */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3 text-left">Lote</th>
              <th className="p-3 text-left">Cantidad</th>
              <th className="p-3 text-left">Fecha Pago</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {lotes.map((l) => (
              <tr
                key={l.lote_pago}
                className="border-t border-gray-800 hover:bg-gray-800 transition"
              >
                <td className="p-3 text-indigo-400 font-semibold">
                  {l.lote_pago}
                </td>

                <td className="p-3 text-gray-300">
                  {l.cantidad}
                </td>

                <td className="p-3 text-gray-400">
                  {new Date(l.fecha_pago).toLocaleDateString('es-CL')}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => navigate(`/lotes/${l.lote_pago}`)}
                    className="text-indigo-400 hover:underline"
                  >
                    Ver detalle
                  </button>
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