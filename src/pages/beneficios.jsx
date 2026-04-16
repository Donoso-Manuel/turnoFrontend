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
    
  <div className="p-6 bg-gray-50 min-h-screen">

    <div className="max-w-7xl mx-auto">
    <button onClick={()=> navigate('/')} className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
      Volver Al Dashboard
    </button>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Beneficios
        </h1>
        <p className="text-gray-500">
          Administración, filtros y pago de beneficios
        </p>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6 flex flex-wrap gap-4 items-end">

        {/* Año */}
        <div>
          <label className="text-sm text-gray-500">Año</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="block border rounded-lg p-2"
          >
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className='text-sm text-gray-500'>Mes</label>
          <select value={mes} onChange={(e)=> setMes(e.target.value)} className='block border rounded-lg p-2'>
            <option value="">Todos</option>
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="text-sm text-gray-500">Estado</label>
          <select
            onChange={(e) => setEstado(e.target.value)}
            className="block border rounded-lg p-2"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="PAGADO">Pagados</option>
          </select>
        </div>

        {/* Buscar por RUT */}
        <div>
          <label className="text-sm text-gray-500">RUT</label>
          <input
            type="text"
            placeholder="Buscar..."
            onChange={(e) => setRut(e.target.value)}
            className="border rounded-lg p-2"
          />
        </div>

        {/* BOTÓN RECARGAR */}
        <button
          onClick={cargar}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Buscar
        </button>

      </div>
    {mensaje && (
  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
    {mensaje}
  </div>
)}

{error && (
  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
    {error}
  </div>
)}
      {/* TABLA */}
<div className="bg-white rounded-2xl shadow p-4">

  {loading ? (
<div className="flex justify-center py-10">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
</div>
  ) : (
    <>
      <TablaBeneficios
        data={beneficios}
        seleccionados={seleccionados}
        setSeleccionados={setSeleccionados}
      />

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          {beneficios.length} registros
        </span>

<button
  onClick={manejarPago}
  disabled={seleccionados.length === 0 || loadingPago}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 flex items-center gap-2"
>
  {loadingPago && (
    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
  )}

  {loadingPago ? 'Procesando...' : `Pagar y Exportar (${seleccionados.length})`}
</button>
<button onClick={handleExportar} className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg'>
  Exportar Seleccion
</button>
<div className="flex justify-center mt-6 gap-2">

  <button
    onClick={() => setPage(page - 1)}
    disabled={page === 1}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    ←
  </button>

  <span className="px-3 py-1">
    Página {page} de {totalPaginas}
  </span>

  <button
    onClick={() => setPage(page + 1)}
    disabled={page === totalPaginas}
    className="px-3 py-1 border rounded disabled:opacity-50"
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