import { useState } from "react";
import { crearTurnoManual, validarRut } from "../api/turnos.api";

export default function FormTurnoManual(){
    const [form, setForm] = useState({
        rut:'',
        nombre:'',
        fecha:'',
        codigoTurno:'',
        horaIngreso:'',
        horaSalida:''
    });

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [rutValido, setRutValido] =  useState(true)

    const handleChange = (e) =>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleRutChange = (e)=>{
        const value = e.target.value;

        setForm({
            ...form,
            rut: value
        });
        setRutValido(validarRut(value))
    };
    const esValido = () =>{
        return(
            form.rut &&
            rutValido &&
            form.fecha &&
            form.horaIngreso &&
            form.horaSalida
        );
    };
    const handleSubmit = async(e)=>{
        e.preventDefault();

        setError(null);
        setMensaje(null);

        if(!esValido()){
            setError('Completa Todos los campos obligatorios');
            return;
        }
        try{
            setLoading(true);

            const res = await crearTurnoManual(form);
            setMensaje(res.mensaje || 'Turno cargado');

            setForm({
                rut:'',
                nombre:'',
                fecha:'',
                codigoTurno:'',
                horaIngreso:'',
                horaSalida:''
            });
        }catch(err){
            setError(err.response?.data?.error || 'Error al guardar')
        }finally{
            setLoading(false)
        }
    };
    return(
<div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">

  <div className="bg-white rounded-2xl p-6 max-w-xl">

    <h2 className="text-xl font-semibold text-gray-800 mb-5">
      Ingreso Manual de Turno
    </h2>

    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        name="rut"
        placeholder="RUT (12345678-9)"
        value={form.rut}
        onChange={handleRutChange}
        className={`w-full rounded-xl px-3 py-2 bg-gray-50 border transition focus:outline-none ${
          rutValido
            ? 'border-gray-200 focus:ring-2 focus:ring-indigo-400'
            : 'border-red-400 focus:ring-2 focus:ring-red-400'
        }`}
      />

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        className="w-full rounded-xl px-3 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-400"
      />

      <input
        type="date"
        name="fecha"
        value={form.fecha}
        onChange={handleChange}
        className="w-full rounded-xl px-3 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-400"
      />

      <div className="flex gap-3">
        <input
          type="time"
          name="horaIngreso"
          value={form.horaIngreso}
          onChange={handleChange}
          className="w-full rounded-xl px-3 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="time"
          name="horaSalida"
          value={form.horaSalida}
          onChange={handleChange}
          className="w-full rounded-xl px-3 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !esValido()}
        className={`w-full py-2.5 rounded-xl text-white font-medium transition-all ${
          loading || !esValido()
            ? 'bg-gray-400'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] hover:shadow-lg active:scale-95'
        }`}
      >
        {loading ? 'Guardando...' : 'Guardar Turno'}
      </button>

    </form>

  </div>
</div>
    )
}