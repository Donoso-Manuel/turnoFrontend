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
    <div className="p-6">
      <div className="bg-white rounded-xl shadow">
      <button onClick={()=> navigate('/lotes')} className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
        Volver A Lotes
      </button>
        <div className='flex justify-between mb-4'>
            <h1 className='text-2xl font-bold'>
                Detalle Lote: {lote}
            </h1>
            <button onClick={()=>exportar(lote)} className='bg-green-600 text-white px-4 py2 rounded hover:bg-green-700'>
                Exportar Excel
            </button>

        </div>
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">RUT</th>
              <th>Nombre</th>
              <th>Fecha Generación</th>
              <th>Fecha Pago</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t">

                <td className="p-2">{row.rut}</td>

                <td>{row.nombre}</td>

                <td>
                  {new Date(row.fecha_generacion).toLocaleDateString('es-CL')}
                </td>

                <td>
                  {new Date(row.fecha_pago).toLocaleDateString('es-CL')}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}