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
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Lotes de Pago
      </h1>

      <div className="bg-white rounded-xl shadow">
        <div className='flex gap-2 mb-4'>
            <input type='date' value={desde} onChange={(e)=> setDesde(e.target.value)} className='border rounded px-2 py-1'/>
            <input type='date' value={hasta} onChange={(e)=> setHasta(e.target.value)} className='border roinded px-2 py-1'/>
            <button onClick={cargarLotes} className='bg-blue-600 text-white px-3 py-1 rounded'>
                Filtrar
            </button>
        </div>
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">Lote</th>
              <th>Cantidad</th>
              <th>Fecha Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {lotes.map((lote) => (
              <tr key={lote.lote_pago} className="border-t">

                <td className="p-2 font-medium">
                  {lote.lote_pago}
                </td>

                <td>{lote.cantidad}</td>

                <td>
                  {new Date(lote.fecha_pago).toLocaleDateString('es-CL')}
                </td>

                <td>
                  <button onClick={()=> navigate(`/lotes/${lote.lote_pago}`)} className="text-blue-600 hover:underline">
                    Ver detalle
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