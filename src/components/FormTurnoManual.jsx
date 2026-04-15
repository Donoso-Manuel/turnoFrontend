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
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-xl">

      <h2 className="text-xl font-bold mb-4">
        Ingreso Manual de Turno
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* RUT */}
        <input
          type="text"
          name="rut"
          placeholder="RUT (12345678-9)"
          value={form.rut}
          onChange={handleRutChange}
          className={`w-full border p-2 rounded ${
            rutValido ? '' : 'border-red-500'
            }`}
        />
        {!rutValido && (
        <span className="text-red-500 text-xs">
        RUT inválido
        </span>
        )}
        {/* Nombre */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Fecha */}
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Código turno */}
        <input
          type="text"
          name="codigoTurno"
          placeholder="Código turno"
          value={form.codigoTurno}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Horas */}
        <div className="flex gap-4">
          <input
            type="time"
            name="horaIngreso"
            value={form.horaIngreso}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="time"
            name="horaSalida"
            value={form.horaSalida}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading || !esValido()}
          className={`w-full py-2 rounded text-white ${
            loading || !esValido()
              ? 'bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Guardando...' : 'Guardar Turno'}
        </button>

        {/* MENSAJES */}
        {mensaje && (
          <div className="text-green-600 text-sm">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

      </form>
    </div>
    )
}