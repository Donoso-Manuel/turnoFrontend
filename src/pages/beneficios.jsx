import { useEffect, useState } from 'react';
import { getBeneficios, exportarYPagar, exportarBeneficios } from '../api/beneficios';
import TablaBeneficios from '../components/tablaBeneficios';
import { construirFechas } from '../api/helper';
import { useNavigate } from 'react-router-dom';

export default function Beneficios() {

  const navigate = useNavigate();
  const [beneficios, setBeneficios] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [mes, setMes] = useState('');
  const [estado,setEstado] = useState(''); 
  const [rut, setRut] = useState('');
  const [loading,setLoading] =  useState(false);
  const [loadingPago, setLoadingPago] = useState(false);
  const [mensaje, setMensaje] =  useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] =  useState(1)
  const [limit] =  useState(20)
  const [total, setTotal] =  useState(0)
  
  
  const totalPaginas = Math.ceil(total/limit)

useEffect(() => {
  if (mensaje) {
    setTimeout(() => setMensaje(null), 4000);
  }
}, [mensaje]);
useEffect(() => {
  cargar();
}, [year, estado, rut, page]);

const cargar = async () => {
  setLoading(true);

  try {
    const {desde, hasta} = construirFechas(year,mes) 

    const res = await getBeneficios({
      desde,
      hasta,
      estado,
      rut,
      page,
      limit
    });

    setBeneficios(res.data.beneficios);
    setTotal(res.data.total);

  } finally {
    setLoading(false);
  }
};
const manejarPago = async () => {
  if (seleccionados.length === 0) return;

  setLoadingPago(true);
  setMensaje(null);
  setError(null);

  try {
    const res = await exportarYPagar(seleccionados);

    // 📥 descarga archivo
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pagos.xlsx');
    document.body.appendChild(link);
    link.click();

    // ✅ feedback
    setMensaje(`Se pagaron ${seleccionados.length} beneficios correctamente`);

    // limpiar
    setSeleccionados([]);

    // recargar tabla
    await cargar();

  } catch (err) {
    console.error(err);

    setError(
      err.response?.data?.error || 'Error al procesar el pago'
    );

  } finally {
    setLoadingPago(false);
  }
};
const handleExportar = async () => {
  try {
    const { desde, hasta } = construirFechas(year, mes);

    const blob = await exportarBeneficios({
      desde,
      hasta,
      estado,
      rut,
      exportar: true
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'beneficios.xlsx');

    document.body.appendChild(link);
    link.click();

  } catch (error) {
    console.error(error);
    alert('Error al exportar');
  }
};

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">

    <div className="max-w-7xl mx-auto">

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
          Gestión de Beneficios
        </h1>
        <p className="text-gray-400 text-sm">
          Administración, filtros y pago de beneficios
        </p>
      </div>

      {/* FILTROS */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
        <div className="bg-gray-900 rounded-2xl p-4 flex flex-wrap gap-4 items-end">

          <div>
            <label className="text-xs text-gray-400">Año</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="block bg-gray-800 border border-gray-700 rounded-lg p-2 mt-1"
            >
              {[2023, 2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400">Mes</label>
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="block bg-gray-800 border border-gray-700 rounded-lg p-2 mt-1"
            >
              <option value="">Todos</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>
                  {new Date(0, i).toLocaleString('es', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400">Estado</label>
            <select
              onChange={(e) => setEstado(e.target.value)}
              className="block bg-gray-800 border border-gray-700 rounded-lg p-2 mt-1"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendientes</option>
              <option value="PAGADO">Pagados</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400">RUT</label>
            <input
              type="text"
              placeholder="Buscar..."
              onChange={(e) => setRut(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg p-2 mt-1"
            />
          </div>

          <button
            onClick={cargar}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Buscar
          </button>

        </div>
      </div>

      {/* ALERTAS */}
      {mensaje && (
        <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
          {error}
        </div>
      )}

      {/* TABLA */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl p-4">

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <TablaBeneficios
              data={beneficios}
              seleccionados={seleccionados}
              setSeleccionados={setSeleccionados}
            />

            {/* FOOTER */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">

              <span className="text-sm text-gray-400">
                {beneficios.length} registros
              </span>

              <div className="flex gap-2">

                <button
                  onClick={manejarPago}
                  disabled={seleccionados.length === 0 || loadingPago}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 flex items-center gap-2"
                >
                  {loadingPago && (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  )}
                  Pagar ({seleccionados.length})
                </button>

                <button
                  onClick={handleExportar}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
                >
                  Exportar
                </button>

              </div>

              {/* PAGINACIÓN */}
              <div className="flex gap-2 items-center">

                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-800 rounded disabled:opacity-40"
                >
                  ←
                </button>

                <span className="text-sm text-gray-400">
                  {page} / {totalPaginas}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPaginas}
                  className="px-3 py-1 bg-gray-800 rounded disabled:opacity-40"
                >
                  →
                </button>

              </div>

            </div>
          </>
        )}

      </div>

    </div>
  </div>
);
}