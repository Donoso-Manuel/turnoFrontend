import FormTurnoManual from "../components/FormTurnoManual";
import { useNavigate } from "react-router-dom";

export default function TurnoManual(){

    const navigate = useNavigate();

    return(
        <div className="p-6 bg-gray-50 min-h-screen">
        <button onClick={()=> navigate('/')} className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
            Volver Al Dashboard
        </button>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">
                    Gestión de Turnos
                </h1>
                <FormTurnoManual/>
            </div>
        </div>
    )
}