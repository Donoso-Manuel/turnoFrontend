import { use, useState } from "react";
import { subirExcel, formatearFecha, descargarErroresExcel } from "../api/turnos.api";
import { useRef } from "react";
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";

function CargarTurnos() {

  const navigate = useNavigate();
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
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-6 text-gray-100">

    {/* VOLVER */}
    <button
      onClick={() => navigate('/')}
      className="mb-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur transition"
    >
      ← Volver al Dashboard
    </button>

    <div className="w-full max-w-md rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 shadow-2xl">

      <div className="bg-gray-900 rounded-2xl p-8">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Cargar Turnos
        </h1>

        {/* INPUT FILE */}
        <label className="block text-sm text-gray-400 mb-2">
          Archivo Excel
        </label>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileInputRef}
          className="w-full text-sm border border-gray-700 rounded-lg p-2 mb-6 bg-gray-800 file:bg-indigo-600 file:text-white file:border-0 file:px-3 file:py-1 file:rounded-lg hover:file:bg-indigo-700"
        />

        {/* BOTÓN */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-gray-600"
        >
          {loading ? 'Subiendo...' : 'Subir archivo'}
        </button>

        {/* CONFIRMAR */}
        {confirmacionPendiente && (
          <button
            onClick={() => handleSubmit(true)}
            className="w-full mt-3 py-3 rounded-xl bg-red-600 hover:bg-red-700"
          >
            Confirmar y Reemplazar
          </button>
        )}

        {/* MENSAJE */}
        {mensaje && (
          <p className="mt-4 text-sm text-center text-gray-300">
            {mensaje}
          </p>
        )}

        {/* ERRORES */}
        {errores.length > 0 && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 max-h-60 overflow-y-auto">

            <h3 className="text-red-400 font-semibold mb-2">
              ⚠️ {errores.length} errores detectados
            </h3>

            <table className="w-full text-sm">
              <tbody>
                {errores.map((e, i) => (
                  <tr key={i} className="border-b border-red-500/10">
                    <td className="py-1 text-white">{e.rut}</td>
                    <td className="text-gray-300">{e.nombre}</td>
                    <td className="text-gray-400">
                      {formatearFecha(e.fecha)}
                    </td>
                    <td className="text-red-400 text-xs">
                      {e.motivo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </div>
    </div>
  </div>
);
}

export default CargarTurnos;