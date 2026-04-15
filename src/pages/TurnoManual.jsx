import FormTurnoManual from "../components/FormTurnoManual";

export default function TurnoManual(){
    return(
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">
                    Gestión de Turnos
                </h1>
                <FormTurnoManual/>
            </div>
        </div>
    )
}