import FormTurnoManual from "../components/FormTurnoManual";
import { useNavigate } from "react-router-dom";

export default function TurnoManual(){

    const navigate = useNavigate();

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-gray-100">

    <div className="max-w-4xl mx-auto">

      {/* VOLVER */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur transition"
      >
        ← Volver al Dashboard
      </button>

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">
          Gestión de Turnos
        </h1>
        <p className="text-gray-400 text-sm">
          Ingreso manual de turnos y control operativo
        </p>
      </div>

      {/* FORM */}
      <div className="flex justify-center">
        <FormTurnoManual />
      </div>

    </div>
  </div>
);
}