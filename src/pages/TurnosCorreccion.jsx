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
    <div className="p-6 bg-gray-100 min-h-screen">
    <button onClick={()=> navigate('/')} className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
      Volver Al Dashboard
    </button>

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">Corrección de Turnos</h2>

        {/* 🔎 FILTROS */}
        <div className="flex gap-2 mb-4 flex-wrap">

          <input
            placeholder="RUT"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="border p-2 rounded w-40"
          />

          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={buscarTurnos}
            disabled={!puedeBuscar || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>

        </div>

        {/* ⚠️ VALIDACIÓN */}
        {!fechasValidas && (
          <p className="text-red-500 mb-2">
            La fecha "desde" no puede ser mayor que "hasta"
          </p>
        )}

        {/* 📋 TABLA */}
        <table className="w-full border text-sm">

          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">Fecha</th>
              <th className="p-2">Turno</th>
              <th className="p-2">Ingreso</th>
              <th className="p-2">Salida</th>
              <th className="p-2">Noche</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>

          <tbody>
            {turnos.map(t => (
              <tr key={t.id} className="border-t">

                <td className="p-2">
                  {t.fecha?.split('T')[0]}
                </td>

                <td className="p-2">
                  {t.codigo_turno}
                </td>

                <td className="p-2">
                  <input
                    value={t.hora_ingreso_edit}
                    onChange={(e) =>
                      handleChange(t.id, 'hora_ingreso_edit', e.target.value)
                    }
                    className="border p-1 rounded w-20"
                  />
                </td>

                <td className="p-2">
                  <input
                    value={t.hora_salida_edit}
                    onChange={(e) =>
                      handleChange(t.id, 'hora_salida_edit', e.target.value)
                    }
                    className="border p-1 rounded w-20"
                  />
                </td>

                <td className="p-2 text-center">
                  {t.es_noche ? '🌙' : '☀️'}
                </td>

                <td className="p-2">
                  <button
                    onClick={() => guardarTurno(t)}
                    disabled={guardandoId === t.id}
                    className="bg-green-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
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
  );
}
