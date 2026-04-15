import { use, useState } from "react";
import { subirExcel, formatearFecha, descargarErroresExcel } from "../api/turnos.api";
import { useRef } from "react";
import * as XLSX from 'xlsx';

function CargarTurnos() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] =  useState(false);
  const [mensaje, setMensaje] = useState('');
  const [confirmacionPendiente, setConfirmacionPendiente] =  useState(false);
  const fileInputRef = useRef(null);
  const [errores,setErrores] = useState([])

const handleSubmit = async (forzar = false) => {
  if (!file) {
    setMensaje('Debes seleccionar un archivo');
    return;
  }

  try {
    setLoading(true);
    setMensaje('');
    setErrores([]);

    const res = await subirExcel(file, forzar);

    // 🔥 CASO: requiere confirmación
    if (res.requiereConfirmacion) {
      setMensaje('⚠️ Ya existen datos en este rango. ¿Deseas reemplazarlos?');
      setConfirmacionPendiente(true);
      return;
    }

    const erroresDetectados = res.errores || [];

    setErrores(erroresDetectados);

    if(erroresDetectados.length > 0){
      descargarErroresExcel(erroresDetectados)
    }

    if(res.errores && res.errores.length > 0){
      setMensaje(`✔${res.totalTurnos} turnos cargados con ${res.errores.length} errores`);
    }else{
      setMensaje(`✔ ${res.totalTurnos} Turnos cargados correctamente`)
    }

    setConfirmacionPendiente(false);
    setFile(null)
    if(fileInputRef.current){
      fileInputRef.current.value='';
    }

  } catch (error) {
    setMensaje(error.error || '❌ Error al subir archivo');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md border border-gray-200">

        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Cargar Turnos
        </h1>

        <label className="block text-sm text-gray-600 mb-2">
          Selecciona archivo Excel
        </label>

        <input
          type="file"
          onChange={(e)=> setFile(e.target.files[0])}
          ref={fileInputRef}
          className="w-full text-sm border border-gray-300 rounded-lg p-2 mb-6 cursor-pointer file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
        />

        <button 
        onClick={handleSubmit} disabled={loading}
        className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-black transition-all duration-200">
          {loading ? 'Subiendo...' : 'Subir archivo'}
        </button>
        {confirmacionPendiente && (
          <button
          onClick={()=> handleSubmit(true)}
          className="w-full mt-3 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
          >
            Confirmar y Reemplazar
          </button>
        )}
        {mensaje && (
          <p className="mt-4 text-center text-sm text-gray-700">
          {mensaje}
          {errores.length > 0 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="text-red-700 font-semibold mb-2">
                Se detectaron [errores.length] errores
              </h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-red-800 border-b">
                    <tr>
                      <th className="py-1">RUT</th>
                      <th>Nombre</th>
                      <th>Fecha</th>
                      <th>Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errores.map((e, i)=>(
                      <tr key={i} className="border-b last:border-0">
                        <td>{e.rut}</td>
                        <td>{e.nombre}</td>
                        <td>{formatearFecha(e.fecha)}</td>
                        <td className="text-red-600 font-medium">{e.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )};
          </p>
        )}
      </div>
    </div>
  );
}

export default CargarTurnos;