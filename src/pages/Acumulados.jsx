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
    <>
    <button onClick={()=> navigate('/')} className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
      Volver Al Dashboard
    </button>
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Reporte de Acumulados
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="Filtrar por RUT"
          onChange={(e) => setRut(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={cargar}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>

        <button
          onClick={handleExportar}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Exportar
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Noches</th>
            <th>Última Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.rut}</td>
              <td>{d.nombre}</td>
              <td>{d.noches_acumuladas}</td>
              <td>{d.ultima_fecha?.split('T')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
    </>
  );
}