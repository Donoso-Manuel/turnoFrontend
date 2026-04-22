import { use, useState } from "react";
import  api from "../api/axios"
import { useNavigate } from "react-router-dom";

const hoy = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export default function TurnosCorreccion() {

  const [rut, setRut] = useState('');
  const [desde, setDesde] = useState(hoy());
  const [hasta, setHasta] = useState(hoy());
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guardandoId, setGuardandoId] = useState(null);
  const navigate = useNavigate();
  const fechasValidas = desde && hasta && desde <= hasta;
  const puedeBuscar = rut.trim() !== '' && fechasValidas;

  const buscarTurnos = async () => {
    if (!puedeBuscar) return;

    setLoading(true);

    try {
      const res = await api.get('/turnos', {
        params: { rut, desde, hasta }
      });

      const data = res.data.map(t => ({
        ...t,
        hora_ingreso_edit: t.hora_ingreso,
        hora_salida_edit: t.hora_salida
      }));

      setTurnos(data);

    } catch (error) {
      console.error(error);
      alert('Error al buscar turnos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id, field, value) => {
    setTurnos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, [field]: value } : t
      )
    );
  };

  const guardarTurno = async (turno) => {
    try {
      setGuardandoId(turno.id);

      await api.put(`/turnos/${turno.id}/corregir`, {
        horaIngreso: turno.hora_ingreso_edit,
        horaSalida: turno.hora_salida_edit
      });

      await buscarTurnos();

    } catch (error) {
      console.error(error);
      alert('Error al guardar turno');
    } finally {
      setGuardandoId(null);
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
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Corrección de Turnos
        </h2>
        <p className="text-gray-400 text-sm">
          Ajuste manual de horarios y recalculo automático
        </p>
      </div>

      {/* FILTROS */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
        <div className="bg-gray-900 rounded-2xl p-4 flex flex-wrap gap-3 items-center">

          <input
            placeholder="RUT"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-40"
          />

          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          />

          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          />

          <button
            onClick={buscarTurnos}
            disabled={!puedeBuscar || loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>

        </div>
      </div>

      {/* VALIDACIÓN */}
      {!fechasValidas && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl">
          La fecha "desde" no puede ser mayor que "hasta"
        </div>
      )}

      {/* TABLA */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Turno</th>
              <th className="p-3 text-left">Ingreso</th>
              <th className="p-3 text-left">Salida</th>
              <th className="p-3 text-center">Noche</th>
              <th className="p-3 text-left">Acción</th>
            </tr>
          </thead>

          <tbody>
            {turnos.map(t => (
              <tr
                key={t.id}
                className="border-t border-gray-800 hover:bg-gray-800/70 transition"
              >

                <td className="p-3 text-gray-300">
                  {t.fecha?.split('T')[0]}
                </td>

                <td className="p-3 text-indigo-400 font-semibold">
                  {t.codigo_turno}
                </td>

                <td className="p-3">
                  <input
                    value={t.hora_ingreso_edit}
                    onChange={(e) =>
                      handleChange(t.id, 'hora_ingreso_edit', e.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 w-24 focus:ring-2 focus:ring-indigo-500"
                  />
                </td>

                <td className="p-3">
                  <input
                    value={t.hora_salida_edit}
                    onChange={(e) =>
                      handleChange(t.id, 'hora_salida_edit', e.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 w-24 focus:ring-2 focus:ring-indigo-500"
                  />
                </td>

                <td className="p-3 text-center text-xl">
                  {t.es_noche ? '🌙' : '☀️'}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => guardarTurno(t)}
                    disabled={guardandoId === t.id}
                    className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                  >
                    {guardandoId === t.id ? 'Guardando...' : 'Guardar'}
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
